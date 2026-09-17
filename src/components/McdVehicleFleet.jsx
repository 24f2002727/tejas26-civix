import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  Radio, 
  Video, 
  Sliders, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  Compass,
  Zap,
  Clock,
  ChevronRight,
  ExternalLink,
  Smartphone,
  Eye
} from 'lucide-react';
import { MCD_VEHICLE_FLEET, DETECTED_ROAD_ANOMALIES } from '../data/mcdFleetData';

export function McdVehicleFleet({ 
  onOpenLiveCam, 
  onDispatchPothole, 
  onSelectVehicleOnMap 
}) {
  const [vehicles, setVehicles] = useState(MCD_VEHICLE_FLEET);
  const [selectedVehicle, setSelectedVehicle] = useState(MCD_VEHICLE_FLEET[0]);
  const [anomalies, setAnomalies] = useState(DETECTED_ROAD_ANOMALIES);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'potholes', 'waste', 'drainage'
  const [dispatchAlert, setDispatchAlert] = useState(null);

  const filteredAnomalies = anomalies.filter(a => {
    if (filterType === 'potholes') return a.category === 'Roads & Potholes';
    if (filterType === 'waste') return a.category === 'Waste Accumulation';
    if (filterType === 'drainage') return a.category === 'Drainage & Flooding';
    return true;
  });

  const handleDispatch = (anomaly) => {
    setAnomalies(prev => 
      prev.map(item => item.id === anomaly.id ? { ...item, status: 'dispatched_to_works' } : item)
    );
    if (onDispatchPothole) {
      onDispatchPothole(anomaly);
    }
    setDispatchAlert(`Dispatched Road Repair Work Order for ${anomaly.location} (Dept: Roads & Bridges)`);
    setTimeout(() => setDispatchAlert(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* TOP MCD FLEET HEADER BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border border-blue-900/50 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0 shadow-inner">
            <Car className="w-7 h-7 text-blue-200" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                MCD Mobile Fleet Vision & Road Distress Grid
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                {vehicles.length} Vehicles Patrolling
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Vehicle-mounted AI dashcams detecting potholes & road defects across unmonitored municipal lanes.
            </p>
          </div>
        </div>

        {/* Action Button to launch Phone IP Camera as MCD Dashcam */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenLiveCam && onOpenLiveCam('mcd_dashcam')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-900/40"
          >
            <Smartphone className="w-4 h-4 text-blue-200" />
            <span>Mount Phone as MCD Dashcam</span>
          </button>
        </div>
      </div>

      {dispatchAlert && (
        <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{dispatchAlert}</span>
        </div>
      )}

      {/* 2-COLUMN GRID: LEFT = FLEET ROSTER, RIGHT = DETECTED POTHOLE & ROAD CRACK LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: ROVING MCD PATROL VEHICLES (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-pulse"></span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
                Active Patrol Vehicles
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Live GPS Telemetry</span>
          </div>

          <div className="space-y-3">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle.id === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-600/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-bold text-[10px]">
                          {v.vehicleNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{v.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Driver: <strong>{v.driver}</strong> • {v.department}
                      </p>
                    </div>

                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {v.speedKmH} km/h
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Current Location:</span>
                      <strong className="text-slate-800 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{v.currentLocation}</span>
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Road Distress (RDI):</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${v.roadDistressIndex > 70 ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${v.roadDistressIndex}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px] text-slate-800">{v.roadDistressIndex}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-blue-700 font-semibold">
                    <span>Active Detections: <strong>{v.activeAnomaliesDetected}</strong></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLiveCam && onOpenLiveCam('mcd_dashcam');
                      }}
                      className="flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>View Live Dashcam Feed</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* COVERAGE CALLOUT */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-blue-950">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Why MCD Vehicle Cameras?</span>
            </div>
            <p className="text-[11px] text-blue-800">
              Municipal fixed CCTV coverage is limited to major road intersections. Municipal garbage trucks and sweepers visit 100% of residential lanes daily, turning routine routes into an automated municipal defect radar.
            </p>
          </div>
        </div>

        {/* RIGHT: DETECTED POTHOLES & ROAD DEFECTS QUEUE (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
                Road Surface Defects & Potholes Queue ({filteredAnomalies.length})
              </h2>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                  filterType === 'ALL' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('potholes')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                  filterType === 'potholes' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Potholes
              </button>
              <button
                onClick={() => setFilterType('waste')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                  filterType === 'waste' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Waste
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAnomalies.map((anom) => {
              const isDispatched = anom.status === 'dispatched_to_works' || anom.status === 'assigned_to_crew';
              const isCritical = anom.severity === 'critical';

              return (
                <div key={anom.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isCritical ? 'badge-critical' : 'badge-warning'
                        }`}>
                          {anom.severity}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{anom.type}</h3>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{anom.location}</span>
                      </p>
                    </div>

                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                      {anom.confidence}% Conf.
                    </span>
                  </div>

                  {/* Telemetry row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Flagged By:</span>
                      <strong className="text-slate-800 text-[11px]">{anom.vehicleSource}</strong>
                    </div>

                    {anom.depthEstimateCm && (
                      <div>
                        <span className="text-[10px] text-slate-500 block">Est. Depth:</span>
                        <strong className="text-amber-700 text-[11px]">{anom.depthEstimateCm} cm</strong>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] text-slate-500 block">Time:</span>
                      <strong className="text-slate-700 text-[11px]">{anom.time}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic">
                    "{anom.aiDiagnosis}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">
                      GPS: {anom.lat.toFixed(4)}, {anom.lng.toFixed(4)}
                    </span>

                    <button
                      onClick={() => handleDispatch(anom)}
                      disabled={isDispatched}
                      className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDispatched
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed'
                          : 'btn-primary text-xs'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isDispatched ? 'Repair Dispatched' : 'Dispatch Rapid Patching'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
