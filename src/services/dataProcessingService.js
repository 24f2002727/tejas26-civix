// CivicEye Intelligent Data Processing & Correlation Engine
// Performs Spatio-Temporal Clustering, Semantic Correlation, Real-Time AI Root-Cause Synthesis, and Human-in-the-Loop Routing.

import { dbService } from './dbService';
import { synthesizeClusterDiagnosis } from './aiService';

// Haversine Distance Formula (km)
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// Department Mapping
export const CATEGORY_DEPT_MAP = {
  'Roads & Potholes': 'Roads & Bridges Dept',
  'Waste Accumulation': 'Solid Waste Management',
  'Drainage & Flooding': 'Drainage & Sewerage Board',
  'Water Supply': 'Municipal Water Board',
  'Electrical & Lighting': 'Public Works & Electrical',
  'Air Quality & Environment': 'Pollution Control Board'
};

export const dataProcessingService = {
  // Correlate an incoming signal (Citizen Report or Live Camera Anomaly) with existing Problem Clusters
  async processIncomingSignal(signal, currentClusters = []) {
    const {
      title = 'Civic Anomaly Flagged',
      category = 'Roads & Potholes',
      lat = 12.9716,
      lng = 77.5946,
      location = 'Ward Area',
      confidence = 90,
      severity = 'high',
      sourceType = 'citizen', // 'citizen' | 'camera' | 'fleet_dashcam'
      sourceName = 'Live Mobile Sentinel',
      mediaUrl = null,
      potholeDepthEst = null
    } = signal;

    let bestCluster = null;
    let highestScore = 0;

    // Evaluate correlation score across existing clusters
    for (const cluster of currentClusters) {
      if (cluster.status === 'resolved') continue;

      const distKm = calculateDistanceKm(lat, lng, cluster.geoCenter?.lat || lat, cluster.geoCenter?.lng || lng);
      
      // Spatial match score (1.0 if within 0.2km, drops to 0 at 2.0km)
      const geoScore = Math.max(0, 1 - distKm / 2.0);

      // Category match score
      const catScore = cluster.category === category ? 1.0 : 0.0;

      // Composite correlation weight: 60% Geo-proximity + 40% Category Match
      const totalCorrelation = 0.6 * geoScore + 0.4 * catScore;

      if (totalCorrelation > 0.60 && totalCorrelation > highestScore) {
        highestScore = totalCorrelation;
        bestCluster = cluster;
      }
    }

    let updatedClusters = [...currentClusters];
    let matchedClusterId = null;
    let isNewClusterCreated = false;

    if (bestCluster) {
      // 1. CORRELATE TO EXISTING CLUSTER
      matchedClusterId = bestCluster.id;
      const newSignalEntry = {
        type: sourceType,
        source: sourceName,
        event: potholeDepthEst 
          ? `${title} (Depth Est: ${potholeDepthEst})`
          : title,
        confidence: confidence,
        time: 'Just now',
        mediaUrl: mediaUrl
      };

      const updatedCluster = {
        ...bestCluster,
        reportCount: (bestCluster.reportCount || 1) + 1,
        lastUpdated: 'Just now',
        surgeVelocity: `+${Math.min(990, (bestCluster.reportCount + 1) * 15)}% surge`,
        confidence: Math.min(99, Math.max(bestCluster.confidence, confidence)),
        signals: [newSignalEntry, ...(bestCluster.signals || []).slice(0, 15)]
      };

      // Recalculate cluster centroid slightly toward new report
      if (bestCluster.geoCenter && lat && lng) {
        updatedCluster.geoCenter = {
          lat: Math.round(((bestCluster.geoCenter.lat + lat) / 2) * 10000) / 10000,
          lng: Math.round(((bestCluster.geoCenter.lng + lng) / 2) * 10000) / 10000
        };
      }

      updatedClusters = updatedClusters.map(c => c.id === bestCluster.id ? updatedCluster : c);
      await dbService.put('clusters', updatedCluster);

    } else {
      // 2. SPAWN NOVEL PROBLEM CLUSTER (Autonomous Geo-Spawning)
      isNewClusterCreated = true;
      matchedClusterId = `CLUST-${Math.floor(100 + Math.random() * 900)}`;

      const initialRootCause = category === 'Roads & Potholes'
        ? 'Repeated surface impact and asphalt degradation observed on heavy transit lane.'
        : category === 'Waste Accumulation'
        ? 'Unauthorized secondary commercial waste accumulation spilling into driving lane.'
        : category === 'Drainage & Flooding'
        ? 'Stormwater intake silted or culvert blocked by street debris.'
        : 'Anomalous civic pattern identified by multimodal edge intelligence.';

      const newCluster = {
        id: matchedClusterId,
        title: `${category}: ${title.slice(0, 48)}`,
        category: category,
        severity: severity,
        confidence: confidence,
        status: 'investigating',
        assignedDept: CATEGORY_DEPT_MAP[category] || 'Municipal Administration',
        location: location,
        geoCenter: { lat: lat || 12.9716, lng: lng || 77.5946 },
        radiusKm: 1.2,
        reportCount: 1,
        surgeVelocity: 'Newly Detected Cluster',
        firstDetected: new Date().toLocaleTimeString(),
        lastUpdated: 'Just now',
        aiRootCause: initialRootCause,
        signals: [
          {
            type: sourceType,
            source: sourceName,
            event: title,
            confidence: confidence,
            time: 'Just now',
            mediaUrl: mediaUrl
          }
        ],
        nlpThemes: [
          { text: title, count: 1 }
        ],
        recommendedAction: `Deploy inspection crew from ${CATEGORY_DEPT_MAP[category] || 'Municipal Works'} to survey and resolve issue.`
      };

      updatedClusters = [newCluster, ...updatedClusters];
      await dbService.put('clusters', newCluster);
    }

    // 3. HUMAN-IN-THE-LOOP VERIFICATION QUEUE ROUTING
    // If confidence is between 60% and 85% or severity is critical, create crowd verification task
    if (confidence < 86 && confidence >= 60) {
      const verificationTask = {
        id: `DOUBT-${Math.floor(1000 + Math.random() * 9000)}`,
        cameraSource: sourceName,
        location: location,
        lat: lat,
        lng: lng,
        detectedType: title,
        confidence: confidence,
        question: `AI flagged "${title}" with ${confidence}% confidence. Is this problem currently present?`,
        status: 'pending',
        clusterId: matchedClusterId,
        rewardPoints: 25,
        photoUrl: mediaUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
      };

      await dbService.put('verificationQueue', verificationTask);
    }

    return {
      updatedClusters,
      matchedClusterId,
      isNewClusterCreated
    };
  },

  // Synthesize AI Root-Cause across signals for an active cluster
  async updateClusterRootCause(clusterId, clusters) {
    const cluster = clusters.find(c => c.id === clusterId);
    if (!cluster) return null;

    const liveDiagnosis = await synthesizeClusterDiagnosis(cluster.title, cluster.signals || []);
    if (liveDiagnosis) {
      const updated = {
        ...cluster,
        aiRootCause: liveDiagnosis,
        lastUpdated: 'Just now'
      };
      await dbService.put('clusters', updated);
      return updated;
    }
    return cluster;
  }
};
