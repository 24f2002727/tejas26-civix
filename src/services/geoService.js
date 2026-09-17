// CivicEye Geolocation & Locality Verification Service
// Handles high-accuracy GPS with multi-tier fallback, dynamic reverse geocoding, and custom location search.

const LOCALITY_STORAGE_KEY = 'civiceye_verified_locality';

export const QUICK_DISTRICTS = [
  { name: 'Patna', lat: 25.6094, lng: 85.1376, locality: 'Fraser Road & Dak Bungalow (Ward 8)' },
  { name: 'Gaya', lat: 24.7955, lng: 85.0002, locality: 'Civil Lines & GB Road (Ward 7)' },
  { name: 'Muzaffarpur', lat: 26.1209, lng: 85.3647, locality: 'Saraiyaganj & Tower Chowk (Ward 4)' },
  { name: 'Bhagalpur', lat: 25.2425, lng: 86.9842, locality: 'Tilkamanjhi Chowk (Ward 2)' },
  { name: 'Darbhanga', lat: 26.1542, lng: 85.8918, locality: 'Laheriasarai Tower Chowk' },
  { name: 'Purnia', lat: 25.7771, lng: 87.4753, locality: 'Line Bazar & Bhatta Bazar' },
  { name: 'Begusarai', lat: 25.4182, lng: 86.1272, locality: 'Har-Har Mahadev Chowk' },
  { name: 'Arrah', lat: 25.5541, lng: 84.6637, locality: 'Gola Road & Collectorate' },
  { name: 'Delhi NCR', lat: 28.6315, lng: 77.2167, locality: 'Connaught Place & Central' },
  { name: 'Bengaluru', lat: 12.9784, lng: 77.6408, locality: 'Indiranagar & 100 Feet Road' }
];

export const POPULAR_WARDS = [
  // Patna Wards
  {
    id: "patna-w08",
    city: "Patna",
    locality: "Fraser Road & Dak Bungalow (Ward 8)",
    shortName: "Patna - Ward 8 (Fraser Road)",
    lat: 25.6094,
    lng: 85.1376,
    landmark: "Near Dak Bungalow Crossing",
    zone: "Patna Central Zone"
  },
  {
    id: "patna-w12",
    city: "Patna",
    locality: "Boring Road & Sri Krishna Puri (Ward 12)",
    shortName: "Patna - Ward 12 (Boring Road)",
    lat: 25.6186,
    lng: 85.1128,
    landmark: "Near Boring Canal Road",
    zone: "New Capital Zone"
  },
  {
    id: "patna-w21",
    city: "Patna",
    locality: "Kankarbagh Main Colony (Ward 21)",
    shortName: "Patna - Ward 21 (Kankarbagh)",
    lat: 25.5912,
    lng: 85.1534,
    landmark: "Near Tiwary Bechar",
    zone: "Kankarbagh Zone"
  },
  {
    id: "patna-w05",
    city: "Patna",
    locality: "Bailey Road & Raja Bazar (Ward 5)",
    shortName: "Patna - Ward 5 (Bailey Road)",
    lat: 25.6145,
    lng: 85.0872,
    landmark: "Near Paras HMRI / IGIMS",
    zone: "Patliputra Zone"
  },
  {
    id: "patna-w01",
    city: "Patna",
    locality: "Gandhi Maidan & Ashok Rajpath (Ward 1)",
    shortName: "Patna - Ward 1 (Gandhi Maidan)",
    lat: 25.6208,
    lng: 85.1481,
    landmark: "Near Maurya Lok & Gate 1",
    zone: "Bankipur Zone"
  },
  {
    id: "patna-w18",
    city: "Patna",
    locality: "Rajendra Nagar & Stadium (Ward 18)",
    shortName: "Patna - Ward 18 (Rajendra Nagar)",
    lat: 25.5991,
    lng: 85.1610,
    landmark: "Near Moin-ul-Haq Stadium",
    zone: "Kankarbagh Zone"
  },
  {
    id: "patna-w03",
    city: "Patna",
    locality: "Danapur Cantt & Saguna More (Ward 3)",
    shortName: "Patna - Ward 3 (Saguna More)",
    lat: 25.6062,
    lng: 85.0425,
    landmark: "Near Saguna More Junction",
    zone: "Danapur Zone"
  },
  // Major Bihar Districts
  {
    id: "gaya-w07",
    city: "Gaya",
    locality: "Civil Lines & GB Road (Ward 7)",
    shortName: "Gaya - Ward 7 (Civil Lines)",
    lat: 24.7955,
    lng: 85.0002,
    landmark: "Near Gaya Collectorate",
    zone: "Gaya Central"
  },
  {
    id: "muz-w04",
    city: "Muzaffarpur",
    locality: "Saraiyaganj & Tower Chowk (Ward 4)",
    shortName: "Muzaffarpur - Ward 4",
    lat: 26.1209,
    lng: 85.3647,
    landmark: "Near Tower Chowk",
    zone: "Muzaffarpur Central"
  },
  {
    id: "bhag-w02",
    city: "Bhagalpur",
    locality: "Station Road & Tilkamanjhi (Ward 2)",
    shortName: "Bhagalpur - Tilkamanjhi",
    lat: 25.2425,
    lng: 86.9842,
    landmark: "Near Tilkamanjhi Chowk",
    zone: "Bhagalpur Urban"
  },
  {
    id: "dar-w01",
    city: "Darbhanga",
    locality: "Laheriasarai & Tower Chowk",
    shortName: "Darbhanga - Laheriasarai",
    lat: 26.1542,
    lng: 85.8918,
    landmark: "Near DM Office",
    zone: "Darbhanga Central"
  },
  {
    id: "pur-w01",
    city: "Purnia",
    locality: "Line Bazar & Bhatta Bazar",
    shortName: "Purnia - Line Bazar",
    lat: 25.7771,
    lng: 87.4753,
    landmark: "Near Medical College",
    zone: "Purnia Urban"
  },
  {
    id: "beg-w01",
    city: "Begusarai",
    locality: "Har-Har Mahadev Chowk",
    shortName: "Begusarai Central",
    lat: 25.4182,
    lng: 86.1272,
    landmark: "Near Bus Stand",
    zone: "Begusarai Urban"
  },
  {
    id: "arr-w01",
    city: "Arrah",
    locality: "Gola Road & Collectorate",
    shortName: "Arrah - Gola Road",
    lat: 25.5541,
    lng: 84.6637,
    landmark: "Near Collectorate",
    zone: "Bhojpur Central"
  },
  {
    id: "bsh-w01",
    city: "Bihar Sharif",
    locality: "Hospital Mor & Ranchi Road",
    shortName: "Bihar Sharif - Nalanda",
    lat: 25.1982,
    lng: 85.5149,
    landmark: "Near Hospital Mor",
    zone: "Nalanda Urban"
  },
  {
    id: "kat-w01",
    city: "Katihar",
    locality: "Mirchaibari & MG Road",
    shortName: "Katihar - Mirchaibari",
    lat: 25.5394,
    lng: 87.5714,
    landmark: "Near Railway Junction",
    zone: "Katihar Urban"
  },
  {
    id: "mun-w01",
    city: "Munger",
    locality: "Fort Area & Chowk Bazar",
    shortName: "Munger - Fort Area",
    lat: 25.3756,
    lng: 86.4735,
    landmark: "Near Munger Fort",
    zone: "Munger Central"
  },
  {
    id: "chp-w01",
    city: "Chhapra",
    locality: "Municipal Chowk & Dahiyawan",
    shortName: "Chhapra - Saran",
    lat: 25.7811,
    lng: 84.7461,
    landmark: "Near Municipal Office",
    zone: "Saran Urban"
  },
  {
    id: "mot-w01",
    city: "Motihari",
    locality: "Main Road & Chhatauni",
    shortName: "Motihari - East Champaran",
    lat: 26.6469,
    lng: 84.9089,
    landmark: "Near Gandhi Memorial",
    zone: "East Champaran"
  },
  {
    id: "sah-w01",
    city: "Saharsa",
    locality: "DB Road & Shankar Chowk",
    shortName: "Saharsa - DB Road",
    lat: 25.8835,
    lng: 86.5954,
    landmark: "Near Shankar Chowk",
    zone: "Kosi Zone"
  },
  {
    id: "sas-w01",
    city: "Sasaram",
    locality: "Grand Trunk Road & Post Office Chowk",
    shortName: "Sasaram - Rohtas",
    lat: 24.9522,
    lng: 84.0321,
    landmark: "Near Shershah Tomb",
    zone: "Rohtas Central"
  },
  {
    id: "haj-w01",
    city: "Hajipur",
    locality: "Cinema Road & Paswan Chowk",
    shortName: "Hajipur - Vaishali",
    lat: 25.6858,
    lng: 85.2146,
    landmark: "Near Paswan Chowk",
    zone: "Vaishali Central"
  },
  // National Metros & Hubs
  {
    id: "delhi-cp",
    city: "New Delhi",
    locality: "Connaught Place & Central Zone",
    shortName: "New Delhi - CP",
    lat: 28.6315,
    lng: 77.2167,
    landmark: "Rajiv Chowk Metro",
    zone: "NDMC Central"
  },
  {
    id: "blr-ind",
    city: "Bengaluru",
    locality: "Indiranagar & 100 Feet Road",
    shortName: "Bengaluru - Indiranagar",
    lat: 12.9784,
    lng: 77.6408,
    landmark: "100 Feet Road Junction",
    zone: "BBMP East"
  },
  {
    id: "mum-bk",
    city: "Mumbai",
    locality: "Bandra Kurla Complex (BKC)",
    shortName: "Mumbai - BKC",
    lat: 19.0688,
    lng: 72.8703,
    landmark: "Near MMRDA Grounds",
    zone: "BMC Zone 3"
  },
  {
    id: "kol-salt",
    city: "Kolkata",
    locality: "Salt Lake Sector V",
    shortName: "Kolkata - Sector V",
    lat: 22.5804,
    lng: 88.4378,
    landmark: "Near IT Hub & Karunamoyee",
    zone: "Bidhannagar"
  },
  {
    id: "hyd-hit",
    city: "Hyderabad",
    locality: "Hitec City & Cyber Towers",
    shortName: "Hyderabad - Hitec City",
    lat: 17.4483,
    lng: 78.3807,
    landmark: "Near Cyber Towers",
    zone: "GHMC West"
  },
  {
    id: "pun-shi",
    city: "Pune",
    locality: "Shivajinagar & FC Road",
    shortName: "Pune - Shivajinagar",
    lat: 18.5314,
    lng: 73.8446,
    landmark: "Near Agricultural College",
    zone: "PMC Central"
  },
  {
    id: "luc-haz",
    city: "Lucknow",
    locality: "Hazratganj & Gomti Nagar",
    shortName: "Lucknow - Hazratganj",
    lat: 26.8467,
    lng: 80.9462,
    landmark: "Near GPO",
    zone: "LMC Central"
  },
  {
    id: "ran-mai",
    city: "Ranchi",
    locality: "Main Road & Albert Ekka Chowk",
    shortName: "Ranchi - Main Road",
    lat: 23.3644,
    lng: 85.3346,
    landmark: "Near Albert Ekka Chowk",
    zone: "RMC Central"
  }
];

// Helper: Try browser geolocation with fallback options and detailed error reporting
const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    // Step 1: Try high accuracy first with 8s timeout
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          isHighAccuracy: true
        });
      },
      (highAccErr) => {
        console.warn('High accuracy GPS timed out or failed, trying low accuracy...', highAccErr.message);
        
        // Step 2: Try low accuracy (Wi-Fi / cellular / cache) with 6s timeout
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              isHighAccuracy: false
            });
          },
          (lowAccErr) => {
            // Map error code to clear user message
            let reason = 'GPS unavailable.';
            if (lowAccErr.code === 1) {
              reason = 'Location permission was denied in your browser settings. Please click the site info / lock icon in your URL bar and set Location to Allow.';
            } else if (lowAccErr.code === 2) {
              reason = 'Device position unavailable. Please ensure Mac/Device Location Services are enabled in System Settings.';
            } else if (lowAccErr.code === 3) {
              reason = 'Location request timed out.';
            }
            const err = new Error(reason);
            err.code = lowAccErr.code;
            reject(err);
          },
          {
            enableHighAccuracy: false,
            timeout: 6000,
            maximumAge: 120000
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000
      }
    );
  });
};

// Reverse geocode lat/lng to accurate street, locality, and city
export const reverseGeocode = async (lat, lng) => {
  if (!lat || !lng) return { locality: 'Current Location', city: 'Detected City', address: '' };

  // Attempt 1: OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en'
        }
      }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.state_district || addr.county || addr.state || 'Local Area';
      const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.village || addr.city_district || city;
      const state = addr.state || '';
      const country = addr.country || 'India';
      
      const parts = [locality, city, state].filter(Boolean);
      const formattedAddress = parts.join(', ') || data.display_name?.split(',').slice(0, 3).join(',') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      return {
        locality: locality !== city ? `${locality}, ${city}` : locality,
        city: city,
        address: formattedAddress,
        state: state,
        country: country
      };
    }
  } catch (e) {
    console.warn('Nominatim reverse geocode error:', e);
  }

  // Attempt 2: BigDataCloud free client-side reverse geocoding
  try {
    const bdcRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      const city = bdcData.city || bdcData.locality || bdcData.principalSubdivision || 'Detected City';
      const locality = bdcData.locality || bdcData.localityInfo?.administrative?.[3]?.name || city;
      const state = bdcData.principalSubdivision || '';
      
      return {
        locality: locality !== city ? `${locality}, ${city}` : locality,
        city: city,
        address: [locality, city, state].filter(Boolean).join(', '),
        state: state,
        country: bdcData.countryName || 'India'
      };
    }
  } catch (bdcErr) {
    console.warn('BigDataCloud reverse geocode error:', bdcErr);
  }

  // Fallback coords string
  return {
    locality: `Locality (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    city: 'Detected City',
    address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  };
};

// Try fetching real IP geolocation from reliable providers
const getIpLocation = async () => {
  // Provider 1: ipwho.is
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.latitude && data.longitude) {
        const city = data.city || 'Local City';
        const region = data.region || '';
        const country = data.country || 'India';
        return {
          lat: data.latitude,
          lng: data.longitude,
          city: city,
          locality: region ? `${city}, ${region}` : city,
          address: [city, region, country].filter(Boolean).join(', '),
          source: 'Network IP Location',
          accuracyLabel: 'Network Approx (±1km)',
          isGpsLive: false
        };
      }
    }
  } catch (e) {}

  // Provider 2: freeipapi.com
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        const city = data.cityName || 'Local City';
        const region = data.regionName || '';
        return {
          lat: data.latitude,
          lng: data.longitude,
          city: city,
          locality: region ? `${city}, ${region}` : city,
          address: [city, region, data.countryName].filter(Boolean).join(', '),
          source: 'Network IP Location',
          accuracyLabel: 'Network Approx (±1km)',
          isGpsLive: false
        };
      }
    }
  } catch (e) {}

  return null;
};

// Main function: Resolves the best, genuine location
export const getBestLocation = async () => {
  // 1. Try Browser Device GPS first
  try {
    const browserPos = await getBrowserLocation();
    if (browserPos && browserPos.lat && browserPos.lng) {
      const geoInfo = await reverseGeocode(browserPos.lat, browserPos.lng);
      
      const loc = {
        lat: browserPos.lat,
        lng: browserPos.lng,
        city: geoInfo.city,
        locality: geoInfo.locality,
        address: geoInfo.address,
        source: browserPos.isHighAccuracy ? 'Live Device GPS (High Precision)' : 'Device Network GPS',
        accuracyLabel: browserPos.accuracy ? `±${Math.round(browserPos.accuracy)}m` : 'Live Satellite Accurate',
        isGpsLive: true,
        isFallback: false
      };
      saveVerifiedLocality(loc);
      return loc;
    }
  } catch (err) {
    console.warn('Browser GPS permission denied or unavailable:', err.message);
  }

  // 2. Try Real IP Geolocation
  try {
    const ipLoc = await getIpLocation();
    if (ipLoc) {
      saveVerifiedLocality(ipLoc);
      return ipLoc;
    }
  } catch (ipErr) {
    console.warn('IP location failed:', ipErr);
  }

  // 3. Last-resort fallback: Return default ward but mark as fallback (do not lock)
  const defaultLoc = {
    lat: 25.6094,
    lng: 85.1376,
    city: 'Patna',
    locality: 'Fraser Road & Dak Bungalow (Ward 8)',
    address: 'Patna, Bihar, India',
    source: 'Default Municipal Ward',
    accuracyLabel: 'Ward Center Default',
    isGpsLive: false,
    isFallback: true
  };
  return defaultLoc;
};

export const getSavedVerifiedLocality = () => {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(LOCALITY_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      // If it's a fallback placeholder, don't treat it as verified resident lock
      if (parsed && !parsed.isFallback) {
        return parsed;
      }
    } catch (e) {}
  }
  return null;
};

export const saveVerifiedLocality = (loc) => {
  if (typeof localStorage === 'undefined' || !loc) return;
  localStorage.setItem(LOCALITY_STORAGE_KEY, JSON.stringify({
    ...loc,
    verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isVerifiedResident: true
  }));
};

export const clearSavedVerifiedLocality = () => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(LOCALITY_STORAGE_KEY);
};

// Calculate distance in KM using Haversine formula
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.2;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
};

// Check if target coordinates are within max radius
export const isWithinLocality = (userLat, userLng, targetLat, targetLng, maxRadiusKm = 5.0) => {
  if (!userLat || !userLng || !targetLat || !targetLng) return true;
  const dist = calculateDistanceKm(userLat, userLng, targetLat, targetLng);
  return dist <= maxRadiusKm;
};
