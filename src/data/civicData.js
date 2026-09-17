// CivicEye Data Lake & Core Knowledge Graph

export const INITIAL_CLUSTERS = [
  {
    id: "CLUST-101",
    title: "Choked Drainage Causing Cascading Waterlogging",
    category: "Drainage & Flooding",
    severity: "critical", // critical, high, moderate, low
    confidence: 94,
    status: "investigating", // investigating, dispatched, resolved
    assignedDept: "Drainage & Sewerage Board",
    location: "Metro Junction Underpass & Sector 9 Drain",
    geoCenter: { lat: 12.9716, lng: 77.5946 },
    radiusKm: 1.4,
    reportCount: 43,
    surgeVelocity: "+380% in 18 hrs",
    firstDetected: "2026-09-08 07:15",
    lastUpdated: "12 mins ago",
    aiRootCause: "Storm drain intake choked with accumulated solid waste & plastic debris, preventing surface runoff from escaping underpass during morning rains.",
    signals: [
      {
        type: "camera",
        source: "CAM-04 (Underpass Inflow)",
        event: "Waterlogging Depth: 18cm",
        confidence: 94,
        time: "08:10 AM"
      },
      {
        type: "citizen",
        source: "15 Citizen Reports",
        event: "Severe road flooding & traffic stall",
        confidence: 98,
        time: "08:15 AM - 09:30 AM"
      },
      {
        type: "citizen",
        source: "8 Citizen Reports",
        event: "Storm drain inlet completely blocked with debris",
        confidence: 91,
        time: "08:45 AM - 09:10 AM"
      },
      {
        type: "camera",
        source: "CAM-02 (Sector 9 Canal Inflow)",
        event: "Solid waste accumulation covering 65% of grate",
        confidence: 89,
        time: "07:30 AM"
      }
    ],
    nlpThemes: [
      { text: "Road underwater near underpass", count: 18 },
      { text: "Drain blocked by garbage bags", count: 12 },
      { text: "Water level rising on Main Road", count: 8 },
      { text: "Stagnant rainwater not flowing", count: 5 }
    ],
    recommendedAction: "Dispatch high-pressure jetting suction truck to clear Canal Inflow Grate at Sector 9, followed by surface water pumping at Metro Underpass."
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
  },
  {
    id: "CAM-03",
    name: "Commercial Market South",
    location: "Bazaar Square & Lane 3",
    lat: 12.9665,
    lng: 77.6012,
    status: "active",
    aiDetection: {
      type: "Illegal Dumping",
      confidence: 92,
      severity: "moderate",
      bbox: { x: 22, y: 60, w: 35, h: 32 },
      details: "Commercial carton & plastic pile: ~1.5 tons"
    },
    lastPing: "Just now",
    streamQuality: "720p 24fps"
  },
  {
    id: "CAM-04",
    name: "MG Road Arterial Feeder",
    location: "14th Cross & High Street",
    lat: 12.9752,
    lng: 77.5898,
    status: "active",
    aiDetection: {
      type: "Low Illumination Fault",
      confidence: 86,
      severity: "moderate",
      bbox: { x: 10, y: 15, w: 80, h: 75 },
      details: "8 poles offline | Ambient lux: 4.2 (Critically Low)"
    },
    lastPing: "Just now",
    streamQuality: "1080p 30fps"
  }
];

export const INITIAL_CITIZEN_REPORTS = [
  {
    id: "REP-4091",
    author: "Priya Sharma",
    avatar: "PS",
    civicScore: 485,
    badge: "Neighborhood Guardian",
    title: "Storm drain inlet completely blocked with garbage bags",
    category: "Drainage & Flooding",
    location: "Near Sector 9 Canal Bridge",
    timeAgo: "15 mins ago",
    upvotes: 24,
    status: "Correlated to Cluster",
    clusterId: "CLUST-101",
    assignedDept: "Drainage & Sewerage Board",
    verifiedByAI: true,
    scoreEarned: 25,
    photoUrl: null
  },
  {
    id: "REP-4088",
    author: "Arjun Mehta",
    avatar: "AM",
    civicScore: 320,
    badge: "Trusted Sentinel",
    title: "Water is knee deep under Metro bridge, cars getting stuck",
    category: "Drainage & Flooding",
    location: "Metro Underpass",
    timeAgo: "32 mins ago",
    upvotes: 41,
    status: "Correlated to Cluster",
    clusterId: "CLUST-101",
    assignedDept: "Drainage & Sewerage Board",
    verifiedByAI: true,
    scoreEarned: 25,
    photoUrl: null
  },
  {
    id: "REP-4074",
    author: "Sunita Roy",
    avatar: "SR",
    civicScore: 210,
    badge: "Active Citizen",
    title: "Zero water pressure since yesterday evening in Green Glen",
    category: "Water Supply",
    location: "Green Glen Layout Block B",
    timeAgo: "1 hr ago",
    upvotes: 18,
    status: "Correlated to Cluster",
    clusterId: "CLUST-102",
    assignedDept: "Municipal Water Board",
    verifiedByAI: true,
    scoreEarned: 25,
    photoUrl: null
  },
  {
    id: "REP-4062",
    author: "Vikram Nair",
    avatar: "VN",
    civicScore: 590,
    badge: "Master Verifier",
    title: "Intense chemical burning odor waking up entire apartment",
    category: "Air Quality & Environment",
    location: "Outer Ring Ward 12",
    timeAgo: "2 hrs ago",
    upvotes: 67,
    status: "Correlated to Cluster",
    clusterId: "CLUST-103",
    assignedDept: "Pollution Control Board",
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
