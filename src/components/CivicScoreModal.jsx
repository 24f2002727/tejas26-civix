import React from 'react';
import { 
  X, 
  Award, 
  Shield, 
  CheckCircle2, 
  Star, 
  Zap, 
  Users, 
  Sparkles,
  History,
  Camera,
  MapPin,
  HelpCircle,
  FileCheck,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export function CivicScoreModal({ isOpen, onClose, userProfile }) {
  if (!isOpen) return null;

  const currentScore = userProfile.score || 485;
  const nextLevel = userProfile.nextLevelScore || 600;
  const progressPercent = Math.min(100, Math.round((currentScore / nextLevel) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-blue-800 flex items-center justify-between bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-inner">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-['Outfit']">CivicScore™ & Citizen Trust Rank</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-700/60 text-blue-200 border border-blue-400/40">
                  Citizen Role
                </span>
              </div>
              <p className="text-xs text-blue-200">Rewarding verified reporting, photo/video proofs, and crowd validation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* User Score & Rank Hero Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border border-blue-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-sm">
                  {userProfile.avatar || "PS"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-950 text-base">{userProfile.name}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                      {userProfile.badge || "Swachhata Ambassador"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 font-medium flex items-center gap-1.5">
                    <span>{userProfile.rank || "Community Sentinel (Top 5%)"}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">Accuracy: {userProfile.stats?.gpsAccuracyScore || 98}%</span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold block">Current CivicScore</span>
                <div className="text-3xl font-black text-blue-900 font-mono tracking-tight">
                  {currentScore} <span className="text-xs text-slate-500 font-sans font-semibold">pts</span>
                </div>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Level {userProfile.level || 4} Progress</span>
                <span className="font-mono font-bold text-blue-800">{currentScore} / {nextLevel} pts</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* How Points Are Earned Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-700" />
              <span>CivicScore Earning Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" /> Geotagged Issue Report
                  </span>
                  <span className="font-bold text-blue-800 font-mono text-xs">+25 Pts</span>
                </div>
                <p className="text-[11px] text-slate-600">Earned when submitting a verified report with GPS coordinates.</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-blue-700" /> Photo / Video Upload
                  </span>
                  <span className="font-bold text-blue-800 font-mono text-xs">+15 Pts</span>
                </div>
                <p className="text-[11px] text-slate-600">Bonus points for attaching clear video or photo evidence.</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Geofenced Doubt Confirmation
                  </span>
                  <span className="font-bold text-emerald-800 font-mono text-xs">+15 to +25 Pts</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Verify doubting camera flags with GPS. Earn <strong className="text-emerald-900">+25 Pts</strong> for on-ground local confirmations (&lt;2.5 km) with live geotag proof.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-orange-700" /> Swachhata Pratigya
                  </span>
                  <span className="font-bold text-orange-800 font-mono text-xs">+50 Pts</span>
                </div>
                <p className="text-[11px] text-slate-600">One-time national cleanliness pledge commitment reward.</p>
              </div>
            </div>
          </div>

          {/* Activity Ledger */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              <span>Recent CivicScore Ledger</span>
            </h3>

            <div className="space-y-2">
              {(userProfile.ledger || []).map((item) => (
                <div 
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-white transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-xs">{item.action}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className="text-blue-700 font-semibold">{item.badge}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold font-mono text-xs">
                    +{item.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Future Scope: Role-Based Access Control (RBAC) Enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Close & Continue Contributing
          </button>
        </div>
      </div>
    </div>
  );
}

export default CivicScoreModal;
