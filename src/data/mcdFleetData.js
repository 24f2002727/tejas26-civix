// CivicEye MCD Mobile Vehicle Fleet & Dashcam Data Lake
// Real-time mobile vision feeds from Municipal Corporation vehicles patrolling streets with zero fixed CCTV coverage.

export const MCD_VEHICLE_FLEET = [
  {
    id: "MCD-PATROL-01",
    vehicleNumber: "DL-1C-AA-4092",
    type: "Road Surface Inspection Van",
    name: "MCD Pothole Scanner Unit 01",
    driver: "Rajesh Kumar (Inspector)",
    department: "Roads & Bridges Dept",
    ward: "Ward 12 (Civil Lines & Ring Road)",
    status: "patrolling", // patrolling, stationary, maintenance
    speedKmH: 34,
    currentLocation: "Outer Ring Road North Bypass",
    lat: 12.9745,
    lng: 77.5912,
    heading: 85, // degrees
    roadDistressIndex: 78, // 0-100 (higher = worse road condition)
    cameraSpecs: "Dual Front-Facing Sony Starvis 4K AI Dashcam",
    aiModel: "CivicEye-YOLO-v9 + Gemini Vision",
    fps: 28,
    activeAnomaliesDetected: 6,
    lastPotholeDetected: {
      id: "POT-8821",
      location: "Outer Ring Road (Opposite Pillar 142)",
      severity: "critical",
      depthEstimateCm: 14.5,
      areaSqM: 1.8,
      confidence: 96,
      time: "2 mins ago",
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
    },
    batteryLevel: 94,
    storageGbRemaining: 340
  },
  {
    id: "MCD-SWM-04",
    vehicleNumber: "DL-2C-TK-8120",
    type: "Solid Waste Compactor Truck",
    name: "MCD Sanitation Mobile Sentinel 04",
    driver: "Manoj Yadav (Sanitation Supervisor)",
    department: "Solid Waste Management",
    ward: "Ward 07 (Karol Bagh & Market Grid)",
    status: "patrolling",
    speedKmH: 22,
    currentLocation: "Bazaar Lane & Subzi Mandi Junction",
    lat: 12.9682,
    lng: 77.6035,
    heading: 190,
    roadDistressIndex: 45,
    cameraSpecs: "Wide-Angle 160° HDR Municipal AI Dashcam",
    aiModel: "CivicEye-SWM-Detector",
    fps: 30,
    activeAnomaliesDetected: 4,
    lastPotholeDetected: {
      id: "DUMP-3391",
      location: "Bazaar Lane 3 (Corner Transformer)",
      severity: "high",
      depthEstimateCm: null,
      areaSqM: 4.2,
      confidence: 93,
      time: "5 mins ago",
      imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80"
    },
    batteryLevel: 88,
    storageGbRemaining: 410
  },
  {
    id: "MCD-SWEEP-02",
    vehicleNumber: "DL-1S-SW-1105",
    type: "Mechanical Road Sweeper",
    name: "MCD Sweeper & Drain Intake Scanner",
    driver: "Amit Sharma",
    department: "Drainage & Sewerage Board",
    ward: "Ward 15 (Connaught Arterial Ring)",
    status: "patrolling",
    speedKmH: 14,
    currentLocation: "Radial Road 4 (Storm Canal Cross)",
    lat: 12.9654,
    lng: 77.5885,
    heading: 270,
    roadDistressIndex: 62,
    cameraSpecs: "Underbody Ground Scanner + Roof 360° Cam",
    aiModel: "CivicEye-SurfaceVision",
    fps: 25,
    activeAnomaliesDetected: 3,
    lastPotholeDetected: {
      id: "DRAIN-1092",
      location: "Radial Road 4 Drain Intake",
      severity: "high",
      depthEstimateCm: null,
      areaSqM: 2.1,
      confidence: 91,
      time: "8 mins ago",
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
    },
    batteryLevel: 76,
    storageGbRemaining: 520
  }
];

export const DETECTED_ROAD_ANOMALIES = [
  {
    id: "POT-8821",
    type: "Pothole / Road Surface Crater",
    category: "Roads & Potholes",
    severity: "critical",
    vehicleSource: "MCD-PATROL-01 (Inspection Van)",
    location: "Outer Ring Road (Opposite Pillar 142, North Lane)",
    lat: 12.9745,
    lng: 77.5912,
    depthEstimateCm: 14.5,
    widthCm: 85,
    confidence: 96,
    time: "2 mins ago",
    status: "flagged_to_works",
    bbox: { x: 28, y: 55, w: 42, h: 32 },
    aiDiagnosis: "Asphalt topcoat shattered with sub-base gravel exposed. High risk for 2-wheelers and night traffic.",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "POT-8822",
    type: "Multiple Transverse Road Cracks",
    category: "Roads & Potholes",
    severity: "high",
    vehicleSource: "MCD-PATROL-01 (Inspection Van)",
    location: "Fraser Road Extension (Near Community Park)",
    lat: 12.9721,
    lng: 77.5879,
    depthEstimateCm: 6.2,
    widthCm: 120,
    confidence: 91,
    time: "14 mins ago",
    status: "investigating",
    bbox: { x: 15, y: 48, w: 70, h: 25 },
    aiDiagnosis: "Severe alligator cracking along the left wheel-path; water percolation risk before monsoon.",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "DUMP-3391",
    type: "Illegal Garbage Accumulation on Road Verge",
    category: "Waste Accumulation",
    severity: "high",
    vehicleSource: "MCD-SWM-04 (Compactor Truck)",
    location: "Bazaar Lane 3 (Corner Transformer)",
    lat: 12.9682,
    lng: 77.6035,
    depthEstimateCm: null,
    widthCm: 210,
    confidence: 93,
    time: "5 mins ago",
    status: "assigned_to_crew",
    bbox: { x: 22, y: 38, w: 55, h: 46 },
    aiDiagnosis: "Unauthorized municipal solid waste dump encroaching 1.5m into driving lane.",
    photoUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "DRAIN-1092",
    type: "Choked Catchpit & Roadside Gutter Overflow",
    category: "Drainage & Flooding",
    severity: "high",
    vehicleSource: "MCD-SWEEP-02 (Sweeper Unit)",
    location: "Radial Road 4 (Canal Overpass Entrance)",
    lat: 12.9654,
    lng: 77.5885,
    depthEstimateCm: 11.0,
    widthCm: 140,
    confidence: 94,
    time: "8 mins ago",
    status: "flagged_to_works",
    bbox: { x: 35, y: 60, w: 40, h: 30 },
    aiDiagnosis: "Stormwater catchpit silted up to 80% capacity; road runoff ponding on asphalt shoulder.",
    photoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
  }
];

export const IP_CAMERA_PRESETS = [
  {
    id: "ip_webcam_android",
    name: "IP Webcam (Android App)",
    defaultPort: 8080,
    videoPath: "/video",
    shotPath: "/shot.jpg",
    appUrl: "https://play.google.com/store/apps/details?id=com.pas.webcam",
    description: "Most popular Android camera streaming app. Turn on 'Start Server' in app and enter the displayed IP."
  },
  {
    id: "droidcam",
    name: "DroidCam (Android / iOS)",
    defaultPort: 4747,
    videoPath: "/video",
    shotPath: "/cam/1/frame.jpg",
    appUrl: "https://www.dev47apps.com/",
    description: "High-FPS low latency phone camera stream for Android and iPhone."
  },
  {
    id: "mcd_dashcam_sim",
    name: "MCD Vehicle Dashcam Simulation Feed",
    defaultPort: null,
    videoPath: "https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-street-in-the-city-43450-large.mp4",
    shotPath: null,
    isSampleVideo: true,
    description: "Simulated high-definition patrol vehicle dashcam traversing city roads."
  },
  {
    id: "urban_pothole_sim",
    name: "Urban Road & Pothole Inspection Feed",
    defaultPort: null,
    videoPath: "https://assets.mixkit.co/videos/preview/mixkit-point-of-view-of-a-car-driving-through-the-city-at-43336-large.mp4",
    shotPath: null,
    isSampleVideo: true,
    description: "Simulated road surface inspection stream with live defect computer vision."
  }
];
