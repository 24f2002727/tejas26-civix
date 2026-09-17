import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MissionLandingPage } from './components/MissionLandingPage';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { CitizenPortal } from './components/CitizenPortal';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { CivicScoreModal } from './components/CivicScoreModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LivePhoneCamera } from './components/LivePhoneCamera';
import { 
  INITIAL_CLUSTERS, 
  LIVE_CAMERAS, 
  INITIAL_CITIZEN_REPORTS, 
  VERIFICATION_QUEUE, 
  USER_PROFILE,
  MUNICIPAL_DEPARTMENTS,
  INITIAL_AUDIT_LOGS
} from './data/civicData';
import { dbService } from './services/dbService';
import { dataProcessingService } from './services/dataProcessingService';
import { Building2, Compass, Shield, Users, ShieldAlert, HeartHandshake, Leaf } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('landing'); // landing, citizen, authority, super_admin
  const [clusters, setClusters] = useState(INITIAL_CLUSTERS);
  const [cameras, setCameras] = useState(LIVE_CAMERAS);
  const [citizenReports, setCitizenReports] = useState(INITIAL_CITIZEN_REPORTS);
  const [verificationQueue, setVerificationQueue] = useState(VERIFICATION_QUEUE);
  const [userProfile, setUserProfile] = useState(USER_PROFILE);
  const [departments, setDepartments] = useState(MUNICIPAL_DEPARTMENTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [selectedCluster, setSelectedCluster] = useState(INITIAL_CLUSTERS[0]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  
  // Modals
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isLiveCamOpen, setIsLiveCamOpen] = useState(false);
  const [liveCamInitialMode, setLiveCamInitialMode] = useState('ip_stream');

  // Load Persisted Data from IndexedDB on App Startup
  useEffect(() => {
    async function loadDataLake() {
      try {
        await dbService.initDatabase();
        
        const [
          savedClusters,
          savedReports,
          savedQueue,
          savedCameras,
          savedLogs,
          savedProfile,
          savedDepts
        ] = await Promise.all([
          dbService.getAll('clusters'),
          dbService.getAll('citizenReports'),
          dbService.getAll('verificationQueue'),
          dbService.getAll('cameras'),
          dbService.getAll('auditLogs'),
          dbService.getAll('userProfile'),
          dbService.getAll('departments')
        ]);

        if (savedClusters && savedClusters.length > 0) {
          setClusters(savedClusters);
          setSelectedCluster(savedClusters[0]);
        }
        if (savedReports && savedReports.length > 0) setCitizenReports(savedReports);
        if (savedQueue && savedQueue.length > 0) setVerificationQueue(savedQueue);
        if (savedCameras && savedCameras.length > 0) setCameras(savedCameras);
        if (savedLogs && savedLogs.length > 0) setAuditLogs(savedLogs);
        if (savedProfile && savedProfile.length > 0) setUserProfile(savedProfile[0]);
        if (savedDepts && savedDepts.length > 0) setDepartments(savedDepts);

        setIsDbLoaded(true);
      } catch (e) {
        console.warn('Data Lake loading error:', e);
        setIsDbLoaded(true);
      }
    }
    loadDataLake();
  }, []);

  const handleOpenLiveCam = (mode = 'ip_stream') => {
    setLiveCamInitialMode(mode);
    setIsLiveCamOpen(true);
  };

  // Register a new live camera node into Data Lake
  const handleRegisterCamera = async (newCam) => {
    setCameras(prev => [newCam, ...prev]);
    await dbService.put('cameras', newCam);

    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      action: 'Live AI Camera Sentinel Registered',
      actor: 'Municipal Command / Live Phone Node',
      details: `Registered ${newCam.name} at ${newCam.location} (${newCam.streamQuality}) with active CV anomaly model.`,
      severity: 'info'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await dbService.put('auditLogs', newLog);
  };

  // Dispatch work order for a problem cluster
  const handleDispatchCluster = async (clusterId) => {
    const targetCluster = clusters.find(c => c.id === clusterId);
    if (!targetCluster) return;

    const updatedCluster = { ...targetCluster, status: 'dispatched' };

    setClusters(prev => prev.map(c => c.id === clusterId ? updatedCluster : c));
    if (selectedCluster?.id === clusterId) {
      setSelectedCluster(updatedCluster);
    }
    await dbService.put('clusters', updatedCluster);

    // Add Audit Log
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      action: 'Work Order Dispatched',
      actor: 'Authority Command',
      details: `Work order dispatched to ${targetCluster?.assignedDept || 'Field Team'} for ${targetCluster?.title}`,
      severity: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await dbService.put('auditLogs', newLog);

    // Update Department active work order count
    if (targetCluster?.assignedDept) {
      setDepartments((prev) => {
        const updatedDepts = prev.map((d) =>
          d.name === targetCluster.assignedDept
            ? { ...d, activeWorkOrders: d.activeWorkOrders + 1 }
            : d
        );
        dbService.bulkPut('departments', updatedDepts);
        return updatedDepts;
      });
    }
  };

  // Mark an issue resolved
  const handleResolveCluster = async (clusterId) => {
    const targetCluster = clusters.find(c => c.id === clusterId);
    if (!targetCluster) return;

    const updatedCluster = { ...targetCluster, status: 'resolved' };

    setClusters(prev => prev.map(c => c.id === clusterId ? updatedCluster : c));
    if (selectedCluster?.id === clusterId) {
      setSelectedCluster(updatedCluster);
    }
    await dbService.put('clusters', updatedCluster);

    // Add Audit Log
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      action: 'Issue Resolved & Closed',
      actor: 'Authority Command',
      details: `Resolved problem cluster ${clusterId} (${targetCluster?.title})`,
      severity: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await dbService.put('auditLogs', newLog);
  };

  // Citizen submits new report: Runs real-time Spatio-Temporal Data Processing
  const handleAddReport = async (newReportData) => {
    const newReport = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      author: userProfile.name,
      avatar: userProfile.avatar,
      civicScore: userProfile.score + newReportData.scoreEarned,
      badge: userProfile.badge,
      title: newReportData.title,
      category: newReportData.category,
      location: newReportData.location,
      lat: newReportData.lat,
      lng: newReportData.lng,
      assignedDept: newReportData.assignedDept || 'Municipal Administration',
      timeAgo: 'Just now',
      upvotes: 1,
      status: 'Correlated to Cluster',
      clusterId: 'CLUST-101',
      verifiedByAI: true,
      scoreEarned: newReportData.scoreEarned,
      mediaType: newReportData.mediaType,
      mediaUrl: newReportData.mediaUrl,
      photoUrl: newReportData.mediaUrl
    };

    // 1. Process Signal Through Spatio-Temporal Correlation Engine
    const correlationResult = await dataProcessingService.processIncomingSignal(
      {
        title: newReportData.title,
        category: newReportData.category,
        lat: newReportData.lat,
        lng: newReportData.lng,
        location: newReportData.location,
        confidence: 94,
        severity: 'high',
        sourceType: 'citizen',
        sourceName: `Citizen Report (${userProfile.name})`,
        mediaUrl: newReportData.mediaUrl,
        potholeDepthEst: newReportData.potholeDepthEst
      },
      clusters
    );

    newReport.clusterId = correlationResult.matchedClusterId;

    // 2. Persist Report & Update Clusters
    setCitizenReports(prev => [newReport, ...prev]);
    await dbService.put('citizenReports', newReport);

    if (correlationResult.updatedClusters) {
      setClusters(correlationResult.updatedClusters);
    }

    const newLedgerEntry = {
      id: `LEDG-${Math.floor(1000 + Math.random() * 9000)}`,
      action: `Reported: ${newReportData.title.slice(0, 32)}...`,
      points: newReportData.scoreEarned,
      type: 'earned',
      timestamp: 'Just now',
      badge: newReportData.mediaUrl ? 'GPS + Media Verified' : 'GPS Verified'
    };

    // 3. Update User Profile & Points
    const updatedProfile = {
      ...userProfile,
      score: userProfile.score + newReportData.scoreEarned,
      stats: {
        ...userProfile.stats,
        reportsSubmitted: userProfile.stats.reportsSubmitted + 1,
        mediaUploads: newReportData.mediaUrl ? userProfile.stats.mediaUploads + 1 : userProfile.stats.mediaUploads
      },
      ledger: [newLedgerEntry, ...(userProfile.ledger || [])]
    };
    setUserProfile(updatedProfile);
    await dbService.put('userProfile', updatedProfile);

    // 4. Add Audit Log
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      action: 'Citizen Report Logged & Processed',
      actor: `Citizen: ${userProfile.name}`,
      details: `Submitted: "${newReportData.title}" (${newReportData.category}) -> Linked to ${correlationResult.matchedClusterId} (+${newReportData.scoreEarned} pts)`,
      severity: 'info'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await dbService.put('auditLogs', newLog);
  };

  // Citizen verifies human-in-the-loop task
  const handleVerifyTask = async (taskId, answer, rewardPoints, geoContext) => {
    const task = verificationQueue.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = { 
      ...task, 
      status: 'verified',
      verifiedAnswer: answer,
      confirmedByGeo: {
        userLat: geoContext?.userLat,
        userLng: geoContext?.userLng,
        distanceKm: geoContext?.distanceKm !== undefined ? geoContext.distanceKm : 0.8,
        isLocal: geoContext?.isLocal ?? true,
        locality: geoContext?.locality || 'Ward Area',
        trustTier: geoContext?.trustTier || (geoContext?.isLocal ? 'High-Trust On-Ground' : 'Zone Observer'),
        comment: geoContext?.comment || (answer === 'yes' ? 'Citizen confirmed on-ground' : 'Citizen marked resolved'),
        timestamp: geoContext?.timestamp || 'Just now'
      }
    };

    setVerificationQueue(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    await dbService.put('verificationQueue', updatedTask);

    const distLabel = geoContext?.distanceKm !== undefined ? ` (${geoContext.distanceKm} km away)` : '';
    const badgeLabel = geoContext?.badge || (geoContext?.isLocal ? '📍 Local Resident (Geotagged)' : '📍 Crowd Verified');

    const newLedgerEntry = {
      id: `LEDG-${Math.floor(1000 + Math.random() * 9000)}`,
      action: `Geofenced Doubt Confirmation: ${task?.detectedType || 'Civic Anomaly'}${distLabel}`,
      points: rewardPoints,
      type: 'earned',
      timestamp: 'Just now',
      badge: badgeLabel
    };

    const updatedProfile = {
      ...userProfile,
      score: userProfile.score + rewardPoints,
      stats: {
        ...userProfile.stats,
        verificationsDone: userProfile.stats.verificationsDone + 1
      },
      ledger: [newLedgerEntry, ...(userProfile.ledger || [])]
    };
    setUserProfile(updatedProfile);
    await dbService.put('userProfile', updatedProfile);

    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      action: 'Community Geofenced Verification',
      actor: `Citizen: ${userProfile.name}`,
      details: `Citizen confirmed ${task?.cameraSource || taskId} (${answer === 'yes' ? 'Confirmed Issue' : 'False Alarm'}) at distance ${geoContext?.distanceKm || '0.8'} km (+${rewardPoints} pts)`,
      severity: 'info'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await dbService.put('auditLogs', newLog);
  };

  // Citizen takes the National Swachhata Pledge
  const handleTakePledge = async (rewardPoints = 50) => {
    const newLedgerEntry = {
      id: `LEDG-${Math.floor(1000 + Math.random() * 9000)}`,
      action: 'National Cleanliness Pledge (Swachhata Pratigya)',
      points: rewardPoints,
      type: 'earned',
      timestamp: 'Just now',
      badge: 'Pledge Completed'
    };

    const updatedProfile = {
      ...userProfile,
      score: userProfile.score + rewardPoints,
      badge: 'Swachhata Ambassador',
      ledger: [newLedgerEntry, ...(userProfile.ledger || [])]
    };
    setUserProfile(updatedProfile);
    await dbService.put('userProfile', updatedProfile);

    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      action: 'Swachhata Pledge Completed',
      actor: `Citizen: ${userProfile.name}`,
      details: `Dedicated to Swachh Bharat & Jal Jeevan Hariyali initiatives (+${rewardPoints} pts credited)`,
      severity: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await dbService.put('auditLogs', newLog);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        civicScore={userProfile.score}
        onOpenScoreModal={() => setIsScoreModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenLiveCam={handleOpenLiveCam}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <MissionLandingPage
            onNavigateTab={setActiveTab}
            userProfile={userProfile}
            onTakePledge={handleTakePledge}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortal
            userProfile={userProfile}
            citizenReports={citizenReports}
            verificationQueue={verificationQueue}
            onAddReport={handleAddReport}
            onVerifyTask={handleVerifyTask}
            onOpenScoreModal={() => setIsScoreModalOpen(true)}
            onOpenLiveCam={handleOpenLiveCam}
          />
        )}

        {activeTab === 'authority' && (
          <AuthorityDashboard
            clusters={clusters}
            cameras={cameras}
            selectedCluster={selectedCluster}
            setSelectedCluster={setSelectedCluster}
            onDispatchCluster={handleDispatchCluster}
            onResolveCluster={handleResolveCluster}
          />
        )}

        {activeTab === 'super_admin' && (
          <SuperAdminDashboard
            clusters={clusters}
            cameras={cameras}
            citizenReports={citizenReports}
            departments={departments}
            auditLogs={auditLogs}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onOpenLiveCam={handleOpenLiveCam}
            onDispatchCluster={handleDispatchCluster}
          />
        )}
      </main>

      {/* Live Phone Camera & MCD Dashcam Sentinel Modal */}
      {isLiveCamOpen && (
        <LivePhoneCamera
          initialMode={liveCamInitialMode}
          onClose={() => setIsLiveCamOpen(false)}
          onRegisterCamera={handleRegisterCamera}
          onAddReport={handleAddReport}
          onDispatchCluster={handleDispatchCluster}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          userLocation={{ locality: 'Civil Lines Ward Grid', lat: 12.9716, lng: 77.5946 }}
        />
      )}

      {/* CivicScore Info Modal */}
      <CivicScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        userProfile={userProfile}
      />

      {/* Google Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Government Clean & Rich Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 mt-12 text-xs text-slate-600 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Footer Scheme Alignment Tags */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-700" />
                <span className="font-bold text-slate-900 text-sm font-['Outfit']">Civic<span className="text-blue-700">Eye</span></span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Smart City Municipal AI Co-Governance Platform. Fostering citizen-government synergy across Bihar and India.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">National Missions</span>
              <ul className="space-y-1 text-slate-600">
                <li>• Swachh Bharat Mission (Urban 2.0)</li>
                <li>• Ek Bharat Shreshtha Bharat</li>
                <li>• Smart Cities Mission (ICCC)</li>
                <li>• Digital India Initiative</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">Govt. of Bihar Alignments</span>
              <ul className="space-y-1 text-slate-600">
                <li>• Jal-Jeevan-Hariyali Abhiyan</li>
                <li>• Saat Nischay-2 (Swachh Shahar)</li>
                <li>• Patna Nagar Nigam (Chaka Chak Patna)</li>
                <li>• UDHD Bihar Municipal Reforms</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">Citizen Helplines</span>
              <ul className="space-y-1 font-mono text-slate-700">
                <li>📞 Emergency Response: <strong className="text-slate-900">112</strong></li>
                <li>📞 PMC Toll-Free: <strong className="text-slate-900">155304 / 1916</strong></li>
                <li>📞 Swachhata Portal: <strong className="text-slate-900">14420</strong></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setActiveTab('landing')}
                className="hover:text-blue-700 font-semibold cursor-pointer"
              >
                Home
              </button>
              <span className="text-slate-300">•</span>
              <button 
                onClick={() => setActiveTab('citizen')}
                className="hover:text-blue-700 font-semibold cursor-pointer"
              >
                Citizen Portal
              </button>
              <span className="text-slate-300">•</span>
              <button 
                onClick={() => setActiveTab('authority')}
                className="hover:text-blue-700 font-semibold cursor-pointer"
              >
                Authority Command
              </button>
              <span className="text-slate-300">•</span>
              <button 
                onClick={() => setActiveTab('super_admin')}
                className="hover:text-blue-700 font-semibold cursor-pointer"
              >
                Super Admin
              </button>
            </div>

            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span>Dedicated to Clean & Resilient India</span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                System API Settings
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
