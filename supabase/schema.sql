-- ==============================================================================
-- CivicEye: Smart City AI Civic Intelligence Platform
-- Complete Supabase PostgreSQL Schema & Realtime Setup
-- ==============================================================================
-- Paste and run this script in your Supabase Dashboard:
-- Project Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable Useful Extensions (Optional: PostGIS for advanced geospatial queries)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "postgis"; -- Uncomment if PostGIS extension is enabled in your project

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- Problem Clusters Table (Spatio-Temporal Aggregated Hotspots)
CREATE TABLE IF NOT EXISTS public.clusters (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'high',
    confidence NUMERIC DEFAULT 90,
    status TEXT NOT NULL DEFAULT 'investigating',
    "assignedDept" TEXT DEFAULT 'Municipal Administration',
    location TEXT,
    "geoCenter" JSONB DEFAULT '{"lat": 12.9716, "lng": 77.5946}'::jsonb,
    "radiusKm" NUMERIC DEFAULT 1.2,
    "reportCount" INTEGER DEFAULT 1,
    "surgeVelocity" TEXT DEFAULT 'Active Surge',
    "firstDetected" TEXT,
    "lastUpdated" TEXT,
    "aiRootCause" TEXT,
    signals JSONB DEFAULT '[]'::jsonb,
    "nlpThemes" JSONB DEFAULT '[]'::jsonb,
    "recommendedAction" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citizen Reports Table (Multimodal issue complaints submitted by citizens or AI auto-log)
CREATE TABLE IF NOT EXISTS public.citizen_reports (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL DEFAULT 'Anonymous Citizen',
    avatar TEXT DEFAULT 'AC',
    "civicScore" INTEGER DEFAULT 100,
    badge TEXT DEFAULT 'Active Citizen',
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT,
    lat NUMERIC,
    lng NUMERIC,
    "assignedDept" TEXT DEFAULT 'Municipal Administration',
    "timeAgo" TEXT DEFAULT 'Just now',
    upvotes INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Under Investigation',
    "clusterId" TEXT,
    "verifiedByAI" BOOLEAN DEFAULT TRUE,
    "scoreEarned" INTEGER DEFAULT 25,
    "mediaType" TEXT DEFAULT 'photo',
    "mediaUrl" TEXT,
    "photoUrl" TEXT,
    "potholeDepthEst" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Human-In-The-Loop Verification Queue (AI Detections requiring crowd verification)
CREATE TABLE IF NOT EXISTS public.verification_queue (
    id TEXT PRIMARY KEY,
    prompt TEXT,
    "detectedType" TEXT,
    "cameraSource" TEXT,
    location TEXT,
    "localityName" TEXT,
    lat NUMERIC,
    lng NUMERIC,
    confidence NUMERIC DEFAULT 70,
    "rewardPoints" INTEGER DEFAULT 25,
    "timeAgo" TEXT DEFAULT 'Just now',
    status TEXT DEFAULT 'pending',
    "doubtReason" TEXT,
    "photoUrl" TEXT,
    "clusterId" TEXT,
    "verifiedAnswer" TEXT,
    "confirmedByGeo" JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live CCTV & Mobile Sentinel Cameras Grid
CREATE TABLE IF NOT EXISTS public.cameras (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    lat NUMERIC,
    lng NUMERIC,
    status TEXT DEFAULT 'active',
    "aiDetection" JSONB,
    "lastPing" TEXT DEFAULT 'Just now',
    "streamQuality" TEXT DEFAULT '1080p 30fps',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Municipal MCD Mobile Vehicle Fleet
CREATE TABLE IF NOT EXISTS public.mcd_vehicles (
    id TEXT PRIMARY KEY,
    "vehicleNumber" TEXT,
    type TEXT,
    name TEXT,
    driver TEXT,
    department TEXT,
    ward TEXT,
    status TEXT DEFAULT 'patrolling',
    "speedKmH" NUMERIC DEFAULT 0,
    "currentLocation" TEXT,
    lat NUMERIC,
    lng NUMERIC,
    heading NUMERIC DEFAULT 0,
    "roadDistressIndex" NUMERIC DEFAULT 50,
    "cameraSpecs" TEXT,
    "aiModel" TEXT,
    fps INTEGER DEFAULT 30,
    "activeAnomaliesDetected" INTEGER DEFAULT 0,
    "lastPotholeDetected" JSONB,
    "batteryLevel" NUMERIC DEFAULT 100,
    "storageGbRemaining" NUMERIC DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable Municipal Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT DEFAULT 'Just now',
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    details TEXT,
    severity TEXT DEFAULT 'info',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citizen User Profiles & CivicScore Ledger
CREATE TABLE IF NOT EXISTS public.user_profile (
    id TEXT PRIMARY KEY DEFAULT 'USER-CURRENT',
    name TEXT NOT NULL DEFAULT 'Priya Sharma',
    avatar TEXT DEFAULT 'PS',
    score INTEGER DEFAULT 485,
    rank TEXT DEFAULT 'Community Sentinel (Top 5% in Ward 8)',
    badge TEXT DEFAULT 'Swachhata Ambassador',
    level INTEGER DEFAULT 4,
    "nextLevelScore" INTEGER DEFAULT 600,
    role TEXT DEFAULT 'citizen',
    stats JSONB DEFAULT '{
      "reportsSubmitted": 14,
      "reportsApproved": 13,
      "verificationsDone": 22,
      "gpsAccuracyScore": 98,
      "mediaUploads": 14,
      "pointsThisMonth": 185
    }'::jsonb,
    ledger JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Municipal Departments Directory
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    head TEXT,
    "activeWorkOrders" INTEGER DEFAULT 0,
    "slaRate" TEXT DEFAULT '95%',
    contact TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- ==============================================================================
-- Enables full client-side read/write access for anon & authenticated roles

DO $$
DECLARE
    t text;
    tbls text[] := ARRAY[
        'clusters', 
        'citizen_reports', 
        'verification_queue', 
        'cameras', 
        'mcd_vehicles', 
        'audit_logs', 
        'user_profile', 
        'departments'
    ];
BEGIN
    FOREACH t IN ARRAY tbls LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        
        -- Drop existing policy if any
        EXECUTE format('DROP POLICY IF EXISTS "Public access on %I" ON public.%I;', t, t);
        
        -- Create open policy for hackathon/dev client usage
        EXECUTE format('
            CREATE POLICY "Public access on %I" 
            ON public.%I 
            FOR ALL 
            TO public 
            USING (true) 
            WITH CHECK (true);
        ', t, t);
    END LOOP;
END $$;

-- ==============================================================================
-- 4. ENABLE REALTIME BROADCASTING
-- ==============================================================================
-- Ensures any row insert/update/delete notifies connected web clients instantly

DO $$
DECLARE
    t text;
    tbls text[] := ARRAY[
        'clusters', 
        'citizen_reports', 
        'verification_queue', 
        'cameras', 
        'mcd_vehicles', 
        'audit_logs', 
        'user_profile', 
        'departments'
    ];
BEGIN
    FOREACH t IN ARRAY tbls LOOP
        BEGIN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', t);
        EXCEPTION WHEN duplicate_object THEN
            -- Table is already in the publication, ignore
        END;
    END LOOP;
END $$;

-- ==============================================================================
-- 5. STORAGE BUCKET FOR MEDIA UPLOADS ('civiceye-media')
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('civiceye-media', 'civiceye-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if present
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Public can update media" ON storage.objects;

-- Allow public viewing of media
CREATE POLICY "Public can view media" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'civiceye-media');

-- Allow public uploading of media
CREATE POLICY "Public can upload media" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'civiceye-media');

-- Allow updating
CREATE POLICY "Public can update media" 
ON storage.objects FOR UPDATE 
TO public 
USING (bucket_id = 'civiceye-media');

-- ==============================================================================
-- 6. DEFAULT SEED DATA (INITIAL DATA LAKE)
-- ==============================================================================

-- 6.1 Problem Clusters
INSERT INTO public.clusters (id, title, category, severity, confidence, status, "assignedDept", location, "geoCenter", "radiusKm", "reportCount", "surgeVelocity", "firstDetected", "lastUpdated", "aiRootCause", signals, "nlpThemes", "recommendedAction")
VALUES 
(
    'CLUST-101',
    'Choked Drainage Causing Cascading Waterlogging',
    'Drainage & Flooding',
    'critical',
    94,
    'investigating',
    'Drainage & Sewerage Board',
    'Metro Junction Underpass & Sector 9 Drain',
    '{"lat": 12.9716, "lng": 77.5946}'::jsonb,
    1.4,
    43,
    '+380% in 18 hrs',
    '2026-09-08 07:15',
    '12 mins ago',
    'Storm drain intake choked with accumulated solid waste & plastic debris, preventing surface runoff from escaping underpass during morning rains.',
    '[
        {"type": "camera", "source": "CAM-04 (Underpass Inflow)", "event": "Waterlogging Depth: 18cm", "confidence": 94, "time": "08:10 AM"},
        {"type": "citizen", "source": "15 Citizen Reports", "event": "Severe road flooding & traffic stall", "confidence": 98, "time": "08:15 AM - 09:30 AM"},
        {"type": "citizen", "source": "8 Citizen Reports", "event": "Storm drain inlet completely blocked with debris", "confidence": 91, "time": "08:45 AM - 09:10 AM"},
        {"type": "camera", "source": "CAM-02 (Sector 9 Canal Inflow)", "event": "Solid waste accumulation covering 65% of grate", "confidence": 89, "time": "07:30 AM"}
    ]'::jsonb,
    '[
        {"text": "Road underwater near underpass", "count": 18},
        {"text": "Drain blocked by garbage bags", "count": 12},
        {"text": "Water level rising on Main Road", "count": 8}
    ]'::jsonb,
    'Dispatch high-pressure jetting suction truck to clear Canal Inflow Grate at Sector 9, followed by surface water pumping at Metro Underpass.'
),
(
    'CLUST-102',
    'Localized Water Supply Disruption & Pressure Loss',
    'Water Supply',
    'high',
    91,
    'investigating',
    'Municipal Water Board',
    'Green Glen Layout & Sector 4 Feeder Line',
    '{"lat": 12.9789, "lng": 77.6023}'::jsonb,
    0.8,
    27,
    '+220% in 6 hrs',
    '2026-09-08 06:00',
    '25 mins ago',
    'Primary booster pump valve station #B4 tripped due to line pressure surge, restricting gravity flow to Green Glen Block A & B.',
    '[
        {"type": "citizen", "source": "27 Verified Reports", "event": "Zero tap pressure since early morning", "confidence": 97, "time": "06:30 AM - 09:00 AM"}
    ]'::jsonb,
    '[
        {"text": "No water since morning", "count": 14},
        {"text": "Low pressure in taps", "count": 8}
    ]'::jsonb,
    'Dispatch hydraulic line technician to inspect and reset Booster Station #B4 pressure relief bypass valve.'
)
ON CONFLICT (id) DO NOTHING;

-- 6.2 Citizen Reports
INSERT INTO public.citizen_reports (id, author, avatar, "civicScore", badge, title, category, location, lat, lng, "assignedDept", "timeAgo", upvotes, status, "clusterId", "verifiedByAI", "scoreEarned", "photoUrl")
VALUES 
(
    'REP-4091',
    'Priya Sharma',
    'PS',
    485,
    'Neighborhood Guardian',
    'Storm drain inlet completely blocked with garbage bags',
    'Drainage & Flooding',
    'Near Sector 9 Canal Bridge',
    12.9716,
    77.5946,
    'Drainage & Sewerage Board',
    '15 mins ago',
    24,
    'Correlated to Cluster',
    'CLUST-101',
    true,
    25,
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80'
),
(
    'REP-4088',
    'Arjun Mehta',
    'AM',
    320,
    'Trusted Sentinel',
    'Water is knee deep under Metro bridge, cars getting stuck',
    'Drainage & Flooding',
    'Metro Underpass',
    12.9698,
    77.5921,
    'Drainage & Sewerage Board',
    '32 mins ago',
    41,
    'Correlated to Cluster',
    'CLUST-101',
    true,
    25,
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- 6.3 User Profile
INSERT INTO public.user_profile (id, name, avatar, score, rank, badge, level, "nextLevelScore", role, stats, ledger)
VALUES 
(
    'USER-CURRENT',
    'Priya Sharma',
    'PS',
    485,
    'Community Sentinel (Top 5% in Ward 8)',
    'Swachhata Ambassador',
    4,
    600,
    'citizen',
    '{
      "reportsSubmitted": 14,
      "reportsApproved": 13,
      "verificationsDone": 22,
      "gpsAccuracyScore": 98,
      "mediaUploads": 14,
      "pointsThisMonth": 185
    }'::jsonb,
    '[
      {
        "id": "LEDG-01",
        "action": "Geotagged Issue Report: Drainage Blockage",
        "points": 25,
        "type": "earned",
        "timestamp": "Today, 10:40 AM",
        "badge": "GPS Verified"
      }
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 6.4 Departments
INSERT INTO public.departments (id, name, head, "activeWorkOrders", "slaRate", contact, phone)
VALUES 
('DEPT-01', 'Drainage & Sewerage Board', 'Er. R. K. Saxena (Chief Engineer)', 12, '94.2%', 'drainage.ops@civiceye.gov.in', '080-2299-4411'),
('DEPT-02', 'Solid Waste Management', 'Dr. Sunita Kulkarni (Director)', 18, '91.8%', 'swm.cleancity@civiceye.gov.in', '080-2299-4422'),
('DEPT-03', 'Roads & Bridges Dept', 'Er. Amitabh Das (Superintendent)', 8, '88.5%', 'roads.maintenance@civiceye.gov.in', '080-2299-4433'),
('DEPT-04', 'Municipal Water Board', 'Smt. Leela Nambiar (Executive Engineer)', 5, '96.4%', 'water.supply@civiceye.gov.in', '080-2299-4444'),
('DEPT-05', 'Public Works & Electrical', 'Er. H. S. Rawat (Divisional Engineer)', 7, '92.1%', 'streetlights.pwd@civiceye.gov.in', '080-2299-4455'),
('DEPT-06', 'Pollution Control Board', 'Dr. Farooq Ali (Regional Officer)', 3, '89.0%', 'airquality.kspcb@civiceye.gov.in', '080-2299-4466')
ON CONFLICT (id) DO NOTHING;

-- 6.5 Live Cameras
INSERT INTO public.cameras (id, name, location, lat, lng, status, "aiDetection", "lastPing", "streamQuality")
VALUES
('CAM-01', 'Metro Underpass Junction', 'Main Ring Road North', 12.9716, 77.5946, 'active', '{"type": "Waterlogging", "confidence": 94, "severity": "high", "bbox": {"x": 18, "y": 52, "w": 64, "h": 40}, "details": "Water depth: 18cm | Surface area: 120 sq m"}'::jsonb, 'Just now', '1080p 30fps'),
('CAM-02', 'Sector 9 Storm Canal Inflow', 'Canal Road & Drainage Gate', 12.9698, 77.5921, 'active', '{"type": "Waste Accumulation", "confidence": 89, "severity": "critical", "bbox": {"x": 30, "y": 40, "w": 45, "h": 48}, "details": "Solid waste choke on primary inlet grate: 65% obstruction"}'::jsonb, 'Just now', '1080p 30fps'),
('CAM-03', 'Commercial Market South', 'Bazaar Square & Lane 3', 12.9665, 77.6012, 'active', '{"type": "Illegal Dumping", "confidence": 92, "severity": "moderate", "bbox": {"x": 22, "y": 60, "w": 35, "h": 32}, "details": "Commercial carton & plastic pile: ~1.5 tons"}'::jsonb, 'Just now', '720p 24fps'),
('CAM-04', 'MG Road Arterial Feeder', '14th Cross & High Street', 12.9752, 77.5898, 'active', '{"type": "Low Illumination Fault", "confidence": 86, "severity": "moderate", "bbox": {"x": 10, "y": 15, "w": 80, "h": 75}, "details": "8 poles offline | Ambient lux: 4.2 (Critically Low)"}'::jsonb, 'Just now', '1080p 30fps')
ON CONFLICT (id) DO NOTHING;
