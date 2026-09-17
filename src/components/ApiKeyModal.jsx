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
  Cpu
} from 'lucide-react';
import { 
  getApiKey, 
  setApiKey, 
  getSelectedModel, 
  setSelectedModel, 
  testGeminiApiKey,
  SUPPORTED_MODELS
} from '../services/aiService';

export function ApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [modelInput, setModelInput] = useState('gemini-1.5-flash');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getApiKey());
      setModelInput(getSelectedModel());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(keyInput);
    setSelectedModel(modelInput);
    if (onKeyUpdated) onKeyUpdated(keyInput);
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    setApiKey('');
    setTestResult(null);
    if (onKeyUpdated) onKeyUpdated('');
  };

  const handleTest = async () => {
    if (!keyInput.trim()) {
      setTestResult({ success: false, message: 'Please paste your Gemini API key first.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    // Save model choice
    setSelectedModel(modelInput);
    const res = await testGeminiApiKey(keyInput.trim(), modelInput);
    setIsTesting(false);
    setTestResult(res);
    // If fallback switched model, sync state
    setModelInput(getSelectedModel());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#1E40AF] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-inner">
              <Key className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Outfit'] flex items-center gap-2">
                <span>Gemini AI Engine Configuration</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 uppercase">Official</span>
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">Connect Google Gemini for live civic intelligence & synthesis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Info Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-slate-700 leading-relaxed space-y-1">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Real-Time Generative Intelligence</span>
            </div>
            <p className="text-[11px] text-slate-600">
              When an API key is provided, CivicEye uses Gemini to categorize citizen reports in real-time, generate root-cause diagnoses, and synthesize multi-source camera & sensor signals.
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
                    onClick={handleClear}
                    className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                    title="Remove key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
              <div className="font-bold flex items-center gap-1">
                <span>💡 Free 1-Click Key:</span>
              </div>
              <p>
                In <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-semibold">Google AI Studio</a>, click <strong>"Create API Key in new project"</strong> to get an unrestricted Gemini API key (starts with <code className="font-mono bg-white px-1 py-0.2 rounded border border-amber-300">AIzaSy...</code>).
              </p>
            </div>
            <p className="text-[10px] text-slate-500">
              🔒 Key is stored locally in your browser session (<code className="font-mono text-[10px]">localStorage</code>).
            </p>
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
              {SUPPORTED_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Test Connection Button & Result */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || !keyInput.trim()}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? (
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

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{testResult.success ? 'Success!' : 'Connection Failed'}</div>
                  <div className="text-[11px] mt-0.5">{testResult.message}</div>
                </div>
              </div>
            )}
          </div>
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
