// CivicEye Data Lake & Core Knowledge Graph

export const INITIAL_CLUSTERS = [
  // --- SHEIKHPURA DISTRICT CLUSTERS ---
  {
    id: "CLUST-SKP-101",
    title: "Choked Main Nullah & Severe Market Inundation at Chandni Chowk - Katra Bazaar",
    category: "Drainage & Flooding",
    severity: "critical",
    confidence: 96,
    status: "investigating",
    assignedDept: "Drainage & Sewerage Board",
    location: "Chandni Chowk & Katra Market Nullah Bridge (Ward 4, Sheikhpura)",
    geoCenter: { lat: 25.1385, lng: 85.8580 },
    radiusKm: 1.2,
    reportCount: 48,
    surgeVelocity: "+420% in 12 hrs",
    firstDetected: "2026-09-08 06:45",
    lastUpdated: "8 mins ago",
    aiRootCause: "Primary city stormwater nullah outflow near Katra bridge choked by polythene packaging and silt from construction activity, flooding market lanes with 22cm stagnant water.",
    signals: [
      {
        type: "camera",
        source: "CAM-SKP-01 (Chandni Chowk Sentinel)",
        event: "Waterlogging Inundation: 22cm over 140 sq m roadway",
        confidence: 96,
        time: "08:15 AM"
      },
      {
        type: "citizen",
        source: "28 Verified Citizen Reports",
        event: "Commercial market completely blocked by dirty backflow water",
        confidence: 98,
        time: "07:30 AM - 09:45 AM"
      },
      {
        type: "camera",
        source: "CAM-SKP-03 (Station Road Sluice)",
        event: "Solid waste accumulation covering 70% of intake grate",
        confidence: 92,
        time: "07:50 AM"
      }
    ],
    nlpThemes: [
      { text: "Katra Chowk market road flooded with black water", count: 21 },
      { text: "Main drain blocked near Chandni Chowk bridge", count: 14 },
      { text: "Water entering shops near vegetable market", count: 8 },
      { text: "Drainage bad smell spreading in Ward 4", count: 5 }
    ],
    recommendedAction: "Dispatch Sheikhpura Nagar Parishad Super-Sucker Jetting Machine to Katra Bridge Nullah intake, followed by de-silting trash extraction at Chandni Chowk."
  },
  {
    id: "CLUST-SKP-102",
    title: "Asphalt Topcoat Fractures & Hazardous Craters on NH-333A Highway Corridor",
    category: "Roads & Potholes",
    severity: "critical",
    confidence: 94,
    status: "investigating",
    assignedDept: "Roads & Bridges Dept",
    location: "NH-333A (Sheikhpura to Barbigha Arterial Stretch near Mehus Mod)",
    geoCenter: { lat: 25.1850, lng: 85.7920 },
    radiusKm: 3.5,
    reportCount: 62,
    surgeVelocity: "+310% in 24 hrs",
    firstDetected: "2026-09-07 11:20",
    lastUpdated: "18 mins ago",
    aiRootCause: "Continuous heavy stone-carrier trucks from local quarries combined with monsoon seepage caused rapid sub-base erosion, generating 6 deep craters up to 14cm depth.",
    signals: [
      {
        type: "citizen",
        source: "42 Citizen & Driver Reports",
        event: "Multiple two-wheeler slips and bumper damage near Mehus Mod",
        confidence: 96,
        time: "Past 24 hours"
      },
      {
        type: "fleet_dashcam",
        source: "Nagar Parishad Patrol Van #01",
        event: "Road Roughness Index IRI peaked at 8.4 (Critical Distress)",
        confidence: 93,
        time: "Today 08:30 AM"
      }
    ],
    nlpThemes: [
      { text: "Dangerous deep pothole near Mehus Mod bypass", count: 24 },
      { text: "Road broken on Barbigha highway stretch", count: 19 },
      { text: "Two-wheelers losing balance at night", count: 12 },
      { text: "NH-333A surface gravel completely exposed", count: 7 }
    ],
    recommendedAction: "Deploy Road Construction Dept Rapid Hot-Mix Patching Team to NH-333A km 12-16 with portable roller compaction."
  },
  {
    id: "CLUST-SKP-103",
    title: "Solid Waste Dumping & Plastic Waste Backlog at Girihinda Pahar & Station Road",
    category: "Waste Accumulation",
    severity: "high",
    confidence: 91,
    status: "investigating",
    assignedDept: "Solid Waste Management",
    location: "Girihinda Mandir Road & Sheikhpura Junction Approach (Ward 7 & 9)",
    geoCenter: { lat: 25.1432, lng: 85.8640 },
    radiusKm: 1.6,
    reportCount: 35,
    surgeVelocity: "+260% in 18 hrs",
    firstDetected: "2026-09-08 08:00",
    lastUpdated: "35 mins ago",
    aiRootCause: "Secondary collection tipper missed 2 consecutive morning rounds; pilgrimage visitors and local vendors dumped unsegregated refuse on the road verge.",
    signals: [
      {
        type: "camera",
        source: "CAM-SKP-02 (Girihinda Pahar Sentinel)",
        event: "Unsegregated garbage pile ~2.2 tons encroaching onto footpath",
        confidence: 91,
        time: "07:15 AM"
      },
      {
        type: "citizen",
        source: "35 Citizen Reports",
        event: "Garbage overflowing on temple stairs and railway approach",
        confidence: 94,
        time: "Past 18 hours"
      }
    ],
    nlpThemes: [
      { text: "Huge garbage pile near Girihinda Pahar temple gate", count: 18 },
      { text: "Foul smell and stray animals near Station Road", count: 11 },
      { text: "Trash bin not cleared for 2 days", count: 6 }
    ],
    recommendedAction: "Dispatch Solid Waste Management JCB Loader and 2 Hydraulic Tippers to Girihinda Pahar footstep and install dual-bin segregation station."
  },
  {
    id: "CLUST-SKP-104",
    title: "Drinking Water Supply Pipeline Burst near District Collectorate Complex",
    category: "Water Supply",
    severity: "high",
    confidence: 89,
    status: "investigating",
    assignedDept: "Municipal Water Board",
    location: "District Collectorate Complex & Civil Lines (Ward 1, Sheikhpura)",
    geoCenter: { lat: 25.1320, lng: 85.8520 },
    radiusKm: 1.1,
    reportCount: 29,
    surgeVelocity: "+190% in 6 hrs",
    firstDetected: "2026-09-08 05:30",
    lastUpdated: "45 mins ago",
    aiRootCause: "Underground 150mm ductile iron water line fractured under road expansion pressure, causing low tap pressure across Ward 1 and flooding pavement.",
    signals: [
      {
        type: "citizen",
        source: "29 Citizen Reports",
        event: "Zero water pressure in quarters & clean water leaking on road",
        confidence: 92,
        time: "06:00 AM - 09:30 AM"
      }
    ],
    nlpThemes: [
      { text: "Drinking water flowing on road near DM office", count: 16 },
      { text: "No tap water since early morning in Ward 1", count: 13 }
    ],
    recommendedAction: "Isolate distribution sector valve #V-02 near Collectorate Gate and deploy repair trench team to weld ruptured line collar."
  },
  {
    id: "CLUST-SKP-105",
    title: "High-Mast Luminaire Feeder Cable Trip at Dr. Shri Krishna Singh Chowk, Barbigha",
    category: "Electrical & Lighting",
    severity: "moderate",
    confidence: 87,
    status: "dispatched",
    assignedDept: "Public Works & Electrical",
    location: "Dr. Shri Krishna Singh Chowk & Mission Market (Ward 5, Barbigha)",
    geoCenter: { lat: 25.2340, lng: 85.7250 },
    radiusKm: 0.8,
    reportCount: 19,
    surgeVelocity: "Outage active for 2 nights",
    firstDetected: "2026-09-07 19:40",
    lastUpdated: "2 hrs ago",
    aiRootCause: "Feeder breaker FB-04 tripped due to line voltage spike; busy junction on NH-333A is pitch dark, creating severe accident risk.",
    signals: [
      {
        type: "camera",
        source: "CAM-SKP-04 (Barbigha Chowk Sentinel)",
        event: "Ambient lux dropped to 3.8 (Critically Low)",
        confidence: 89,
        time: "Yesterday 07:45 PM"
      },
      {
        type: "citizen",
        source: "19 Citizen Reports",
        event: "Major square dark, trucks speeding dangerously",
        confidence: 91,
        time: "Past 48 hours"
      }
    ],
    nlpThemes: [
      { text: "Barbigha main roundabout high mast light off", count: 11 },
      { text: "Pitch dark near Mission Chowk crossroad", count: 8 }
    ],
    recommendedAction: "PWD Electrical technician unit #B-2 dispatched to reset breaker panel and replace blown MCB at Dr. S.K. Singh Chowk."
  },
  {
    id: "CLUST-102",
    title: "Localized Water Supply Disruption & Pressure Loss",
    category: "Water Supply",
    severity: "high",
    confidence: 91,
    status: "investigating",
    assignedDept: "Municipal Water Board",
    location: "Green Glen Layout & Silver Oak Enclave",
    geoCenter: { lat: 12.9785, lng: 77.6025 },
    radiusKm: 2.3,
    reportCount: 37,
    surgeVelocity: "+520% in 48 hrs",
    firstDetected: "2026-09-07 14:30",
    lastUpdated: "25 mins ago",
    aiRootCause: "Main feeder pipeline valve malfunction or pressure drop at 4th Cross distribution junction affecting contiguous 2.3 km residential zone.",
    signals: [
      {
        type: "citizen",
        source: "37 Citizen Reports",
        event: "No water / critically low pressure / tanker requested",
        confidence: 91,
        time: "Past 48 hours"
      },
      {
        type: "temporal",
        source: "Surge Analysis Engine",
        event: "Complaints accelerated from 2/day (Mon) to 21/day (Fri)",
        confidence: 96,
        time: "Continuous"
      }
    ],
    nlpThemes: [
      { text: "Water supply completely stopped", count: 14 },
      { text: "No water in taps since yesterday", count: 11 },
      { text: "Water pressure is very low", count: 6 },
      { text: "Water tanker urgently needed", count: 4 },
      { text: "Pipeline problem in society", count: 2 }
    ],
    recommendedAction: "Inspect secondary distribution valve box #V-42 at Green Glen junction and verify feeder pressure levels before dispatching emergency tankers."
  },
  {
    id: "CLUST-103",
    title: "Nocturnal Chemical Odor & Air Quality Anomaly",
    category: "Air Quality & Environment",
    severity: "high",
    confidence: 89,
    status: "investigating",
    assignedDept: "Pollution Control Board",
    location: "Industrial Corridor & Outer Ring Ward 12",
    geoCenter: { lat: 12.9642, lng: 77.6189 },
    radiusKm: 3.1,
    reportCount: 100,
    surgeVelocity: "+410% between 11 PM - 4 AM",
    firstDetected: "2026-09-08 23:45",
    lastUpdated: "1 hr ago",
    aiRootCause: "Unauthorized nocturnal industrial waste incineration or chemical degassing occurring under low atmospheric inversion layers.",
    signals: [
      {
        type: "citizen",
        source: "100 Semantic Reports",
        event: "Strong burning / chemical / pungent odor at night",
        confidence: 89,
        time: "11:00 PM - 04:30 AM"
      },
      {
        type: "spatial",
        source: "Geo Clustering (DBSCAN)",
        event: "100 reports clustered downwind within 3.1km radius",
        confidence: 93,
        time: "Nightly pattern"
      }
    ],
    nlpThemes: [
      { text: "Very bad chemical smell at night", count: 38 },
      { text: "Burning plastic/rubber odor", count: 29 },
      { text: "Strange pungent odor near highway", count: 19 },
      { text: "Suffocating toxic smell waking children", count: 14 }
    ],
    recommendedAction: "Deploy nighttime air monitoring patrol to Sector 18 industrial zone and audit industrial boiler scrubbers."
  },
  {
    id: "CLUST-104",
    title: "Streetlight Grid Outage on High-Traffic Arterial",
    category: "Electrical & Lighting",
    severity: "moderate",
    confidence: 86,
    status: "dispatched",
    assignedDept: "Public Works & Electrical",
    location: "MG Road & 14th Cross Corridor",
    geoCenter: { lat: 12.9752, lng: 77.5898 },
    radiusKm: 0.9,
    reportCount: 18,
    surgeVelocity: "Constant outage for 2 nights",
    firstDetected: "2026-09-07 19:10",
    lastUpdated: "3 hrs ago",
    aiRootCause: "Feeder pillar #FP-09 circuit breaker trip causing 8 contiguous poles to lose power, increasing pedestrian accident risk near deep potholes.",
    signals: [
      {
        type: "camera",
        source: "CAM-07 (MG Road Traffic Junction)",
        event: "Luminosity dropped to 4.2 lux (Normal: 35 lux)",
        confidence: 88,
        time: "Yesterday 07:30 PM"
      },
      {
        type: "citizen",
        source: "18 Citizen Reports",
        event: "Pitch dark road, unsafe for pedestrians and bikes",
        confidence: 92,
        time: "Past 48 hours"
      }
    ],
    nlpThemes: [
      { text: "Streetlights not working for 3 days", count: 9 },
      { text: "Pitch dark stretch near junction", count: 5 },
      { text: "Unsafe walking at night", count: 4 }
    ],
    recommendedAction: "Technician unit #E-3 dispatched to inspect Feeder Pillar FP-09 and replace 63A tripped circuit breaker."
  }
];

export const LIVE_CAMERAS = [
  // --- SHEIKHPURA DISTRICT SENTINEL CAMERAS ---
  {
    id: "CAM-SKP-01",
    name: "Sheikhpura Chandni Chowk Junction Sentinel",
    location: "Katra Market Road & Nullah Crossing (Ward 4)",
    lat: 25.1385,
    lng: 85.8580,
    status: "active",
    aiDetection: {
      type: "Waterlogging",
      confidence: 96,
      severity: "critical",
      bbox: { x: 15, y: 48, w: 68, h: 42 },
      details: "Water depth: 22cm | Area: 140 sq m | Stagnant runoff on market street"
    },
    lastPing: "Just now",
    streamQuality: "1080p 30fps"
  },
  {
    id: "CAM-SKP-02",
    name: "Girihinda Mandir Pahar Sentinel",
    location: "Temple Stairs & Footstep Approach (Ward 7)",
    lat: 25.1432,
    lng: 85.8640,
    status: "active",
    aiDetection: {
      type: "Waste Accumulation",
      confidence: 91,
      severity: "high",
      bbox: { x: 28, y: 38, w: 46, h: 45 },
      details: "Unsegregated garbage pile ~2.2 tons spilling across roadside footpath"
    },
    lastPing: "Just now",
    streamQuality: "1080p 30fps"
  },
  {
    id: "CAM-SKP-03",
    name: "Sheikhpura Railway Station Gate #1",
    location: "Station Road & ECL Track Approach (Ward 9)",
    lat: 25.1480,
    lng: 85.8595,
    status: "active",
    aiDetection: {
      type: "Pothole & Surface Distress",
      confidence: 93,
      severity: "critical",
      bbox: { x: 22, y: 55, w: 50, h: 32 },
      details: "Multiple road surface craters; max estimated depth ~13cm"
    },
    lastPing: "Just now",
    streamQuality: "1080p 30fps"
  },
  {
    id: "CAM-SKP-04",
    name: "Barbigha Dr. S.K. Singh Chowk Cam",
    location: "Mission Market Roundabout & NH-333A (Ward 5)",
    lat: 25.2340,
    lng: 85.7250,
    status: "active",
    aiDetection: {
      type: "Low Illumination Fault",
      confidence: 89,
      severity: "moderate",
      bbox: { x: 10, y: 20, w: 75, h: 65 },
      details: "High-mast luminaire offline | Ambient lux: 3.8 (Critically Dark)"
    },
    lastPing: "Just now",
    streamQuality: "1080p 30fps"
  },
  {
    id: "CAM-SKP-05",
    name: "District Collectorate Main Gate Cam",
    location: "Civil Lines & DM Office Road (Ward 1)",
    lat: 25.1320,
    lng: 85.8520,
    status: "active",
    aiDetection: {
      type: "Pipeline Leakage",
      confidence: 92,
      severity: "high",
      bbox: { x: 35, y: 50, w: 38, h: 35 },
      details: "Clean water surface surge from fractured 150mm supply main"
    },
    lastPing: "Just now",
    streamQuality: "1080p 30fps"
  },

  // --- STATE-LEVEL CCTV CAMERAS ---
  {
    id: "CAM-01",
    name: "Metro Underpass Junction",
    location: "Main Ring Road North",
    lat: 12.9716,
    lng: 77.5946,
    status: "active",
    aiDetection: {
      type: "Waterlogging",
      confidence: 94,
      severity: "high",
      bbox: { x: 18, y: 52, w: 64, h: 40 },
      details: "Water depth: 18cm | Surface area: 120 sq m"
    },
    lastPing: "Just now",
    streamQuality: "1080p 30fps"
  },
  {
    id: "CAM-02",
    name: "Sector 9 Storm Canal Inflow",
    location: "Canal Road & Drainage Gate",
    lat: 12.9698,
    lng: 77.5921,
    status: "active",
    aiDetection: {
      type: "Waste Accumulation",
      confidence: 89,
      severity: "critical",
      bbox: { x: 30, y: 40, w: 45, h: 48 },
      details: "Solid waste choke on primary inlet grate: 65% obstruction"
    },
    lastPing: "Just now",
    streamQuality: "1080p 30fps"
  }
];

export const INITIAL_CITIZEN_REPORTS = [
  // --- SHEIKHPURA CITIZEN REPORTS ---
  {
    id: "REP-SKP-501",
    author: "Ramesh Kumar Sharma",
    avatar: "RS",
    civicScore: 520,
    badge: "Sheikhpura Ward Sentinel",
    title: "Katra Chowk market road completely flooded with dirty black water",
    category: "Drainage & Flooding",
    location: "Chandni Chowk to Katra Market (Ward 4, Sheikhpura)",
    lat: 25.1385,
    lng: 85.8580,
    timeAgo: "10 mins ago",
    upvotes: 38,
    status: "Correlated to Cluster",
    clusterId: "CLUST-SKP-101",
    assignedDept: "Drainage & Sewerage Board",
    verifiedByAI: true,
    scoreEarned: 25,
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "REP-SKP-502",
    author: "Ananya Kumari",
    avatar: "AK",
    civicScore: 340,
    badge: "Active Citizen",
    title: "Massive 14cm pothole causing bikes to skid near Mehus Mod bypass",
    category: "Roads & Potholes",
    location: "NH-333A near Mehus Mod Junction, Sheikhpura",
    lat: 25.1850,
    lng: 85.7920,
    timeAgo: "22 mins ago",
    upvotes: 45,
    status: "Correlated to Cluster",
    clusterId: "CLUST-SKP-102",
    assignedDept: "Roads & Bridges Dept",
    verifiedByAI: true,
    scoreEarned: 25,
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "REP-SKP-503",
    author: "Vikash Singh",
    avatar: "VS",
    civicScore: 410,
    badge: "Community Guardian",
    title: "Garbage overflow spilling on footpath at Girihinda Pahar entry gate",
    category: "Waste Accumulation",
    location: "Girihinda Mandir Road (Ward 7, Sheikhpura)",
    lat: 25.1432,
    lng: 85.8640,
    timeAgo: "40 mins ago",
    upvotes: 29,
    status: "Correlated to Cluster",
    clusterId: "CLUST-SKP-103",
    assignedDept: "Solid Waste Management",
    verifiedByAI: true,
    scoreEarned: 25,
    photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "REP-SKP-504",
    author: "Md. Tariq Anwar",
    avatar: "TA",
    civicScore: 280,
    badge: "Verified Resident",
    title: "Drinking water pipe leaking gallons of water near Collectorate Gate",
    category: "Water Supply",
    location: "District Collectorate Complex (Ward 1, Sheikhpura)",
    lat: 25.1320,
    lng: 85.8520,
    timeAgo: "1 hr ago",
    upvotes: 31,
    status: "Correlated to Cluster",
    clusterId: "CLUST-SKP-104",
    assignedDept: "Municipal Water Board",
    verifiedByAI: true,
    scoreEarned: 25,
    photoUrl: null
  },
  {
    id: "REP-SKP-505",
    author: "Pooja Devi",
    avatar: "PD",
    civicScore: 360,
    badge: "Neighborhood Sentinel",
    title: "High mast lights not functioning at Dr. S.K. Singh Chowk Barbigha",
    category: "Electrical & Lighting",
    location: "Dr. Shri Krishna Singh Chowk (Ward 5, Barbigha)",
    lat: 25.2340,
    lng: 85.7250,
    timeAgo: "2 hrs ago",
    upvotes: 26,
    status: "Correlated to Cluster",
    clusterId: "CLUST-SKP-105",
    assignedDept: "Public Works & Electrical",
    verifiedByAI: true,
    scoreEarned: 25,
    photoUrl: null
  }
];

export const SAMPLE_MEDIA = [
  {
    id: "samp-photo-garbage",
    type: "photo",
    title: "Overflowing Roadside Garbage Bin",
    category: "Solid Waste Management",
    suggestedTitle: "Severe solid waste accumulation spilling onto main road",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=80",
    description: "Community waste bin overloaded with plastic bags and decomposing organic waste."
  },
  {
    id: "samp-video-waterlogging",
    type: "video",
    title: "Waterlogged Road Underpass (Video)",
    category: "Drainage & Flooding",
    suggestedTitle: "Waterlogging depth ~20cm stalling two-wheelers and pedestrians",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "0:15",
    thumbnail: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=300&auto=format&fit=crop&q=80",
    description: "Monsoon runoff overflowing storm drain and submerging roadway."
  },
  {
    id: "samp-photo-streetlight",
    type: "photo",
    title: "Non-Functional Streetlight at Night",
    category: "Street Lighting & Electrical",
    suggestedTitle: "Pitch dark alley due to 4 non-operational LED streetlight poles",
    url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=300&auto=format&fit=crop&q=80",
    description: "High-risk pedestrian dark corridor with unlit municipal poles."
  },
  {
    id: "samp-photo-pothole",
    type: "photo",
    title: "Deep Hazardous Road Crater",
    category: "Roads & Potholes",
    suggestedTitle: "Dangerous 15cm asphalt crater causing sudden braking and near-accidents",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300&auto=format&fit=crop&q=80",
    description: "Cracked asphalt with exposed sub-base requiring urgent hot-mix patch."
  },
  {
    id: "samp-video-drain",
    type: "video",
    title: "Choked Grate Backflow (Video)",
    category: "Drainage & Flooding",
    suggestedTitle: "Culvert inflow grate completely jammed with plastic debris",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "0:12",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80",
    description: "Solid waste blocking storm inlet preventing water discharge."
  }
];

export const VERIFICATION_QUEUE = [
  // --- SHEIKHPURA VERIFICATION TASKS ---
  {
    id: "VERIF-SKP-01",
    prompt: "Camera AI detected a 22cm waterlogging puddle near Katra Chowk Nullah. Is the market lane blocked?",
    detectedType: "Drainage Overflow",
    cameraSource: "CAM-SKP-01 (Chandni Chowk Sentinel)",
    location: "Katra Market Road & Nullah Bridge (Ward 4, Sheikhpura)",
    localityName: "Ward 4 (Chandni Chowk)",
    lat: 25.1385,
    lng: 85.8580,
    confidence: 76,
    rewardPoints: 20,
    timeAgo: "4 mins ago",
    status: "pending",
    doubtReason: "Camera view partially blocked by passing e-rickshaw; requesting nearby resident verification."
  },
  {
    id: "VERIF-SKP-02",
    prompt: "Patrol Van AI detected a 14cm road fracture on NH-333A near Mehus Mod. Is traffic slowing down?",
    detectedType: "Hazardous Pothole",
    cameraSource: "MCD Fleet Van #01 Dashcam",
    location: "NH-333A Highway near Mehus Mod Bypass, Sheikhpura",
    localityName: "Sheikhpura - NH-333A Corridor",
    lat: 25.1850,
    lng: 85.7920,
    confidence: 74,
    rewardPoints: 25,
    timeAgo: "12 mins ago",
    status: "pending",
    doubtReason: "High-speed road section; verify hazard severity to trigger emergency bitumen patch dispatch."
  },
  {
    id: "VERIF-SKP-03",
    prompt: "A resident reported unsegregated garbage on Girihinda Pahar stairs. Is the pathway clear now?",
    detectedType: "Waste Accumulation",
    cameraSource: "Citizen Report #REP-SKP-503",
    location: "Girihinda Mandir Road (Ward 7, Sheikhpura)",
    localityName: "Ward 7 (Girihinda)",
    lat: 25.1432,
    lng: 85.8640,
    confidence: 69,
    rewardPoints: 15,
    timeAgo: "25 mins ago",
    status: "pending",
    doubtReason: "Sanitation tipper round scheduled; verify if garbage was completely cleared from steps."
  },
  {
    id: "VERIF-SKP-04",
    prompt: "High-mast lights reported offline at Dr. S.K. Singh Chowk Barbigha. Is the square dark tonight?",
    detectedType: "Streetlight Outage",
    cameraSource: "Citizen Report #REP-SKP-505",
    location: "Dr. Shri Krishna Singh Chowk (Ward 5, Barbigha)",
    localityName: "Barbigha - Ward 5",
    lat: 25.2340,
    lng: 85.7250,
    confidence: 71,
    rewardPoints: 15,
    timeAgo: "35 mins ago",
    status: "pending",
    doubtReason: "Feeder trip alert received; confirming before night shift electrical dispatch."
  },

  // --- STATE-LEVEL VERIFICATION TASKS ---
  {
    id: "VERIF-01",
    prompt: "Camera AI detected possible drain blockage near Fraser Road Dak Bungalow. Is water overflowing onto the road?",
    detectedType: "Drainage Choke",
    cameraSource: "CAM-04 (Dak Bungalow Inflow)",
    location: "Fraser Road near Dak Bungalow Crossing (Ward 8)",
    localityName: "Ward 8 (Fraser Road)",
    lat: 25.6094,
    lng: 85.1376,
    confidence: 68,
    rewardPoints: 15,
    timeAgo: "5 mins ago",
    status: "pending",
    doubtReason: "Camera visual obstructed by parked auto-rickshaw; requires citizen confirmation."
  },
  {
    id: "VERIF-02",
    prompt: "A resident reported 3 non-functional streetlights on Boring Canal Road. Is this stretch dark tonight?",
    detectedType: "Streetlight Outage",
    cameraSource: "Citizen Report #REP-4089",
    location: "Boring Canal Road near Krishna Apartment (Ward 12)",
    localityName: "Ward 12 (Boring Road)",
    lat: 25.6186,
    lng: 85.1128,
    confidence: 72,
    rewardPoints: 15,
    timeAgo: "15 mins ago",
    status: "pending",
    doubtReason: "Report submitted 2 hours ago; verification needed to trigger emergency technician dispatch."
  },
  {
    id: "VERIF-03",
    prompt: "Sanitation compactor log marks community bin #42 at Kankarbagh cleared. Can you confirm the spot is clean?",
    detectedType: "Waste Clearance Verification",
    cameraSource: "Municipal Sanitation Log #CL-882",
    location: "Tiwary Bechar Chowk Bin #42 (Ward 21)",
    localityName: "Ward 21 (Kankarbagh)",
    lat: 25.5912,
    lng: 85.1534,
    confidence: 81,
    rewardPoints: 20,
    timeAgo: "28 mins ago",
    status: "pending",
    doubtReason: "Driver submitted completion receipt; double-checking before closing SLA ticket."
  },
  {
    id: "VERIF-04",
    prompt: "Citizen reported an open uncovered manhole near Bailey Road Paras Hospital. Is the safety barrier in place?",
    detectedType: "High-Risk Hazard",
    cameraSource: "Citizen Report #REP-4102",
    location: "Bailey Road Pillar #44 (Ward 5)",
    localityName: "Ward 5 (Bailey Road)",
    lat: 25.6145,
    lng: 85.0872,
    confidence: 64,
    rewardPoints: 25,
    timeAgo: "40 mins ago",
    status: "pending",
    doubtReason: "High life-safety hazard; municipal engineer dispatched and awaiting on-ground verification."
  }
];

export const USER_PROFILE = {
  name: "Priya Sharma",
  avatar: "PS",
  score: 485,
  rank: "Community Sentinel (Top 5% in Ward 8)",
  badge: "Swachhata Ambassador",
  level: 4,
  nextLevelScore: 600,
  role: "citizen", // future RBAC ready: 'citizen' | 'field_officer' | 'municipal_admin'
  stats: {
    reportsSubmitted: 14,
    reportsApproved: 13,
    verificationsDone: 22,
    gpsAccuracyScore: 98,
    mediaUploads: 14,
    pointsThisMonth: 185
  },
  ledger: [
    {
      id: "LEDG-01",
      action: "Geotagged Issue Report: Drainage Blockage",
      points: 25,
      type: "earned",
      timestamp: "Today, 10:40 AM",
      badge: "GPS Verified"
    },
    {
      id: "LEDG-02",
      action: "Video Evidence Upload: Waterlogged Road",
      points: 15,
      type: "earned",
      timestamp: "Today, 10:41 AM",
      badge: "Media Verified"
    },
    {
      id: "LEDG-03",
      action: "Confirmed Doubting Issue: Streetlight Anomaly",
      points: 15,
      type: "earned",
      timestamp: "Yesterday, 08:15 PM",
      badge: "Crowd Verification"
    },
    {
      id: "LEDG-04",
      action: "National Cleanliness Pledge (Swachhata Pratigya)",
      points: 50,
      type: "earned",
      timestamp: "Sep 14, 2026",
      badge: "Pledge Completed"
    },
    {
      id: "LEDG-05",
      action: "Confirmed Waste Clearance Ticket at Ward 8",
      points: 20,
      type: "earned",
      timestamp: "Sep 12, 2026",
      badge: "Crowd Verification"
    }
  ],
  badges: [
    { name: "Swachhata Ambassador", desc: "Completed national cleanliness commitment & 20+ verifications", icon: "🇮🇳" },
    { name: "First Responder", desc: "First to report 5 verified civic emergencies", icon: "⚡" },
    { name: "Eagle Eye", desc: "98% accuracy on community verification votes", icon: "👁️" },
    { name: "Video Journalist", desc: "Uploaded 10+ verified video and photo evidences", icon: "📹" },
    { name: "Civic Sentinel", desc: "Top 5% verified contributor in Ward 8", icon: "🛡️" }
  ]
};

export const MUNICIPAL_DEPARTMENTS = [
  {
    id: "DEPT-01",
    name: "Drainage & Sewerage Board",
    head: "Er. Ramesh Verma",
    staffCount: 42,
    activeWorkOrders: 14,
    slaTargetHours: 4,
    avgResolutionHours: 3.2,
    status: "Active"
  },
  {
    id: "DEPT-02",
    name: "Municipal Water Board",
    head: "Dr. Ananya Joshi",
    staffCount: 38,
    activeWorkOrders: 9,
    slaTargetHours: 6,
    avgResolutionHours: 5.1,
    status: "Active"
  },
  {
    id: "DEPT-03",
    name: "Pollution Control Board",
    head: "Officer Sanjeev Rao",
    staffCount: 24,
    activeWorkOrders: 6,
    slaTargetHours: 12,
    avgResolutionHours: 9.4,
    status: "Active"
  },
  {
    id: "DEPT-04",
    name: "Public Works & Electrical",
    head: "Er. Deepak Kumar",
    staffCount: 30,
    activeWorkOrders: 8,
    slaTargetHours: 8,
    avgResolutionHours: 6.8,
    status: "Active"
  },
  {
    id: "DEPT-05",
    name: "Solid Waste Management",
    head: "Smt. Kavita Pillai",
    staffCount: 65,
    activeWorkOrders: 19,
    slaTargetHours: 4,
    avgResolutionHours: 2.9,
    status: "Active"
  },
  {
    id: "DEPT-06",
    name: "Roads & Bridges Dept",
    head: "Er. Manoj Bajpai",
    staffCount: 50,
    activeWorkOrders: 11,
    slaTargetHours: 24,
    avgResolutionHours: 18.5,
    status: "Active"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-901",
    timestamp: "Just now",
    action: "AI Cluster Synthesis",
    actor: "CivicEye AI Engine",
    details: "Synthesized 43 reports into CLUST-101 (Drainage Choke)",
    severity: "info"
  },
  {
    id: "LOG-902",
    timestamp: "12 mins ago",
    action: "Work Order Dispatched",
    actor: "Authority Command",
    details: "Work order #WO-8821 sent to Public Works & Electrical",
    severity: "success"
  },
  {
    id: "LOG-903",
    timestamp: "28 mins ago",
    action: "Citizen Verification",
    actor: "Citizen: Priya Sharma",
    details: "Verified CAM-09 detection on 8th Main (+10 pts credited)",
    severity: "info"
  },
  {
    id: "LOG-904",
    timestamp: "1 hr ago",
    action: "CCTV Anomaly Alert",
    actor: "CAM-02 (Canal Inflow)",
    details: "Detected 65% obstruction on storm drain grate",
    severity: "warning"
  },
  {
    id: "LOG-905",
    timestamp: "2 hrs ago",
    action: "Citizen Report Logged",
    actor: "Citizen: Vikram Nair",
    details: "Logged chemical burning odor in Outer Ring Ward 12",
    severity: "info"
  }
];
