// CivicEye Hybrid Cloud & Persistent Database Service
// Powered by Supabase PostgreSQL (Cloud) with seamless Browser IndexedDB & LocalStorage offline cache.
// Handles Problem Clusters, Citizen Reports, Verification Tasks, Cameras, Fleet, and Audit Logs.

import { 
  INITIAL_CLUSTERS, 
  LIVE_CAMERAS, 
  INITIAL_CITIZEN_REPORTS, 
  VERIFICATION_QUEUE, 
  USER_PROFILE, 
  MUNICIPAL_DEPARTMENTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/civicData';
import { MCD_VEHICLE_FLEET } from '../data/mcdFleetData';
import { 
  getSupabaseClient, 
  isSupabaseConfigured, 
  uploadMediaToSupabase,
  subscribeToSupabaseTable 
} from './supabaseClient';

const DB_NAME = 'CivicEye_LocalDataLake_v1';
const DB_VERSION = 1;
const STORES = [
  'clusters',
  'citizenReports',
  'verificationQueue',
  'cameras',
  'mcdVehicles',
  'auditLogs',
  'userProfile',
  'departments'
];

// Mapping JS Store Names to Supabase Postgres Table Names
const STORE_TO_PG_TABLE = {
  clusters: 'clusters',
  citizenReports: 'citizen_reports',
  verificationQueue: 'verification_queue',
  cameras: 'cameras',
  mcdVehicles: 'mcd_vehicles',
  auditLogs: 'audit_logs',
  userProfile: 'user_profile',
  departments: 'departments'
};

const PG_TABLE_TO_STORE = Object.entries(STORE_TO_PG_TABLE).reduce((acc, [store, table]) => {
  acc[table] = store;
  return acc;
}, {});

let dbInstance = null;

// Open IndexedDB connection for local offline caching
const openDatabase = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        STORES.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        resolve(dbInstance);
      };

      request.onerror = () => {
        resolve(null);
      };
    } catch (e) {
      resolve(null);
    }
  });
};

// LocalStorage Fallback Helpers
const getLsKey = (store) => `civiceye_db_${store}`;

const readLocalStorage = (store) => {
  try {
    const raw = localStorage.getItem(getLsKey(store));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const writeLocalStorage = (store, data) => {
  try {
    localStorage.setItem(getLsKey(store), JSON.stringify(data));
  } catch (e) {}
};

// Local IndexedDB Helper functions
const getLocalAll = async (storeName) => {
  const db = await openDatabase();
  if (!db) return readLocalStorage(storeName) || [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve(readLocalStorage(storeName) || []);
    } catch (e) {
      resolve(readLocalStorage(storeName) || []);
    }
  });
};

const putLocal = async (storeName, item) => {
  const db = await openDatabase();
  if (!db) {
    const all = readLocalStorage(storeName) || [];
    const idx = all.findIndex((x) => x.id === item.id);
    if (idx >= 0) all[idx] = item;
    else all.unshift(item);
    writeLocalStorage(storeName, all);
    return item;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put(item);
      tx.oncomplete = () => {
        getLocalAll(storeName).then((items) => writeLocalStorage(storeName, items));
        resolve(item);
      };
      tx.onerror = () => resolve(item);
    } catch (e) {
      resolve(item);
    }
  });
};

const bulkPutLocal = async (storeName, items = []) => {
  if (!items || items.length === 0) return true;
  const db = await openDatabase();
  if (!db) {
    writeLocalStorage(storeName, items);
    return true;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      items.forEach((item) => store.put(item));
      tx.oncomplete = () => {
        writeLocalStorage(storeName, items);
        resolve(true);
      };
      tx.onerror = () => resolve(false);
    } catch (e) {
      writeLocalStorage(storeName, items);
      resolve(false);
    }
  });
};

const deleteLocal = async (storeName, id) => {
  const db = await openDatabase();
  if (!db) {
    const all = readLocalStorage(storeName) || [];
    const filtered = all.filter((x) => x.id !== id);
    writeLocalStorage(storeName, filtered);
    return true;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.delete(id);
      tx.oncomplete = () => {
        getLocalAll(storeName).then((items) => writeLocalStorage(storeName, items));
        resolve(true);
      };
      tx.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
};

export const dbService = {
  // Initialize Database with default datasets if empty, and sync with Supabase
  async initDatabase() {
    await openDatabase();

    const initialMap = {
      clusters: INITIAL_CLUSTERS,
      cameras: LIVE_CAMERAS,
      citizenReports: INITIAL_CITIZEN_REPORTS,
      verificationQueue: VERIFICATION_QUEUE,
      mcdVehicles: MCD_VEHICLE_FLEET,
      departments: MUNICIPAL_DEPARTMENTS,
      auditLogs: INITIAL_AUDIT_LOGS,
      userProfile: [USER_PROFILE]
    };

    // 1. Ensure local cache has initial datasets including new district entries
    for (const [store, defaultData] of Object.entries(initialMap)) {
      const existing = await getLocalAll(store);
      if (!existing || existing.length === 0) {
        await bulkPutLocal(store, defaultData);
      } else {
        // Ensure new seed items (e.g. Sheikhpura datasets) are present in local store
        const existingIds = new Set(existing.map((x) => x.id));
        const missing = defaultData.filter((x) => !existingIds.has(x.id));
        if (missing.length > 0) {
          await bulkPutLocal(store, [...missing, ...existing]);
        }
      }
    }

    // 2. If Supabase is connected, check and seed cloud tables
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        for (const [store, defaultData] of Object.entries(initialMap)) {
          const pgTable = STORE_TO_PG_TABLE[store] || store;
          await supabase.from(pgTable).upsert(defaultData);
        }
      } catch (err) {
        console.warn('Supabase initial seed error (offline or invalid table):', err);
      }
    }

    return true;
  },

  // Get all records from a store / table
  async getAll(storeName) {
    const pgTable = STORE_TO_PG_TABLE[storeName] || storeName;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase.from(pgTable).select('*');
        if (!error && data && data.length > 0) {
          // Update local cache in background
          bulkPutLocal(storeName, data);
          return data;
        }
      } catch (err) {
        console.warn(`Supabase fetch error for ${storeName}, falling back to local:`, err);
      }
    }

    return await getLocalAll(storeName);
  },

  // Get single record by ID
  async getById(storeName, id) {
    const pgTable = STORE_TO_PG_TABLE[storeName] || storeName;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from(pgTable)
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return data;
        }
      } catch (err) {}
    }

    const all = await getLocalAll(storeName);
    return all.find((item) => item.id === id) || null;
  },

  // Insert or update a single record (with optional automatic media upload to Supabase Storage)
  async put(storeName, item) {
    if (!item.id) {
      item.id = `${storeName.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Auto-upload base64 media to Supabase storage if available
    if (item.mediaUrl && item.mediaUrl.startsWith('data:image')) {
      try {
        const cdnUrl = await uploadMediaToSupabase(item.mediaUrl, `${item.id}-media.jpg`);
        if (cdnUrl) {
          item.mediaUrl = cdnUrl;
          item.photoUrl = cdnUrl;
        }
      } catch (e) {}
    } else if (item.photoUrl && item.photoUrl.startsWith('data:image')) {
      try {
        const cdnUrl = await uploadMediaToSupabase(item.photoUrl, `${item.id}-photo.jpg`);
        if (cdnUrl) {
          item.photoUrl = cdnUrl;
        }
      } catch (e) {}
    }

    // 1. Save to local IndexedDB & LocalStorage immediately for zero-latency UI
    await putLocal(storeName, item);

    // 2. Sync to Supabase Cloud in parallel
    const pgTable = STORE_TO_PG_TABLE[storeName] || storeName;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from(pgTable)
          .upsert(item)
          .select();

        if (!error && data && data[0]) {
          return data[0];
        }
      } catch (err) {
        console.warn(`Supabase upsert error for ${storeName}:`, err);
      }
    }

    return item;
  },

  // Bulk put items
  async bulkPut(storeName, items = []) {
    if (!items || items.length === 0) return true;

    // Save locally
    await bulkPutLocal(storeName, items);

    // Sync to Supabase
    const pgTable = STORE_TO_PG_TABLE[storeName] || storeName;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        await supabase.from(pgTable).upsert(items);
      } catch (err) {
        console.warn(`Supabase bulkPut error for ${storeName}:`, err);
      }
    }

    return true;
  },

  // Delete a record by ID
  async delete(storeName, id) {
    await deleteLocal(storeName, id);

    const pgTable = STORE_TO_PG_TABLE[storeName] || storeName;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        await supabase.from(pgTable).delete().eq('id', id);
      } catch (err) {}
    }

    return true;
  },

  // Subscribe to real-time table changes across devices / tabs
  subscribe(storeName, onEvent) {
    const pgTable = STORE_TO_PG_TABLE[storeName] || storeName;
    return subscribeToSupabaseTable(pgTable, (payload) => {
      if (onEvent) {
        onEvent({
          storeName,
          eventType: payload.eventType, // 'INSERT' | 'UPDATE' | 'DELETE'
          new: payload.new,
          old: payload.old
        });
      }
    });
  },

  // Export complete database backup as JSON
  async exportBackupJson() {
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      storageEngine: isSupabaseConfigured() ? 'Supabase PostgreSQL' : 'IndexedDB DataLake',
      collections: {}
    };

    for (const store of STORES) {
      backup.collections[store] = await this.getAll(store);
    }

    return JSON.stringify(backup, null, 2);
  },

  // Reset database back to factory initial state
  async resetToDefaults() {
    const initialMap = {
      clusters: INITIAL_CLUSTERS,
      cameras: LIVE_CAMERAS,
      citizenReports: INITIAL_CITIZEN_REPORTS,
      verificationQueue: VERIFICATION_QUEUE,
      mcdVehicles: MCD_VEHICLE_FLEET,
      departments: MUNICIPAL_DEPARTMENTS,
      auditLogs: INITIAL_AUDIT_LOGS,
      userProfile: [USER_PROFILE]
    };

    for (const [store, defaultData] of Object.entries(initialMap)) {
      await this.bulkPut(store, defaultData);
    }

    return true;
  }
};
