// CivicEye Persistent Database Service
// Powered by browser IndexedDB with automatic LocalStorage fallback.
// Manages persistent storage for Problem Clusters, Citizen Reports, Verification Tasks, Cameras, Fleet, and Audit Logs.

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

let dbInstance = null;

// Open IndexedDB connection
const openDatabase = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB not supported in this environment, using LocalStorage fallback.');
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

      request.onerror = (err) => {
        console.warn('IndexedDB open error, falling back to LocalStorage:', err);
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB exception:', e);
      resolve(null);
    }
  });
};

// LocalStorage Fallback Helper
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
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
};

export const dbService = {
  // Initialize Database with default datasets if empty
  async initDatabase() {
    const db = await openDatabase();

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
      const existing = await this.getAll(store);
      if (!existing || existing.length === 0) {
        await this.bulkPut(store, defaultData);
      }
    }

    return true;
  },

  // Get all records from a store
  async getAll(storeName) {
    const db = await openDatabase();
    if (!db) {
      const data = readLocalStorage(storeName);
      return data || [];
    }

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
  },

  // Get single record by ID
  async getById(storeName, id) {
    const db = await openDatabase();
    if (!db) {
      const all = readLocalStorage(storeName) || [];
      return all.find(item => item.id === id) || null;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  },

  // Insert or update a single record
  async put(storeName, item) {
    if (!item.id) {
      item.id = `${storeName.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    const db = await openDatabase();
    if (!db) {
      const all = readLocalStorage(storeName) || [];
      const index = all.findIndex(x => x.id === item.id);
      if (index >= 0) {
        all[index] = item;
      } else {
        all.unshift(item);
      }
      writeLocalStorage(storeName, all);
      return item;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(item);
        tx.oncomplete = () => {
          this.getAll(storeName).then(items => writeLocalStorage(storeName, items));
          resolve(item);
        };
        tx.onerror = () => resolve(item);
      } catch (e) {
        resolve(item);
      }
    });
  },

  // Bulk put items
  async bulkPut(storeName, items = []) {
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
        items.forEach(item => store.put(item));
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
  },

  // Delete a record by ID
  async delete(storeName, id) {
    const db = await openDatabase();
    if (!db) {
      const all = readLocalStorage(storeName) || [];
      const filtered = all.filter(x => x.id !== id);
      writeLocalStorage(storeName, filtered);
      return true;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(id);
        tx.oncomplete = () => {
          this.getAll(storeName).then(items => writeLocalStorage(storeName, items));
          resolve(true);
        };
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  },

  // Export complete database backup as JSON
  async exportBackupJson() {
    const backup = {
      version: "1.0",
      timestamp: new Date().toISOString(),
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
