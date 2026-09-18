import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Trash2,
  Cpu,
  Database,
  Cloud,
  Check,
  RefreshCw,
  Zap,
  Layers
} from 'lucide-react';
import { 
  getApiKey, 
  setApiKey, 
  getGroqApiKey,
  setGroqApiKey,
  getOpenAiApiKey,
  setOpenAiApiKey,
  getSelectedModel, 
  setSelectedModel, 
  testGeminiApiKey,
  testGroqApiKey,
  testOpenAiApiKey,
  SUPPORTED_MODELS
} from '../services/aiService';
import {
  getSupabaseConfig,
  setSupabaseConfig,
  isSupabaseConfigured,
  testSupabaseConnection
} from '../services/supabaseClient';

export function ApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [activeTab, setActiveTab] = useState('groq'); // 'groq' | 'gemini' | 'openai' | 'supabase'

  // Groq State
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [isTestingGroq, setIsTestingGroq] = useState(false);
  const [groqTestResult, setGroqTestResult] = useState(null);

  // Gemini State
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [modelInput, setModelInput] = useState('gemini-1.5-flash');
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState(null);

  // OpenAI / OpenRouter State
  const [openAiKeyInput, setOpenAiKeyInput] = useState('');
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);
  const [isTestingOpenAi, setIsTestingOpenAi] = useState(false);
  const [openAiTestResult, setOpenAiTestResult] = useState(null);

  // Supabase State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Load AI configs
      setGroqKeyInput(getGroqApiKey());
      setKeyInput(getApiKey());
      setOpenAiKeyInput(getOpenAiApiKey());
      setModelInput(getSelectedModel());
      setGeminiTestResult(null);
      setGroqTestResult(null);
      setOpenAiTestResult(null);

      // Load Supabase config
      const supa = getSupabaseConfig();
      setSupabaseUrl(supa.url);
      setSupabaseKey(supa.anonKey);
      setSupabaseTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Save AI keys
    setGroqApiKey(groqKeyInput);
    setApiKey(keyInput);
    setOpenAiApiKey(openAiKeyInput);
    setSelectedModel(modelInput);

    // Save Supabase
    setSupabaseConfig(supabaseUrl, supabaseKey);

    if (onKeyUpdated) onKeyUpdated({ 
      groqKey: groqKeyInput,
      geminiKey: keyInput, 
      openAiKey: openAiKeyInput,
      supabaseUrl, 
      supabaseKey 
    });
    onClose();
  };

  const handleClearGroq = () => {
    setGroqKeyInput('');
    setGroqApiKey('');
    setGroqTestResult(null);
  };

  const handleClearGemini = () => {
    setKeyInput('');
    setApiKey('');
    setGeminiTestResult(null);
  };

  const handleClearOpenAi = () => {
    setOpenAiKeyInput('');
    setOpenAiApiKey('');
    setOpenAiTestResult(null);
  };

  const handleClearSupabase = () => {
    setSupabaseUrl('');
    setSupabaseKey('');
    setSupabaseConfig('', '');
    setSupabaseTestResult(null);
  };

  const handleTestGroq = async () => {
    if (!groqKeyInput.trim()) {
      setGroqTestResult({ success: false, message: 'Please paste your Groq API key first.' });
      return;
    }
    setIsTestingGroq(true);
    setGroqTestResult(null);

    const res = await testGroqApiKey(groqKeyInput.trim());
    setIsTestingGroq(false);
    setGroqTestResult(res);
  };

  const handleTestGemini = async () => {
    if (!keyInput.trim()) {
      setGeminiTestResult({ success: false, message: 'Please paste your Gemini API key first.' });
      return;
    }
    setIsTestingGemini(true);
    setGeminiTestResult(null);

    setSelectedModel(modelInput);
    const res = await testGeminiApiKey(keyInput.trim(), modelInput);
    setIsTestingGemini(false);
    setGeminiTestResult(res);
    setModelInput(getSelectedModel());
  };

  const handleTestOpenAi = async () => {
    if (!openAiKeyInput.trim()) {
      setOpenAiTestResult({ success: false, message: 'Please paste your OpenAI / OpenRouter API key first.' });
      return;
    }
    setIsTestingOpenAi(true);
    setOpenAiTestResult(null);

    const res = await testOpenAiApiKey(openAiKeyInput.trim());
    setIsTestingOpenAi(false);
    setOpenAiTestResult(res);
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setSupabaseTestResult({ success: false, message: 'Please provide both Supabase URL and Anon Key.' });
      return;
    }
    setIsTestingSupabase(true);
    setSupabaseTestResult(null);

    const res = await testSupabaseConnection(supabaseUrl.trim(), supabaseKey.trim());
    setIsTestingSupabase(false);
    setSupabaseTestResult(res);
  };

  const isSupabaseActive = isSupabaseConfigured() || (supabaseUrl && supabaseKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#1E40AF] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-inner">
              <Cloud className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Outfit'] flex items-center gap-2">
                <span>Cloud & AI Vision Engine Settings</span>
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">Configure Groq Llama 3.2 Vision, Gemini, OpenAI & Supabase</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-5 pt-2 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('groq')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'groq'
                ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Groq Llama Vision</span>
            {groqKeyInput && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gemini')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'gemini'
                ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Gemini</span>
            {keyInput && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('openai')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'openai'
                ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>OpenAI / Router</span>
            {openAiKeyInput && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'supabase'
                ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Supabase DB</span>
            {isSupabaseActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* TAB 1: GROQ LLAMA 3.2 VISION CONFIGURATION */}
          {activeTab === 'groq' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Info Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-slate-700 leading-relaxed space-y-1">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Groq LPU Vision Engine (Free • Instant 40ms Inference)</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Groq runs Meta Llama 3.2 Vision (11B & 90B) on ultra-fast LPU chips. Ideal for real-time live camera object tracking and civic defect detection with zero latency.
                </p>
              </div>

              {/* Groq Key Input Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Groq API Key:
                  </label>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1"
                  >
                    <span>Get Free Key from Groq Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showGroqKey ? 'text' : 'password'}
                    value={groqKeyInput}
                    onChange={(e) => setGroqKeyInput(e.target.value)}
                    placeholder="gsk_..."
                    className="gov-input !pr-20 font-mono text-xs"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowGroqKey(!showGroqKey)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                      title={showGroqKey ? 'Hide key' : 'Show key'}
                    >
                      {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {groqKeyInput && (
                      <button
                        type="button"
                        onClick={handleClearGroq}
                        className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                        title="Remove Groq key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Test Groq Connection Button & Result */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestGroq}
                  disabled={isTestingGroq || !groqKeyInput.trim()}
                  className="w-full py-2 px-3 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTestingGroq ? (
                    <>
                      <Zap className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      <span>Testing Groq Vision Connection...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Test Groq Llama 3.2 Vision</span>
                    </>
                  )}
                </button>

                {groqTestResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                      groqTestResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}
                  >
                    {groqTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{groqTestResult.success ? 'Groq Vision Ready!' : 'Groq Connection Error'}</div>
                      <div className="text-[11px] mt-0.5">{groqTestResult.message}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: OPENAI / OPENROUTER VISION CONFIGURATION */}
          {activeTab === 'openai' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Info Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-slate-700 leading-relaxed space-y-1">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>OpenAI & OpenRouter Multimodal Vision</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Connect your OpenAI GPT-4o-mini or OpenRouter vision API key to analyze camera feeds and extract structured civic defects.
                </p>
              </div>

              {/* OpenAI Key Input Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    OpenAI / OpenRouter API Key:
                  </label>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
                  >
                    <span>Get Key from OpenAI</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showOpenAiKey ? 'text' : 'password'}
                    value={openAiKeyInput}
                    onChange={(e) => setOpenAiKeyInput(e.target.value)}
                    placeholder="sk-..."
                    className="gov-input !pr-20 font-mono text-xs"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                      title={showOpenAiKey ? 'Hide key' : 'Show key'}
                    >
                      {showOpenAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {openAiKeyInput && (
                      <button
                        type="button"
                        onClick={handleClearOpenAi}
                        className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                        title="Remove key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Test OpenAI Connection Button & Result */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestOpenAi}
                  disabled={isTestingOpenAi || !openAiKeyInput.trim()}
                  className="w-full py-2 px-3 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTestingOpenAi ? (
                    <>
                      <Cpu className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Testing Vision API Connection...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Test OpenAI / OpenRouter Connection</span>
                    </>
                  )}
                </button>

                {openAiTestResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                      openAiTestResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}
                  >
                    {openAiTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{openAiTestResult.success ? 'Vision API Connected!' : 'Connection Error'}</div>
                      <div className="text-[11px] mt-0.5">{openAiTestResult.message}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SUPABASE CONFIGURATION */}
          {activeTab === 'supabase' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Info Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-slate-700 leading-relaxed space-y-1">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Supabase PostgreSQL + Realtime Cloud Storage</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Connect your Supabase project to persist citizen reports, problem clusters, and audit logs to PostgreSQL with instant WebSocket synchronization across all devices.
                </p>
              </div>

              {/* Supabase URL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Project URL:
                  </label>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                  >
                    <span>Supabase Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="gov-input font-mono text-xs"
                />
              </div>

              {/* Supabase Anon Key */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Anon / Public Key:
                </label>
                <div className="relative">
                  <input
                    type={showSupabaseKey ? 'text' : 'password'}
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    className="gov-input !pr-20 font-mono text-xs"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                      title={showSupabaseKey ? 'Hide key' : 'Show key'}
                    >
                      {showSupabaseKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {supabaseKey && (
                      <button
                        type="button"
                        onClick={handleClearSupabase}
                        className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                        title="Remove Supabase keys"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* SQL Migration Hint */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>⚡ Quick Setup Tip:</span>
                </div>
                <p>
                  Run the generated <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-300 font-semibold text-blue-800">supabase/schema.sql</code> in your <strong>Supabase SQL Editor</strong> to create all 8 database tables, storage bucket, and seed datasets in 1 click!
                </p>
              </div>

              {/* Test Supabase Connection */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestSupabase}
                  disabled={isTestingSupabase || !supabaseUrl.trim() || !supabaseKey.trim()}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTestingSupabase ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Verifying Supabase Connection...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Test Supabase Connection</span>
                    </>
                  )}
                </button>

                {supabaseTestResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                      supabaseTestResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}
                  >
                    {supabaseTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{supabaseTestResult.success ? 'Supabase Connected!' : 'Connection Error'}</div>
                      <div className="text-[11px] mt-0.5">{supabaseTestResult.message}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GEMINI AI CONFIGURATION */}
          {activeTab === 'gemini' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Info Banner */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-slate-700 leading-relaxed space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Real-Time Generative Multimodal Vision</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  When an API key is provided, CivicEye uses Gemini to analyze camera frames for potholes & garbage, categorize citizen complaints in real-time, and synthesize municipal root causes.
                </p>
              </div>

              {/* Key Input Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Google Gemini API Key:
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                  >
                    <span>Get key from Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="gov-input !pr-20 font-mono text-xs"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                      title={showKey ? 'Hide key' : 'Show key'}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {keyInput && (
                      <button
                        type="button"
                        onClick={handleClearGemini}
                        className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                        title="Remove key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Model Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-700" />
                  <span>Gemini Model:</span>
                </label>
                <select
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="gov-input text-xs font-medium"
                >
                  {SUPPORTED_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Connection Button & Result */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestGemini}
                  disabled={isTestingGemini || !keyInput.trim()}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTestingGemini ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-700" />
                      <span>Connecting to Gemini API...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                      <span>Test Connection with Google AI</span>
                    </>
                  )}
                </button>

                {geminiTestResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                      geminiTestResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}
                  >
                    {geminiTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{geminiTestResult.success ? 'Success!' : 'Connection Failed'}</div>
                      <div className="text-[11px] mt-0.5">{geminiTestResult.message}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary py-2 px-5 text-xs font-bold"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
