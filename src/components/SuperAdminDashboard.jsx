import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Key, 
  Building2, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Sliders, 
  Layers, 
  Radio, 
  Camera, 
  Users, 
  Clock, 
  FileText, 
  ExternalLink,
  Check,
  Zap,
  ArrowUpRight,
  Car,
  Smartphone,
  Wifi
} from 'lucide-react';
import { 
  getApiKey, 
  setApiKey, 
  getSelectedModel, 
  setSelectedModel, 
  testGeminiApiKey, 
  hasValidApiKey,
  SUPPORTED_MODELS 
} from '../services/aiService';
import { McdVehicleFleet } from './McdVehicleFleet';

export function SuperAdminDashboard({ 
  clusters, 
  cameras, 
  citizenReports, 
  departments, 
  auditLogs,
  onOpenApiKeyModal,
  onOpenLiveCam,
  onDispatchCluster
}) {
  const [adminTab, setAdminTab] = useState('overview'); // overview, ai_engine, departments, mcd_fleet, sensors, logs
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [selectedModel, setSelectedModelState] = useState(getSelectedModel());
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [keySavedAlert, setKeySavedAlert] = useState(false);

  // AI Parameters State
  const [clusterThreshold, setClusterThreshold] = useState(85);
  const [autoDispatchConfidence, setAutoDispatchConfidence] = useState(90);
  const [cameraCvSensitivity, setCameraCvSensitivity] = useState(80);

  const isConfigured = hasValidApiKey();

  const handleSaveKey = () => {
    setApiKey(keyInput);
    setSelectedModel(selectedModel);
    setKeySavedAlert(true);
    setTimeout(() => setKeySavedAlert(false), 4000);
  };

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setTestResult({ success: false, message: 'Please enter a valid Gemini API key first.' });
      return;
    }
    setIsTestingKey(true);
    setTestResult(null);
    setSelectedModel(selectedModel);
    const res = await testGeminiApiKey(keyInput.trim());
    setIsTestingKey(false);
    setTestResult(res);
  };

  const exportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `civiceye_audit_logs_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Top Banner - Matching Signature Blue Theme */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#1E40AF] text-white shadow-md border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0 shadow-inner backdrop-blur-xs">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                Super Admin System Control
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-white text-[10px] font-mono font-bold uppercase backdrop-blur-xs shadow-inner">
                Root Level
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-1 font-medium">
              Global municipal governance, department SLA tracking, and IoT sensor network.
            </p>
          </div>
        </div>

        {/* Quick KPI stats matching Authority banner */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
            <div className="text-[10px] text-blue-200 font-bold uppercase">Departments</div>
            <div className="text-lg font-black text-white font-mono">{departments.length}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
            <div className="text-[10px] text-blue-200 font-bold uppercase">CCTV Feeds</div>
            <div className="text-lg font-black text-blue-200 font-mono">{cameras.length}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
            <div className="text-[10px] text-blue-200 font-bold uppercase">Audit Logs</div>
            <div className="text-lg font-black text-emerald-300 font-mono">{auditLogs.length}</div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'overview'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setAdminTab('ai_engine')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'ai_engine'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>AI Engine & API Keys</span>
          {isConfigured && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
        </button>

        <button
          onClick={() => setAdminTab('departments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'departments'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Municipal Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('mcd_fleet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'mcd_fleet'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>MCD Mobile Fleet & Potholes</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
        </button>

        <button
          onClick={() => setAdminTab('sensors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'sensors'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>CCTV & Sensors ({cameras.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'logs'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Citizen Reports</div>
              <div className="text-2xl font-black text-slate-900 font-mono flex items-baseline gap-2">
                <span>198</span>
                <span className="text-xs text-emerald-600 font-semibold font-sans">+18% this week</span>
              </div>
              <p className="text-[11px] text-slate-500">Across 6 municipal wards</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Root Cause Clusters</div>
              <div className="text-2xl font-black text-blue-700 font-mono flex items-baseline gap-2">
                <span>{clusters.length}</span>
                <span className="text-xs text-blue-600 font-semibold font-sans">100% Correlated</span>
              </div>
              <p className="text-[11px] text-slate-500">Reduced 198 tickets into {clusters.length} actionable fixes</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average SLA Resolution</div>
              <div className="text-2xl font-black text-emerald-700 font-mono flex items-baseline gap-2">
                <span>4.8 hrs</span>
                <span className="text-xs text-emerald-600 font-semibold font-sans">-35% faster</span>
              </div>
              <p className="text-[11px] text-slate-500">Target SLA threshold: 8.0 hrs</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active CCTV & AI Vision</div>
              <div className="text-2xl font-black text-blue-700 font-mono flex items-baseline gap-2">
                <span>{cameras.length} / {cameras.length}</span>
                <span className="text-xs text-emerald-600 font-semibold font-sans">100% Online</span>
              </div>
              <p className="text-[11px] text-slate-500">Processing live video at 30 fps</p>
            </div>
          </div>

          {/* 2-Column Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Correlation Health Card */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-700" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
                    AI Intelligence & Correlation Engine
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Status: Operational
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">Current AI Model</strong>
                    <p className="text-[11px] text-slate-500">Google {selectedModel}</p>
                  </div>
                  <span className="font-mono text-slate-700 font-bold bg-white px-2 py-1 rounded border border-slate-200">
                    {isConfigured ? 'API Connected' : 'Heuristic Engine'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">Multi-Signal Ingestion Pipeline</strong>
                    <p className="text-[11px] text-slate-500">Camera Vision + Citizen NLP + GIS Spatial DBSCAN</p>
                  </div>
                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    Active (0.2s latency)
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">Citizen Trust Weighting</strong>
                    <p className="text-[11px] text-slate-500">Dynamic multiplier based on CivicScore accuracy</p>
                  </div>
                  <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded border border-blue-200">
                    1.0x - 2.0x Scaled
                  </span>
                </div>
              </div>
            </div>

            {/* Department Load & SLA Performance */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
                    Department Work Order Load
                  </h3>
                </div>
                <button
                  onClick={() => setAdminTab('departments')}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {departments.slice(0, 4).map((dept) => (
                  <div key={dept.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{dept.name}</div>
                      <div className="text-[11px] text-slate-500">Head: {dept.head} • Staff: {dept.staffCount}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[11px]">
                        {dept.activeWorkOrders} Active
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">Avg: {dept.avgResolutionHours}h</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI ENGINE & API KEY CONFIGURATION */}
      {adminTab === 'ai_engine' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-700" />
                  <span>Google Gemini API Configuration</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage the API key used by CivicEye for live LLM reasoning, NLP issue grouping, and root-cause synthesis.
                </p>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <span>Get API Key from Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {keySavedAlert && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>API Configuration saved successfully! Live Gemini reasoning is now active.</span>
              </div>
            )}

            {/* API Key Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Gemini API Key:
                  </label>
                  <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="gov-input font-mono text-xs"
                  />
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 mt-1.5 space-y-0.5">
                    <div className="font-bold">💡 Free 1-Click Key:</div>
                    <p>
                      In <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-semibold">Google AI Studio</a>, click <strong>"Create API Key in new project"</strong> to get an unrestricted Gemini API key (starts with <code className="font-mono bg-white px-1 py-0.2 rounded border border-amber-300">AIzaSy...</code>).
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your key is securely kept in browser local storage (<code className="font-mono text-[10px]">localStorage</code>).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Model Selection:
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModelState(e.target.value)}
                    className="gov-input text-xs font-medium"
                  >
                    {SUPPORTED_MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveKey}
                    className="btn-primary py-2 px-5 text-xs font-bold cursor-pointer"
                  >
                    Save API Configuration
                  </button>

                  <button
                    onClick={async () => {
                      if (!keyInput.trim()) {
                        setTestResult({ success: false, message: 'Please enter a valid Gemini API key first.' });
                        return;
                      }
                      setIsTestingKey(true);
                      setTestResult(null);
                      setSelectedModel(selectedModel);
                      const res = await testGeminiApiKey(keyInput.trim(), selectedModel);
                      setIsTestingKey(false);
                      setTestResult(res);
                      setSelectedModelState(getSelectedModel());
                    }}
                    disabled={isTestingKey || !keyInput.trim()}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isTestingKey ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-700" />
                        <span>Testing Key...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-blue-700" />
                        <span>Test API Connection</span>
                      </>
                    )}
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 animate-fadeIn ${
                      testResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{testResult.success ? 'Gemini API Connected!' : 'Connection Failed'}</div>
                      <div className="text-[11px] mt-0.5">{testResult.message}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Parameters Tuning */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Sliders className="w-4 h-4 text-blue-700" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
                    AI Reasoning Parameters
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-800 mb-1">
                      <span>Clustering Similarity Threshold:</span>
                      <span className="font-mono text-blue-700">{clusterThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="95"
                      value={clusterThreshold}
                      onChange={(e) => setClusterThreshold(Number(e.target.value))}
                      className="w-full accent-blue-700 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">Minimum semantic similarity required to merge citizen reports into a cluster.</p>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-800 mb-1">
                      <span>Auto-Dispatch Confidence:</span>
                      <span className="font-mono text-blue-700">{autoDispatchConfidence}%</span>
                    </div>
                    <input
                      type="range"
                      min="75"
                      max="98"
                      value={autoDispatchConfidence}
                      onChange={(e) => setAutoDispatchConfidence(Number(e.target.value))}
                      className="w-full accent-blue-700 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">Confidence required for AI to generate pre-filled work orders.</p>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-800 mb-1">
                      <span>Camera CV Sensitivity:</span>
                      <span className="font-mono text-blue-700">{cameraCvSensitivity}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={cameraCvSensitivity}
                      onChange={(e) => setCameraCvSensitivity(Number(e.target.value))}
                      className="w-full accent-blue-700 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">Sensitivity for CCTV waterlogging, debris, and lighting defect detection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MUNICIPAL DEPARTMENTS */}
      {adminTab === 'departments' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Municipal Department Governance & SLAs
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned response targets and active field workforce per civic domain.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Department Name</th>
                    <th className="p-3">Officer in Charge</th>
                    <th className="p-3">Staff</th>
                    <th className="p-3">Active Tickets</th>
                    <th className="p-3">SLA Target</th>
                    <th className="p-3">Avg Resolution</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {departments.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{d.name}</td>
                      <td className="p-3 text-slate-700">{d.head}</td>
                      <td className="p-3 font-mono">{d.staffCount}</td>
                      <td className="p-3 font-mono font-bold text-blue-700">{d.activeWorkOrders}</td>
                      <td className="p-3 font-mono text-slate-700">{d.slaTargetHours} hrs</td>
                      <td className="p-3 font-mono font-semibold text-emerald-700">{d.avgResolutionHours} hrs</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MCD MOBILE FLEET & VEHICLE-MOUNTED CAMERAS */}
      {adminTab === 'mcd_fleet' && (
        <McdVehicleFleet
          onOpenLiveCam={onOpenLiveCam}
          onDispatchPothole={onDispatchCluster}
        />
      )}

      {/* TAB 4: SENSORS & CCTV */}
      {adminTab === 'sensors' && (
        <div className="space-y-6">
          {/* LIVE PHONE CAMERA & IP STREAM SENTINEL BANNER */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white border border-blue-800/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-200 shadow-inner shrink-0">
                <Smartphone className="w-6 h-6 text-blue-300 live-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">
                    Phone IP Camera & Live AI Sentinel Streamer
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-400/30">
                    Live Stream Support
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-0.5">
                  Stream your mobile phone camera via local IP address (IP Webcam, DroidCam, WebRTC) with real-time Gemini ML vision.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenLiveCam && onOpenLiveCam('ip_stream')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm shrink-0 self-start sm:self-auto"
            >
              <Radio className="w-4 h-4 text-blue-200" />
              <span>Launch Live Camera Hub</span>
            </button>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
                  IoT Sensor & Municipal CCTV Nodes
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Computer vision cameras feeding real-time detections into CivicEye knowledge graph.
                </p>
              </div>
              <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                {cameras.length} Active Feeds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cameras.map((cam) => (
                <div key={cam.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-pulse"></span>
                        <h3 className="text-sm font-bold text-slate-900">{cam.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">📍 {cam.location}</p>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                      {cam.streamQuality}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-blue-900 flex items-center justify-between">
                      <span>CV Detection: {cam.aiDetection.type}</span>
                      <span className="font-mono text-emerald-700">{cam.aiDetection.confidence}% Conf.</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{cam.aiDetection.details}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Node ID: <strong className="font-mono text-slate-700">{cam.id}</strong></span>
                    <span>Last Ping: <strong className="text-emerald-700">{cam.lastPing}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {adminTab === 'logs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
                  System Audit Logs & Provenance Stream
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Immutable record of AI syntheses, work orders, and citizen actions.
                </p>
              </div>

              <button
                onClick={exportAuditLogs}
                className="px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-700" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {log.id}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{log.action}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[11px] font-normal text-slate-600">by {log.actor}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{log.details}</p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono self-end sm:self-auto shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
