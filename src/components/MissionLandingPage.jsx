import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CIVIC_CAPABILITIES, 
  HOW_IT_WORKS, 
  GOV_SCHEMES_LIST, 
  GOV_POSTERS, 
  SWACHHATA_PLEDGE 
} from '../data/missionData';
import {
  Sparkles,
  Eye,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Award,
  Building2,
  Trash2,
  Droplets,
  Lightbulb,
  Construction,
  AlertTriangle,
  Pipette,
  Camera,
  Cpu,
  CheckCircle,
  Share2,
  X,
  BadgeCheck,
  Check,
  Flag,
  FileText,
  PhoneCall,
  Clock,
  Layers,
  ChevronRight,
  Flame,
  Quote
} from 'lucide-react';

export function MissionLandingPage({ 
  onNavigateTab, 
  userProfile, 
  onTakePledge 
}) {
  const [selectedPosterCategory, setSelectedPosterCategory] = useState('all');
  const [activePosterModal, setActivePosterModal] = useState(null);
  const [hasTakenPledge, setHasTakenPledge] = useState(false);
  const [copiedPosterId, setCopiedPosterId] = useState(null);

  // Trigger Swachhata Pledge Celebration
  const handlePledgeSubmit = () => {
    if (hasTakenPledge) return;
    setHasTakenPledge(true);
    
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    if (onTakePledge) {
      onTakePledge(SWACHHATA_PLEDGE.rewardPoints);
    }
  };

  const handleSharePoster = (poster) => {
    setCopiedPosterId(poster.id);
    navigator.clipboard?.writeText(
      `🏛️ ${poster.hindiTitle}\n"${poster.hindiSlogan}"\nIssued by: ${poster.authority}\nCivicEye Smart Civic Platform`
    );
    setTimeout(() => setCopiedPosterId(null), 2500);
  };

  const filteredPosters = selectedPosterCategory === 'all' 
    ? GOV_POSTERS 
    : GOV_POSTERS.filter(p => p.category === selectedPosterCategory);

  const getIssueTheme = (id) => {
    switch (id) {
      case 'garbage':
        return {
          icon: <Trash2 className="w-5 h-5 text-emerald-600" />,
          bgGradient: 'from-emerald-400 to-emerald-600',
          bgImage: 'url("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600")'
        };
      case 'waterlogging':
        return {
          icon: <Droplets className="w-5 h-5 text-blue-500" />,
          bgGradient: 'from-blue-400 to-blue-600',
          bgImage: 'url("https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=600")'
        };
      case 'streetlights':
        return {
          icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
          bgGradient: 'from-amber-400 to-amber-600',
          bgImage: 'url("https://images.unsplash.com/photo-1513689437107-1606bd9e0136?auto=format&fit=crop&q=80&w=600")'
        };
      case 'potholes':
        return {
          icon: <Construction className="w-5 h-5 text-indigo-500" />,
          bgGradient: 'from-indigo-400 to-indigo-600',
          bgImage: 'url("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600")'
        };
      case 'manholes':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
          bgGradient: 'from-rose-400 to-rose-600',
          bgImage: 'url("https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&q=80&w=600")'
        };
      case 'water_leak':
        return {
          icon: <Pipette className="w-5 h-5 text-teal-500" />,
          bgGradient: 'from-teal-400 to-teal-600',
          bgImage: 'url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600")'
        };
      default:
        return {
          icon: <Building2 className="w-5 h-5 text-slate-500" />,
          bgGradient: 'from-slate-400 to-slate-600',
          bgImage: ''
        };
    }
  };

  const getStepIcon = (iconName) => {
    switch (iconName) {
      case 'Camera': return <Camera className="w-5 h-5 text-blue-700" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-700" />;
      case 'CheckCircle': return <CheckCircle className="w-5 h-5 text-emerald-700" />;
      default: return <Sparkles className="w-5 h-5 text-blue-700" />;
    }
  };

  return (
    <div className="w-full pb-16 space-y-10">
      {/* 1. Official Government Header & Helplines (Matching Blue Theme) */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white border border-blue-700/60 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-blue-700/50 pb-4">
          <div className="flex items-center gap-3.5">
            {/* Government Seal Icon Box */}
            <div className="w-12 h-12 rounded-xl bg-white text-blue-900 flex items-center justify-center p-2.5 shadow-sm shrink-0">
              <Building2 className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Outfit']">
                  Civic<span className="text-blue-300">Eye</span> Municipal Portal
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-700/60 text-blue-100 border border-blue-400/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Govt. Verified Platform
                </span>
              </div>
              <p className="text-xs text-blue-200/90 mt-0.5">
                In Alignment with Swachh Bharat Mission 2.0 (MoHUA) & Government of Bihar (UDHD)
              </p>
            </div>
          </div>

          {/* 24x7 Helplines Strip */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white flex items-center gap-1.5 transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-blue-300" />
              <span>PMC Helpline: <strong className="font-mono text-white font-bold">155304 / 1916</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-300/40 text-orange-200 flex items-center gap-1.5">
              <span>Swachhata: <strong className="font-mono text-white font-bold">14420</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-300/40 text-rose-200 flex items-center gap-1.5">
              <span>Emergency: <strong className="font-mono text-white font-bold">112</strong></span>
            </div>
          </div>
        </div>

        {/* Alignment Sub-tags */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">Mission:</span>
            <span>Zero Unattended Civic Grievances • Clean Streets • Lit Roads • Resilient Drains</span>
          </div>
          <div className="flex items-center gap-3 font-medium text-[11px]">
            <span className="text-orange-200 font-bold bg-orange-500/20 px-2 py-0.5 rounded border border-orange-300/30">#SwachhBharat</span>
            <span className="text-emerald-200 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-300/30">#JalJeevanHariyali</span>
            <span className="text-blue-200 font-bold bg-blue-600/40 px-2 py-0.5 rounded border border-blue-400/30">#SaatNischay2</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Action Box (Bold, Themed & Harmonized with All Components) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-2 border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-8">
        {/* Subtle Ambient Color Highlights */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 center w-96 h-48 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-5">
          {/* Top Bold Scheme Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black border border-blue-200 shadow-2xs">
              <Flag className="w-3.5 h-3.5 text-blue-700" />
              <span>NATIONAL CIVIC AI PLATFORM</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-950 text-xs font-extrabold border border-orange-200">
              🇮🇳 Swachh Bharat 2.0
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-extrabold border border-emerald-200">
              🌿 Jal-Jeevan-Hariyali
            </span>
          </div>
          
          {/* Bold Punchy Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 font-['Outfit'] tracking-tight leading-[1.12]">
            Smarter Cities. Rapid Redressal.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-600 block sm:inline">
              Zero Civic Blindspots.
            </span>
          </h1>
          
          {/* Bold Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
            AI-powered civic solutions. Faster fixes. Guaranteed SLAs.
          </p>

          {/* Quick Issue Jump Chips (Harmonized with Theme Colors) */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              ⚡ Quick Report by Category:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigateTab('citizen')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Street Lights</span>
              </button>
              <button
                onClick={() => onNavigateTab('citizen')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Garbage Dumps</span>
              </button>
              <button
                onClick={() => onNavigateTab('citizen')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                <span>Waterlogging</span>
              </button>
              <button
                onClick={() => onNavigateTab('citizen')}
                className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-900 font-bold text-xs border border-orange-200 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Construction className="w-3.5 h-3.5 text-orange-600" />
                <span>Road Potholes</span>
              </button>
              <button
                onClick={() => onNavigateTab('citizen')}
                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-xs border border-rose-200 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Open Manholes</span>
              </button>
              <button
                onClick={() => onNavigateTab('citizen')}
                className="px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold text-xs border border-cyan-200 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Pipette className="w-3.5 h-3.5 text-cyan-600" />
                <span>Water Pipe Leaks</span>
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab('citizen')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Launch Citizen Portal & Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('authority')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm border-2 border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-blue-700" />
              <span>Authority Command Grid</span>
            </button>

            <a
              href="#gov-posters"
              className="px-4 py-3 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Govt Posters & Slogans</span>
            </a>
          </div>
        </div>


      </section>

      {/* 3. Core Civic Issues Resolved (Front & Center) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Report an Issue
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select an issue category to get started.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CIVIC_CAPABILITIES.map((item) => {
            const theme = getIssueTheme(item.id);
            return (
              <div 
                key={item.id}
                onClick={() => onNavigateTab('citizen')}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${theme.bgGradient} p-6 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 min-h-[160px]`}
              >
                {/* Background Image with Mask */}
                <div 
                  className="absolute inset-0 right-0 mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ 
                    backgroundImage: theme.bgImage,
                    backgroundSize: 'cover',
                    backgroundPosition: 'right center',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 100%)'
                  }}
                />
                
                {/* Icon */}
                <div className="relative z-10 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      {theme.icon}
                    </div>
                  </div>
                </div>
                
                {/* Title & Arrow */}
                <div className="relative z-10 flex items-end justify-between gap-4 mt-auto">
                  <div>
                    <div className="text-white/90 text-xs font-bold tracking-wide mb-1">Report</div>
                    <h3 className="text-white text-[15px] sm:text-base font-bold font-['Outfit'] leading-tight drop-shadow-sm max-w-[180px] sm:max-w-[200px]">
                      {item.title}
                    </h3>
                  </div>
                  <div className="opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all mb-1">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>







      {/* 7. Official Swachhata Pratigya (Cleanliness Pledge) */}
      <section className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-orange-100/50 rounded-[24px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(255,90,0,0.04)] transition-all hover:shadow-[0_8px_40px_rgb(255,90,0,0.08)]">
        {/* Subtle orange glow top right */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-400/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* HEADER */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border border-orange-200/50 shadow-sm">
              <span className="text-xl">🇮🇳</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Shield className="w-3 h-3 text-slate-400" />
                <span>Official Civic Initiative</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {SWACHHATA_PLEDGE.title}
                <span className="text-sm font-semibold text-slate-500">
                  {SWACHHATA_PLEDGE.hindiSubtitle}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                A citizen commitment towards a cleaner India
              </p>
            </div>
          </div>
          
          <div className="hidden sm:inline-flex shrink-0 items-center gap-1 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">+50 CivicScore</span>
          </div>
        </div>

        {/* PLEDGE CONTENT (Inner Glass Panel) */}
        <div className="relative z-10 mt-6 bg-[#FFFCF9] rounded-[16px] p-6 border border-orange-100/60 shadow-sm group-hover:shadow-md transition-shadow">
          <Quote className="absolute top-5 left-5 w-5 h-5 text-orange-200/70" />
          <div className="pl-7 space-y-4 max-w-3xl">
            <p className="text-[15px] sm:text-base font-medium text-slate-800 leading-relaxed">
              "{SWACHHATA_PLEDGE.hindiOath}"
            </p>
            <div className="h-px w-16 bg-orange-200/60"></div>
            <p className="text-xs sm:text-sm text-slate-500 italic leading-relaxed">
              "{SWACHHATA_PLEDGE.englishOath}"
            </p>
          </div>
        </div>

        {/* CTA AREA */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
              <Award className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Take the official digital pledge</p>
              <p className="text-xs font-medium text-slate-500">Earn 50 CivicScore points</p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            {!hasTakenPledge ? (
              <button
                onClick={handlePledgeSubmit}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF7A18] hover:from-[#FF6A18] hover:to-[#FF8A28] text-white font-bold text-sm shadow-[0_4px_14px_rgba(255,90,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,90,0,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer group/btn"
              >
                <span>Take the Cleanliness Pledge</span>
                <span className="bg-white/20 px-2 py-0.5 rounded font-mono text-[10px]">+50 Pts</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-200 flex items-center justify-center gap-2">
                <BadgeCheck className="w-5 h-5 text-emerald-600" />
                <span>Pledge Taken! (+50 CivicScore)</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Poster Details Modal */}
      {activePosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className={`${activePosterModal.topBannerBg} text-white p-5 flex items-start justify-between`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  {activePosterModal.categoryLabel}
                </span>
                <h3 className="text-xl font-bold font-['Outfit'] mt-1.5">
                  {activePosterModal.hindiTitle}
                </h3>
                <p className="text-xs text-white/90">{activePosterModal.title}</p>
              </div>

              <button
                onClick={() => setActivePosterModal(null)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-800">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">📢 Slogan:</span>
                <span>{activePosterModal.hindiSlogan} ({activePosterModal.slogan})</span>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">Official Guidelines:</span>
                <ul className="space-y-1.5">
                  {activePosterModal.guidelines.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                <strong>Citizen Commitment:</strong> "{activePosterModal.pledgeText}"
              </div>

              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
                Authority: {activePosterModal.authority}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => handleSharePoster(activePosterModal)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedPosterId === activePosterModal.id ? 'Copied!' : 'Share Slogan'}</span>
              </button>

              <button
                onClick={() => {
                  setActivePosterModal(null);
                  onNavigateTab('citizen');
                }}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Report Issue in Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MissionLandingPage;
