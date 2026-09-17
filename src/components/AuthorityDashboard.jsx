import React, { useState } from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Layers, 
  Sparkles, 
  BrainCircuit, 
  ArrowRight, 
  Filter,
  Building2,
  Clock,
  Check,
  Search
} from 'lucide-react';
import { MapView } from './MapView';

export function AuthorityDashboard({ 
  clusters, 
  cameras, 
  selectedCluster, 
  setSelectedCluster, 
  onDispatchCluster, 
  onResolveCluster 
}) {
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState(null);

  // Filter clusters
  const filteredClusters = clusters.filter((c) => {
    if (deptFilter !== 'ALL' && c.assignedDept !== deptFilter) return false;
    if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    return true;
  });

  const activeCluster = selectedCluster && filteredClusters.some(c => c.id === selectedCluster.id) 
    ? selectedCluster 
    : (filteredClusters[0] || clusters[0]);

  const handleDispatch = (cluster) => {
    onDispatchCluster(cluster.id);
    setDispatchSuccessMsg(`Work order officially dispatched to ${cluster.assignedDept} with AI Root-Cause Briefing.`);
    setTimeout(() => setDispatchSuccessMsg(null), 4000);
  };

  const handleResolve = (cluster) => {
    onResolveCluster(cluster.id);
  };

  const uniqueDepartments = Array.from(new Set(clusters.map(c => c.assignedDept)));

  return (
    <div className="space-y-6">
      {/* Top Government Strategy Banner - Matching Signature Bold Blue Theme */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#1E40AF] text-white shadow-md border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0 shadow-inner backdrop-blur-xs">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                Municipal Operations Command Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-white text-[10px] font-mono font-bold uppercase backdrop-blur-xs shadow-inner">
                Live Operations
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-1 font-medium">
              Aggregating <strong>198+ multi-source signals</strong> into <strong>{clusters.length} verified root-cause problem clusters</strong>
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
            <div className="text-[10px] text-blue-200 font-bold uppercase">Active Clusters</div>
            <div className="text-lg font-black text-white font-mono">{clusters.filter(c => c.status !== 'resolved').length}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
            <div className="text-[10px] text-blue-200 font-bold uppercase">Dispatched</div>
            <div className="text-lg font-black text-blue-200 font-mono">{clusters.filter(c => c.status === 'dispatched').length}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
            <div className="text-[10px] text-blue-200 font-bold uppercase">Avg Confidence</div>
            <div className="text-lg font-black text-emerald-300 font-mono">92.5%</div>
          </div>
        </div>
      </div>

      {dispatchSuccessMsg && (
        <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{dispatchSuccessMsg}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-700" />
            <span>Filter By:</span>
          </span>

          {/* Department Select */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="gov-input !py-1 !px-2.5 !w-auto text-xs font-medium"
          >
            <option value="ALL">All Departments ({clusters.length})</option>
            {uniqueDepartments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Severity Select */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="gov-input !py-1 !px-2.5 !w-auto text-xs font-medium"
          >
            <option value="ALL">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
          </select>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="gov-input !py-1 !px-2.5 !w-auto text-xs font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="investigating">Investigating</option>
            <option value="dispatched">Dispatched</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          Showing <strong>{filteredClusters.length}</strong> of {clusters.length} Problem Clusters
        </span>
      </div>

      {/* Main Grid: Left = Emerging Issue Hotspots List, Right = Map & Root Cause Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Emerging Issues List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 live-pulse"></span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
                Problem Clusters Queue
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Ranked by Urgency</span>
          </div>

          <div className="space-y-3">
            {filteredClusters.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                No clusters match the selected filters.
              </div>
            ) : (
              filteredClusters.map((clust) => {
                const isSelected = activeCluster?.id === clust.id;
                const isCritical = clust.severity === 'critical';

                return (
                  <div
                    key={clust.id}
                    onClick={() => setSelectedCluster(clust)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-600/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          isCritical ? 'badge-critical' : clust.severity === 'high' ? 'badge-warning' : 'badge-blue'
                        }`}>
                          {clust.severity}
                        </span>
                        <span className="text-xs text-slate-500 font-mono font-medium">{clust.category}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <span>{clust.confidence}% Conf.</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">{clust.title}</h3>

                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {clust.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-bold font-mono">{clust.reportCount} Reports</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-700 font-semibold">{clust.surgeVelocity}</span>
                      </div>

                      <div className="flex items-center gap-1 text-blue-700 font-semibold text-[11px]">
                        <span>Inspect Diagnosis</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Map & Deep-Dive AI Root Cause Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Map View */}
          <div className="h-[340px]">
            <MapView 
              clusters={clusters} 
              cameras={cameras} 
              selectedCluster={activeCluster} 
              onSelectCluster={setSelectedCluster} 
            />
          </div>

          {/* AI Root Cause & Multi-Signal Synthesis Drawer */}
          {activeCluster && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-blue-50 text-blue-700">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <span className="text-xs uppercase tracking-wider font-bold text-blue-700 font-['Outfit']">
                      AI Root Cause Synthesis ({activeCluster.id})
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">{activeCluster.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${
                    activeCluster.status === 'dispatched' ? 'badge-warning' : activeCluster.status === 'resolved' ? 'badge-success' : 'badge-blue'
                  }`}>
                    Status: {activeCluster.status}
                  </span>
                </div>
              </div>

              {/* Inferred Root Cause Callout */}
              <div className="p-4 rounded-lg bg-blue-50/80 border border-blue-200">
                <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                  <BrainCircuit className="w-3.5 h-3.5 text-blue-700" />
                  Inferred Root Cause (Confidence: {activeCluster.confidence}%)
                </div>
                <p className="text-xs text-slate-900 leading-relaxed font-medium">
                  "{activeCluster.aiRootCause}"
                </p>
              </div>

              {/* Signals Connected (Cameras + Citizens + Geo) */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Correlated Multi-Source Signals:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeCluster.signals.map((sig, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                      <span className="text-sm mt-0.5">
                        {sig.type === 'camera' ? '📷' : sig.type === 'citizen' ? '👥' : '📈'}
                      </span>
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{sig.source}</span>
                          <span className="text-[10px] text-blue-700 font-mono font-semibold">({sig.confidence}%)</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{sig.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic NLP Grouping Breakdown */}
              {activeCluster.nlpThemes && (
                <div>
                  <div className="text-xs font-bold text-slate-700 mb-2">
                    NLP Semantic Complaint Clusters ({activeCluster.reportCount} total):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCluster.nlpThemes.map((theme, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-800 flex items-center gap-1.5">
                        <span>"{theme.text}"</span>
                        <strong className="text-blue-700 font-mono">({theme.count})</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Action & 1-Click Dispatch */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-700">
                  <span className="text-slate-500 font-medium">Department Assigned: </span>
                  <strong className="text-slate-900">{activeCluster.assignedDept}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {activeCluster.status !== 'resolved' ? (
                    <>
                      <button
                        onClick={() => handleDispatch(activeCluster)}
                        disabled={activeCluster.status === 'dispatched'}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                          activeCluster.status === 'dispatched'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{activeCluster.status === 'dispatched' ? 'Work Order Dispatched' : '1-Click Dispatch Work Order'}</span>
                      </button>

                      <button
                        onClick={() => handleResolve(activeCluster)}
                        className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Resolve Issue</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Issue Resolved & Closed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
