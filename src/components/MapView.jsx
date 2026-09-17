import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LocateFixed, Loader2 } from 'lucide-react';
import { getBestLocation } from '../services/geoService';

export function MapView({ clusters, cameras, selectedCluster, onSelectCluster }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const userMarkerRef = useRef(null);
  
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  // Initialize Map with 100% Free OpenStreetMap Tiles (No API key or watermark)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter = clusters[0]?.geoCenter 
        ? [clusters[0].geoCenter.lat, clusters[0].geoCenter.lng] 
        : [25.5941, 85.1356];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Free OpenStreetMap Standard Tiles (No API Key Required & Zero Watermark)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Layers group for markers
      const layerGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Auto-center on user's real location on load
      locateUser(false);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Function to locate user (via GPS or IP fallback)
  const locateUser = async (showNotification = true) => {
    setLocating(true);
    if (showNotification) setLocationStatus('Detecting your location...');

    try {
      const loc = await getBestLocation();
      setUserLocation(loc);

      const map = mapInstanceRef.current;
      if (map && loc.lat && loc.lng) {
        // Fly smoothly to user's real location
        map.flyTo([loc.lat, loc.lng], 13, { duration: 1.2 });

        // Remove old marker if exists
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        // Custom Glowing User Location Marker
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; cursor: pointer;">
              <div style="position: absolute; width: 40px; height: 40px; border-radius: 9999px; background: #2563EB; opacity: 0.35; animation: pulse-radar 2s infinite;"></div>
              <div style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background: #2563EB; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(37,99,235,0.8);">
                <div style="width: 6px; height: 6px; border-radius: 9999px; background: #FFFFFF;"></div>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: userIcon });
        marker.bindPopup(`
          <div style="padding: 4px 2px; font-family: sans-serif;">
            <div style="font-size: 11px; font-weight: 700; color: #1D4ED8; margin-bottom: 2px;">📍 Your Current Location</div>
            <div style="font-size: 13px; font-weight: 700; color: #0F172A;">${loc.address || loc.city}</div>
            <div style="font-size: 10px; color: #64748B; margin-top: 3px;">Source: ${loc.source} (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})</div>
          </div>
        `).openPopup();

        marker.addTo(map);
        userMarkerRef.current = marker;

        if (showNotification) {
          setLocationStatus(`Centered on ${loc.city || loc.address}`);
          setTimeout(() => setLocationStatus(null), 3000);
        }
      }
    } catch (err) {
      console.warn('Locate error:', err);
      if (showNotification) {
        setLocationStatus('Could not detect location.');
        setTimeout(() => setLocationStatus(null), 3000);
      }
    } finally {
      setLocating(false);
    }
  };

  // Update Markers & Clusters on Data Changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layersGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Render Clusters (Hotspots)
    clusters.forEach((clust) => {
      const isSelected = selectedCluster?.id === clust.id;
      const color = clust.severity === 'critical' ? '#DC2626' : clust.severity === 'high' ? '#D97706' : '#2563EB';

      // 1. Hotspot Radius Circle
      const circle = L.circle([clust.geoCenter.lat, clust.geoCenter.lng], {
        radius: clust.radiusKm * 400,
        color: color,
        fillColor: color,
        fillOpacity: isSelected ? 0.25 : 0.12,
        weight: isSelected ? 2.5 : 1.5,
        dashArray: isSelected ? null : '4, 6'
      });
      circle.addTo(layerGroup);
      circle.on('click', () => onSelectCluster(clust));

      // 2. Custom Hotspot Pulse Marker
      const clusterIcon = L.divIcon({
        className: 'custom-cluster-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; cursor: pointer;">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: ${color}; opacity: 0.25; animation: pulse-radar 2s infinite;"></div>
            <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background: #FFFFFF; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
              <span style="font-size: 11px; font-weight: 800; color: ${color}; font-family: monospace;">${clust.reportCount}</span>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([clust.geoCenter.lat, clust.geoCenter.lng], { icon: clusterIcon });
      marker.bindPopup(`
        <div style="padding: 4px 2px; font-family: sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${color}; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">${clust.severity}</span>
            <span style="font-size: 11px; color: #64748B;">Confidence: <strong style="color: #0F172A;">${clust.confidence}%</strong></span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #0F172A; margin: 4px 0;">${clust.title}</h4>
          <p style="font-size: 11px; color: #475569; margin: 2px 0;">📍 ${clust.location}</p>
          <div style="font-size: 11px; color: #1D4ED8; margin-top: 6px; font-weight: 600;">⚡ ${clust.reportCount} Reports • ${clust.surgeVelocity}</div>
        </div>
      `);
      marker.addTo(layerGroup);
      marker.on('click', () => onSelectCluster(clust));
    });

    // Render CCTV Camera Nodes
    cameras.forEach((cam) => {
      const camIcon = L.divIcon({
        className: 'custom-cam-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px; border-radius: 8px; background: #1E3A8A; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: pointer;">
            <div style="position: absolute; top: -3px; right: -3px; width: 7px; height: 7px; border-radius: 9999px; background: #10B981; border: 1px solid #FFFFFF;"></div>
            <span style="font-size: 12px;">📷</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([cam.lat, cam.lng], { icon: camIcon });
      marker.bindPopup(`
        <div style="padding: 4px 2px; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: #1D4ED8; color: #FFFFFF; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px;">GOV CCTV</span>
            <span style="font-size: 11px; font-weight: 700; color: #0F172A;">${cam.name}</span>
          </div>
          <p style="font-size: 11px; color: #475569; margin-bottom: 4px;">📍 ${cam.location}</p>
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 6px 8px; border-radius: 6px; margin-top: 4px;">
            <div style="font-size: 11px; font-weight: 700; color: #1E40AF;">👁️ AI Detection: ${cam.aiDetection.type} (${cam.aiDetection.confidence}%)</div>
            <div style="font-size: 10px; color: #334155; margin-top: 2px;">${cam.aiDetection.details}</div>
          </div>
        </div>
      `);
      marker.addTo(layerGroup);
    });

    // Render MCD Mobile Fleet Vehicles with AI Dashcams
    const mcdList = (window.__CIVIC_MCD_FLEET || [
      { id: 'MCD-PATROL-01', name: 'MCD Pothole Scanner Van', vehicleNumber: 'DL-1C-AA-4092', lat: 12.9745, lng: 77.5912, speed: '34 km/h', ward: 'Ward 12' },
      { id: 'MCD-SWM-04', name: 'MCD Sanitation Truck 04', vehicleNumber: 'DL-2C-TK-8120', lat: 12.9682, lng: 77.6035, speed: '22 km/h', ward: 'Ward 07' },
      { id: 'MCD-SWEEP-02', name: 'MCD Mechanical Sweeper', vehicleNumber: 'DL-1S-SW-1105', lat: 12.9654, lng: 77.5885, speed: '14 km/h', ward: 'Ward 15' }
    ]);

    mcdList.forEach((v) => {
      const vIcon = L.divIcon({
        className: 'custom-mcd-vehicle-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; border-radius: 10px; background: #047857; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(4,120,87,0.4); cursor: pointer;">
            <div style="position: absolute; width: 42px; height: 42px; border-radius: 9999px; background: #10B981; opacity: 0.25; animation: pulse-radar 2.2s infinite;"></div>
            <span style="font-size: 14px; position: relative;">🚚</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const vMarker = L.marker([v.lat, v.lng], { icon: vIcon });
      vMarker.bindPopup(`
        <div style="padding: 4px 2px; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: #047857; color: #FFFFFF; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px;">MCD PATROL</span>
            <span style="font-size: 11px; font-weight: 700; color: #0F172A;">${v.name}</span>
          </div>
          <p style="font-size: 11px; color: #475569; margin-bottom: 2px;">Reg: <strong>${v.vehicleNumber}</strong> • ${v.ward || 'Municipal Ward'}</p>
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 4px 6px; border-radius: 6px; font-size: 10px; color: #065F46; font-weight: 600;">
            ⚡ AI Dashcam Active • Speed: ${v.speed || '28 km/h'}
          </div>
        </div>
      `);
      vMarker.addTo(layerGroup);
    });

    // Render Road Surface Potholes detected by Mobile MCD Cameras
    const potholePins = [
      { id: 'POT-8821', title: 'Road Crater (14.5cm Depth)', lat: 12.9745, lng: 77.5912, location: 'Outer Ring Road Pillar 142' },
      { id: 'POT-8822', title: 'Transverse Asphalt Crack', lat: 12.9721, lng: 77.5879, location: 'Fraser Road Ext' }
    ];

    potholePins.forEach((p) => {
      const pIcon = L.divIcon({
        className: 'custom-pothole-marker',
        html: `
          <div style="position: relative; width: 26px; height: 26px; border-radius: 9999px; background: #D97706; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer;">
            <span style="font-size: 11px;">⚠️</span>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const pMarker = L.marker([p.lat, p.lng], { icon: pIcon });
      pMarker.bindPopup(`
        <div style="padding: 4px 2px; font-family: sans-serif;">
          <div style="font-size: 10px; font-weight: 700; color: #B45309; text-transform: uppercase;">MCD Dashcam Flagged</div>
          <h4 style="font-size: 12px; font-weight: 700; color: #0F172A; margin: 2px 0;">${p.title}</h4>
          <p style="font-size: 10px; color: #64748B;">📍 ${p.location}</p>
        </div>
      `);
      pMarker.addTo(layerGroup);
    });

    // Fly to selected cluster if clicked
    if (selectedCluster && selectedCluster.geoCenter && !locating) {
      map.flyTo([selectedCluster.geoCenter.lat, selectedCluster.geoCenter.lng], 14, { duration: 1 });
    }
  }, [clusters, cameras, selectedCluster, onSelectCluster]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs text-slate-800 font-medium">
        <span className="w-2 h-2 rounded-full bg-blue-600 live-pulse"></span>
        <span>CivicEye Spatial GIS</span>
        <span className="text-slate-300 font-mono">|</span>
        <span className="text-slate-600 font-mono text-[11px]">{clusters.length} Hotspots • {cameras.length} CCTV Feeds</span>
      </div>

      {/* Locate Me Button on Map */}
      <div className="absolute top-3 right-12 z-[400] flex items-center gap-2">
        <button
          onClick={() => locateUser(true)}
          disabled={locating}
          className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-slate-800 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold shadow-xs cursor-pointer transition-all"
          title="Center map on your real GPS / City location"
        >
          {locating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" />
              <span>Locating...</span>
            </>
          ) : (
            <>
              <LocateFixed className="w-3.5 h-3.5 text-blue-700" />
              <span>Use My Location</span>
            </>
          )}
        </button>
      </div>

      {/* Location Status Toast */}
      {locationStatus && (
        <div className="absolute top-14 right-3 z-[400] bg-slate-900/90 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-md animate-fadeIn">
          {locationStatus}
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 text-[11px] flex flex-wrap items-center gap-3 text-slate-700 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <span>Critical Hotspot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Emerging Surge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px]">📷</span>
          <span>Municipal Camera</span>
        </div>
        {userLocation && (
          <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>You: {userLocation.city || 'Here'}</span>
          </div>
        )}
      </div>

      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
