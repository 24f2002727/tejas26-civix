import React from 'react';
import { 
  Shield, 
  Eye, 
  Users, 
  Award, 
  ShieldAlert,
  Home,
  Sparkles
} from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  civicScore, 
  onOpenScoreModal
}) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Tricolor Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-slate-200 to-emerald-600"></div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Motto */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0" 
            onClick={() => setActiveTab('landing')}
            title="Go to CivicEye Home"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center shadow-xs text-white hover:bg-blue-800 transition-colors">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                  Civic<span className="text-blue-700">Eye</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">AI sees • Citizens report • AI connects the dots</p>
            </div>
          </div>

          {/* Right Action Bar: Live AI Camera Launcher + Navigation Tabs */}
          <div className="flex items-center gap-2.5">

            {/* 4 Main Role-Based Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {/* 0. Home Page */}
              <button
                onClick={() => setActiveTab('landing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'landing'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              {/* 1. Common People / Citizen */}
              <button
                onClick={() => setActiveTab('citizen')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'citizen'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Citizen Portal</span>
                <span className="md:hidden">Citizen</span>
              </button>

              {/* 2. Authority Dashboard */}
              <button
                onClick={() => setActiveTab('authority')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'authority'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Authority Command</span>
                <span className="md:hidden">Authority</span>
              </button>

              {/* 3. Super Admin Dashboard */}
              <button
                onClick={() => setActiveTab('super_admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'super_admin'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Super Admin</span>
                <span className="md:hidden">Admin</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

