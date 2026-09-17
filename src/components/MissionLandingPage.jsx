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
  Flame
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
          icon: <Trash2 className="w-5 h-5 text-emerald-700" />,
          iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          topBar: 'bg-emerald-500',
          badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          btnHover: 'hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
        };
      case 'waterlogging':
        return {
          icon: <Droplets className="w-5 h-5 text-blue-700" />,
          iconBg: 'bg-blue-50 border-blue-200 text-blue-700',
          topBar: 'bg-blue-500',
          badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200',
          btnHover: 'hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300'
        };
      case 'streetlights':
        return {
          icon: <Lightbulb className="w-5 h-5 text-amber-600" />,
          iconBg: 'bg-amber-50 border-amber-200 text-amber-700',
          topBar: 'bg-amber-500',
          badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
          btnHover: 'hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300'
        };
      case 'potholes':
        return {
          icon: <Construction className="w-5 h-5 text-orange-700" />,
          iconBg: 'bg-orange-50 border-orange-200 text-orange-700',
          topBar: 'bg-orange-500',
          badgeStyle: 'bg-orange-50 text-orange-800 border-orange-200',
          btnHover: 'hover:bg-orange-50 hover:text-orange-800 hover:border-orange-300'
        };
      case 'manholes':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-700" />,
          iconBg: 'bg-rose-50 border-rose-200 text-rose-700',
          topBar: 'bg-rose-500',
          badgeStyle: 'bg-rose-50 text-rose-800 border-rose-200',
          btnHover: 'hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300'
        };
      case 'water_leak':
        return {
          icon: <Pipette className="w-5 h-5 text-cyan-700" />,
          iconBg: 'bg-cyan-50 border-cyan-200 text-cyan-700',
          topBar: 'bg-cyan-500',
          badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          btnHover: 'hover:bg-cyan-50 hover:text-cyan-800 hover:border-cyan-300'
        };
      default:
        return {
          icon: <Building2 className="w-5 h-5 text-slate-700" />,
          iconBg: 'bg-slate-50 border-slate-200 text-slate-700',
          topBar: 'bg-blue-600',
          badgeStyle: 'bg-slate-50 text-slate-800 border-slate-200',
          btnHover: 'hover:bg-slate-50 hover:text-slate-800'
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
              <span>NATIONAL & BIHAR CIVIC AI PLATFORM</span>
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
          <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-3xl">
            <strong className="text-slate-950 font-bold">CivicEye</strong> unites citizen vigilance with municipal AI camera grids to detect and resolve 
            <strong className="text-amber-800 font-bold"> Street Light Faults</strong>, 
            <strong className="text-emerald-800 font-bold"> Garbage Dumps</strong>, 
            <strong className="text-blue-800 font-bold"> Waterlogging</strong>, and 
            <strong className="text-orange-800 font-bold"> Road Potholes</strong> with guaranteed turnaround SLAs.
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

        {/* 4 Bold Guaranteed Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t-2 border-slate-200/80 text-xs">
          <div className="p-4 bg-white rounded-2xl border-2 border-blue-100 shadow-2xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Fast Turnaround</span>
              <strong className="text-slate-950 font-black text-sm sm:text-base font-mono">&lt; 2 to 24 Hr SLA</strong>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-2xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Verified Proof</span>
              <strong className="text-slate-950 font-black text-sm sm:text-base">100% 'After' Photos</strong>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-amber-100 shadow-2xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Citizen Rewards</span>
              <strong className="text-slate-950 font-black text-sm sm:text-base font-mono">CivicScore Ranks</strong>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-2xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Active Municipalities</span>
              <strong className="text-slate-950 font-black text-sm sm:text-base font-mono">56+ City Wards</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Civic Issues Resolved (Front & Center) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Application Capabilities</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              What Issues Can You Report & Resolve on CivicEye?
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            6 Core Municipal Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CIVIC_CAPABILITIES.map((item) => {
            const theme = getIssueTheme(item.id);
            return (
              <div 
                key={item.id}
                className="gov-card flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Colored Top Border Accent */}
                <div className={`h-1 w-full ${theme.topBar}`}></div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`p-2.5 rounded-xl border ${theme.iconBg} shadow-2xs`}>
                        {theme.icon}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${theme.badgeStyle}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{item.hindiTitle}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{item.impact}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>SLA: <strong className="text-slate-900 font-mono font-bold">{item.sla}</strong></span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[140px] font-medium">{item.dept}</span>
                    </div>

                    <button
                      onClick={() => onNavigateTab('citizen')}
                      className={`w-full py-2 px-3 rounded-lg bg-slate-50 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 ${theme.btnHover}`}
                    >
                      <span>Report this Issue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. How It Works (Simple 3-Step Process) */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Redressal Process</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
            How CivicEye Resolves Civic Problems in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((step) => (
            <div 
              key={step.step}
              className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 relative hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  {getStepIcon(step.icon)}
                </div>
                <span className="text-2xl font-black text-slate-300 font-mono">{step.step}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium">{step.hindiTitle}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. National & Bihar Government Alignment (Clean Light Cards) */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Government Partnerships</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
            Alignment with National & Bihar State Missions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOV_SCHEMES_LIST.map((scheme) => (
            <div 
              key={scheme.id}
              className="gov-card p-5 space-y-3.5 border-slate-200/90 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{scheme.name}</h3>
                    <p className="text-xs font-medium text-slate-500">{scheme.hindiName}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
                    {scheme.authority}
                  </span>
                </div>

                <div className="text-xs font-semibold text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border border-blue-100">
                  🎯 {scheme.slogan}
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700">
                  {scheme.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200/60">
                <strong className="text-slate-900">CivicEye Role:</strong> {scheme.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Government Posters & Awareness Campaigns */}
      <section id="gov-posters" className="space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Public Information</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Government Awareness Posters & Slogans
            </h2>
          </div>

          {/* Clean Light Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedPosterCategory('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedPosterCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedPosterCategory('swachh_bharat')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedPosterCategory === 'swachh_bharat'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Swachh Bharat
            </button>
            <button
              onClick={() => setSelectedPosterCategory('bihar_govt')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedPosterCategory === 'bihar_govt'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Govt of Bihar
            </button>
          </div>
        </div>

        {/* Posters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPosters.map((poster) => (
            <div 
              key={poster.id}
              className={`rounded-2xl border ${poster.themeColor} overflow-hidden shadow-2xs flex flex-col justify-between bg-white hover:border-slate-300 transition-all`}
            >
              {/* Top Banner */}
              <div className={`${poster.topBannerBg} text-white p-5 space-y-1.5`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold uppercase tracking-wider">{poster.categoryLabel}</span>
                  <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold">{poster.badge}</span>
                </div>
                <h3 className="text-xl font-bold font-['Outfit']">{poster.hindiTitle}</h3>
                <p className="text-xs text-white/90">{poster.title}</p>
                <div className="pt-2 text-xs font-semibold text-white/95">
                  📢 {poster.hindiSlogan}
                </div>
              </div>

              {/* Guidelines */}
              <div className="p-5 bg-white space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Action Guidelines</span>
                  <ul className="space-y-1.5">
                    {poster.guidelines.map((g, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActivePosterModal(poster)}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Poster Details</span>
                  </button>

                  <button
                    onClick={() => handleSharePoster(poster)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    title="Copy Slogan"
                  >
                    {copiedPosterId === poster.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Official Swachhata Pratigya (Cleanliness Pledge) */}
      <section className="bg-white border-2 border-orange-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-900 border border-orange-200 flex items-center justify-center font-bold text-base">
            🇮🇳
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit']">
              {SWACHHATA_PLEDGE.title}
            </h2>
            <p className="text-xs text-slate-500">{SWACHHATA_PLEDGE.hindiSubtitle}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-orange-50/40 border border-orange-200/70 text-xs sm:text-sm space-y-2 text-slate-800">
          <p className="font-medium leading-relaxed">
            "{SWACHHATA_PLEDGE.hindiOath}"
          </p>
          <p className="text-xs text-slate-600 italic border-t border-orange-200/60 pt-2">
            "{SWACHHATA_PLEDGE.englishOath}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-500">
            Take the official digital pledge to earn <strong className="text-slate-900 font-bold">+50 CivicScore Points</strong>.
          </span>

          {!hasTakenPledge ? (
            <button
              onClick={handlePledgeSubmit}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Take the Cleanliness Pledge (+50 Pts)</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-300">
              <BadgeCheck className="w-4 h-4 text-emerald-700" />
              <span>Pledge Taken! (+50 CivicScore Added)</span>
            </div>
          )}
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
