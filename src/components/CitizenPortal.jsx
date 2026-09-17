import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, 
  MapPin, 
  Camera, 
  Award, 
  CheckCircle2, 
  ThumbsUp, 
  AlertCircle, 
  Sparkles, 
  Send, 
  Shield, 
  Clock, 
  ChevronRight, 
  Check, 
  Filter, 
  Layers, 
  Building2, 
  FileText, 
  LocateFixed, 
  ShieldCheck, 
  Navigation, 
  AlertTriangle,
  Loader2,
  Video,
  UploadCloud,
  X,
  Play,
  HelpCircle,
  TrendingUp,
  Flame,
  CheckCircle,
  Compass,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { analyzeCitizenReport } from '../services/aiService';
import { 
  getBestLocation, 
  getSavedVerifiedLocality, 
  saveVerifiedLocality, 
  calculateDistanceKm, 
  isWithinLocality,
  POPULAR_WARDS,
  QUICK_DISTRICTS
} from '../services/geoService';
import { SAMPLE_MEDIA } from '../data/civicData';

export function CitizenPortal({ 
  userProfile, 
  citizenReports, 
  verificationQueue, 
  onAddReport, 
  onVerifyTask, 
  onOpenScoreModal,
  onOpenLiveCam
}) {
  // Locality & GPS State
  const [verifiedLocality, setVerifiedLocality] = useState(() => {
    const saved = getSavedVerifiedLocality();
    if (saved && !saved.isFallback) return saved;
    return {
      city: 'Locating...',
      locality: 'Detecting Live Location...',
      address: 'Acquiring GPS / Network Signal...',
      lat: 25.6094,
      lng: 85.1376,
      radiusKm: 3.5,
      isVerifiedResident: false,
      source: 'Detecting Location...',
      accuracyLabel: 'Scanning GPS...',
      isGpsLive: false,
      verifiedAt: 'Just now'
    };
  });
  const [isVerifyingLocality, setIsVerifyingLocality] = useState(false);
  const [isWardModalOpen, setIsWardModalOpen] = useState(false);
  const [localityAlert, setLocalityAlert] = useState(null);
  const [proximityFilterKm, setProximityFilterKm] = useState(5.0); // 3km, 5km, 50km (all)
  const [wardSearchQuery, setWardSearchQuery] = useState('');
  const [isAddingCustomLoc, setIsAddingCustomLoc] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');
  const [customLocalityInput, setCustomLocalityInput] = useState('');

  // Form State
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(verifiedLocality.locality || 'Locating...');
  const [category, setCategory] = useState('Solid Waste Management');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAlert, setSubmittedAlert] = useState(null);

  // Photo & Video Media State
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'photo' | 'video'
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Live AI Category Analysis
  const [aiPreview, setAiPreview] = useState(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  // Right column feed tabs: 'community_feed', 'verifications', 'my_reports'
  const [activeFeedTab, setActiveFeedTab] = useState('community_feed');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Geofenced Doubt Confirmation Modal State
  const [geoModalTask, setGeoModalTask] = useState(null);
  const [geoModalObservation, setGeoModalObservation] = useState('confirmed'); // 'confirmed' | 'resolved'
  const [geoModalComment, setGeoModalComment] = useState('');

  // Helpers for Geofenced Trust Tier & Dynamic CivicScore Calculation
  const getDynamicGeoReward = (distKm, basePoints = 15) => {
    if (distKm <= 2.5) return Math.max(basePoints, 25);
    if (distKm <= 6.0) return Math.max(basePoints, 18);
    return Math.max(basePoints, 12);
  };

  const getGeoTrustTier = (distKm) => {
    if (distKm <= 2.5) {
      return {
        tier: 'Tier-1 On-Ground Resident',
        color: 'emerald',
        badge: '📍 High-Trust Local Geotag (100% Verified)',
        description: 'You are within immediate walking distance (< 2.5 km) of the reported site.'
      };
    }
    if (distKm <= 6.0) {
      return {
        tier: 'Tier-2 Ward Zone Vicinity',
        color: 'blue',
        badge: '📍 Ward Zone Verified',
        description: 'You are within the broader municipal ward perimeter (2.5 - 6.0 km).'
      };
    }
    return {
      tier: 'Tier-3 City Observer',
      color: 'amber',
      badge: '📍 Remote Observer Verified',
      description: 'You are outside the immediate ward perimeter (> 6.0 km).'
    };
  };

  // Auto-detect GPS locality on mount
  useEffect(() => {
    handleDetectLocation(false);
  }, []);

  // Sync location text when verifiedLocality changes
  useEffect(() => {
    if (verifiedLocality?.locality) {
      setLocation(verifiedLocality.locality);
    }
  }, [verifiedLocality]);

  // Handle GPS location detection with multi-tier fallback
  const handleDetectLocation = async (showAlert = true) => {
    setIsVerifyingLocality(true);
    if (showAlert) {
      setLocalityAlert({
        type: 'info',
        msg: '📡 Scanning satellite GPS & network signals for your live coordinates...'
      });
    }

    try {
      const loc = await getBestLocation();
      setVerifiedLocality(loc);
      setLocation(loc.locality || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
      
      if (showAlert) {
        if (loc.isGpsLive) {
          setLocalityAlert({
            type: 'success',
            msg: `📍 Live Device GPS Pinpointed: ${loc.locality} (${loc.accuracyLabel || 'Accurate'})`
          });
        } else {
          setLocalityAlert({
            type: 'info',
            msg: `🌐 Located via Network ISP Gateway: ${loc.locality}. (If your ISP placed you in the wrong city, 1-click switch your district in the Quick Selector below).`
          });
        }
        setTimeout(() => setLocalityAlert(null), 6500);
      }
    } catch (e) {
      if (showAlert) {
        setLocalityAlert({
          type: 'warning',
          msg: `⚠️ ${e.message || 'Browser GPS unavailable'}. You can 1-click select your district in the Quick Selector below.`
        });
        setTimeout(() => setLocalityAlert(null), 7000);
      }
    } finally {
      setIsVerifyingLocality(false);
    }
  };

  // Handle manual ward selection
  const handleSelectWard = (ward) => {
    const newLoc = {
      lat: ward.lat,
      lng: ward.lng,
      city: ward.city,
      locality: ward.locality,
      address: `${ward.locality}, ${ward.city}`,
      source: 'Selected Municipal Ward',
      accuracyLabel: 'Ward GPS Center',
      isGpsLive: false
    };
    saveVerifiedLocality(newLoc);
    setVerifiedLocality(newLoc);
    setLocation(ward.locality);
    setIsWardModalOpen(false);
    
    setLocalityAlert({
      type: 'success',
      msg: `📍 Location Switched: ${ward.shortName}`
    });
    setTimeout(() => setLocalityAlert(null), 3500);
  };

  // Handle custom city / locality entry
  const handleSaveCustomLocation = (e) => {
    e.preventDefault();
    const city = customCityInput.trim() || 'My City';
    const locName = customLocalityInput.trim() || city;
    if (!locName) return;

    const newLoc = {
      lat: 25.6094,
      lng: 85.1376,
      city: city,
      locality: locName !== city ? `${locName}, ${city}` : locName,
      address: `${locName}, ${city}`,
      source: 'Custom Citizen Locality',
      accuracyLabel: 'Citizen Verified Area',
      isGpsLive: false
    };
    saveVerifiedLocality(newLoc);
    setVerifiedLocality(newLoc);
    setLocation(newLoc.locality);
    setIsWardModalOpen(false);
    setIsAddingCustomLoc(false);
    setCustomCityInput('');
    setCustomLocalityInput('');
    
    setLocalityAlert({
      type: 'success',
      msg: `📍 Custom Location Set: ${newLoc.locality}`
    });
    setTimeout(() => setLocalityAlert(null), 4000);
  };

  // Handle media file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsMediaUploading(true);
    const isVid = file.type.startsWith('video/');
    setMediaType(isVid ? 'video' : 'photo');
    setMediaFile(file);

    const objectUrl = URL.createObjectURL(file);
    setMediaPreviewUrl(objectUrl);
    setIsMediaUploading(false);

    // Auto trigger AI vision preview
    triggerAiMediaAnalysis(file.name, isVid);
  };

  // Select Sample Civic Media
  const handleSelectSampleMedia = (sample) => {
    setMediaType(sample.type);
    setMediaPreviewUrl(sample.url);
    setMediaFile({ name: sample.title, isSample: true });
    if (!description) {
      setDescription(sample.suggestedTitle);
    }
    if (sample.category) {
      setCategory(sample.category);
    }
    triggerAiMediaAnalysis(sample.title, sample.type === 'video');
  };

  const handleClearMedia = () => {
    setMediaFile(null);
    setMediaType(null);
    setMediaPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerAiMediaAnalysis = (fileName, isVid) => {
    setIsAiAnalyzing(true);
    setTimeout(async () => {
      const res = await analyzeCitizenReport(description || fileName);
      setAiPreview({
        ...res,
        mediaVerified: true,
        mediaType: isVid ? 'Video (Motion Verified)' : 'Photo (Object Detected)'
      });
      setIsAiAnalyzing(false);
    }, 500);
  };

  // Debounced AI Preview Analysis for text
  useEffect(() => {
    if (!description.trim() || description.trim().length < 5) {
      if (!mediaFile) setAiPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAiAnalyzing(true);
      const res = await analyzeCitizenReport(description);
      setAiPreview((prev) => ({
        ...res,
        ...(prev?.mediaVerified ? { mediaVerified: true, mediaType: prev.mediaType } : {})
      }));
      if (res.category && res.category !== 'General Civic Issue') {
        setCategory(res.category);
      }
      setIsAiAnalyzing(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [description]);

  // Submit Issue Report
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    const baseScore = 25; // Geotagged report
    const mediaBonus = mediaFile ? 15 : 0; // Photo/Video bonus
    const totalScoreEarned = baseScore + mediaBonus;

    setTimeout(() => {
      onAddReport({
        title: description,
        category,
        location: location || verifiedLocality.locality,
        lat: verifiedLocality.lat,
        lng: verifiedLocality.lng,
        assignedDept: aiPreview?.suggestedDepartment || 'Municipal Administration',
        scoreEarned: totalScoreEarned,
        mediaType: mediaType,
        mediaUrl: mediaPreviewUrl
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}

      setSubmittedAlert({
        title: 'Civic Report Registered with GPS Geotag!',
        score: totalScoreEarned,
        mediaBonus: mediaBonus > 0
      });

      setDescription('');
      handleClearMedia();
      setAiPreview(null);
      setIsSubmitting(false);

      setTimeout(() => setSubmittedAlert(null), 5000);
    }, 600);
  };

  // Open detailed Geofenced Doubt Confirmation Dialog
  const handleOpenGeoModal = (task) => {
    setGeoModalTask(task);
    setGeoModalObservation('confirmed');
    setGeoModalComment('');
  };

  // Execute Geofenced Doubt Verification with Live Coordinates & Distance
  const handleExecuteGeoConfirmation = (task, isConfirmed, comment = '') => {
    const distKm = calculateDistanceKm(
      verifiedLocality.lat,
      verifiedLocality.lng,
      task.lat || 25.6094,
      task.lng || 85.1376
    );
    const isLocal = distKm <= 2.5;
    const trustInfo = getGeoTrustTier(distKm);
    const points = getDynamicGeoReward(distKm, task.rewardPoints || 15);

    const geoContext = {
      userLat: verifiedLocality.lat,
      userLng: verifiedLocality.lng,
      distanceKm: distKm,
      isLocal,
      locality: verifiedLocality.locality,
      trustTier: trustInfo.tier,
      badge: trustInfo.badge,
      comment: comment || (isConfirmed ? 'Citizen confirmed hazard active on-ground' : 'Citizen marked resolved / false alarm'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onVerifyTask(task.id, isConfirmed ? 'yes' : 'no', points, geoContext);
    setGeoModalTask(null);
    setGeoModalComment('');

    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    const locText = isLocal 
      ? `(📍 In-Ward Ground Match: ${distKm} km)` 
      : `(📍 Ward Zone: ${distKm} km)`;

    setLocalityAlert({
      type: 'success',
      msg: `🎉 Geofenced Doubt Confirmation Recorded ${locText}! +${points} CivicScore Points Credited`
    });
    setTimeout(() => setLocalityAlert(null), 5000);
  };

  // Quick Crowd Verification for Doubting Issues
  const handleCommunityVerify = (task, isConfirmed) => {
    handleExecuteGeoConfirmation(task, isConfirmed, '');
  };

  // Filter community reports by distance and category
  const filteredReports = citizenReports.filter((rep) => {
    // Distance filter
    const matchesDistance = proximityFilterKm >= 40 || isWithinLocality(
      verifiedLocality.lat,
      verifiedLocality.lng,
      rep.lat || 25.6094,
      rep.lng || 85.1376,
      proximityFilterKm
    );

    // Category filter
    const matchesCategory = selectedCategoryFilter === 'all' || rep.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());

    return matchesDistance && matchesCategory;
  });

  const pendingVerificationTasks = verificationQueue.filter(t => t.status === 'pending');

  return (
    <div className="w-full space-y-6">
      {/* 1. Citizen Header & CivicScore Status Card (Styled in Royal Blue Theme) */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border border-blue-700/60 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white text-blue-900 font-black flex items-center justify-center text-lg shadow-sm shrink-0 border border-white/20">
            {userProfile.avatar || 'PS'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-base font-['Outfit']">{userProfile.name}</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 font-bold border border-emerald-400/40">
                {userProfile.badge}
              </span>
            </div>
            <p className="text-xs text-blue-200 font-medium mt-0.5">
              Role: <strong className="text-white">Citizen Contributor</strong> • {userProfile.rank}
            </p>
          </div>
        </div>

        {/* CivicScore & Verification Queue Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          <button
            onClick={onOpenScoreModal}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-inner backdrop-blur-xs"
            title="Click to view full CivicScore Activity Ledger"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>CivicScore: <strong className="font-mono text-amber-300 text-sm">{userProfile.score} pts</strong></span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
          </button>

          <button
            onClick={() => setActiveFeedTab('verifications')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-inner backdrop-blur-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Verify Doubting ({pendingVerificationTasks.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time GPS Location & Ward Verification Bar */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${verifiedLocality.isGpsLive ? 'bg-emerald-500 animate-pulse' : 'bg-blue-600'}`}></span>
            <strong className="text-slate-900 font-bold">Active Location:</strong>
          </div>

          <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-700" />
            <span>{verifiedLocality.locality}</span>
          </span>

          <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {verifiedLocality.lat?.toFixed(4)}° N, {verifiedLocality.lng?.toFixed(4)}° E
          </span>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            verifiedLocality.isGpsLive 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            {verifiedLocality.source || 'Verified Locality'}
          </span>
        </div>

        {/* Location Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleDetectLocation(true)}
            disabled={isVerifyingLocality}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title="Auto-detect real location via satellite GPS & network"
          >
            {isVerifyingLocality ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5 text-blue-700" />
            )}
            <span>{isVerifyingLocality ? 'Locating...' : 'Locate Me'}</span>
          </button>

          <button
            onClick={() => {
              setWardSearchQuery('');
              setIsAddingCustomLoc(false);
              setIsWardModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <span>Change Location</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick District / City Switcher Bar */}
      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-700" />
            <span>Quick District Selector:</span>
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">(1-click switch your active reporting zone)</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {QUICK_DISTRICTS.map((dist) => {
            const isSelected = verifiedLocality.locality.includes(dist.name) || verifiedLocality.city === dist.name;
            return (
              <button
                key={dist.name}
                type="button"
                onClick={() => handleSelectWard({
                  id: dist.name.toLowerCase().replace(/\s+/g, '-'),
                  city: dist.name,
                  locality: dist.locality,
                  shortName: dist.name,
                  lat: dist.lat,
                  lng: dist.lng,
                  landmark: dist.locality,
                  zone: `${dist.name} Zone`
                })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-800 shadow-2xs'
                    : 'bg-white hover:bg-blue-100/80 text-slate-700 border-slate-300'
                }`}
              >
                {dist.name}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setWardSearchQuery('');
              setIsAddingCustomLoc(false);
              setIsWardModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer border border-slate-300"
          >
            All 38 Districts ▾
          </button>
        </div>
      </div>

      {/* Locality Alert / Notification */}
      {localityAlert && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
          localityAlert.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-amber-50 text-amber-900 border border-amber-200'
        }`}>
          <span>{localityAlert.msg}</span>
        </div>
      )}

      {/* 3. Main Split View: Report Submission Form (Left) vs Community & Verification Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Report Issue with Photo/Video Upload (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="gov-card p-5 sm:p-6 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-blue-700" />
                  <span>Report a Civic Issue</span>
                </h2>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +40 pts reward
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Upload photos or videos with geotagged GPS proof for guaranteed municipal SLA response.
              </p>
            </div>

            {/* Submitted Alert */}
            {submittedAlert && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1 animate-fadeIn">
                <div className="font-bold flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{submittedAlert.title}</span>
                </div>
                <p>
                  Assigned to Municipal Quick Response Team. <strong className="font-mono">+{submittedAlert.score} CivicScore Points</strong> credited to your ledger!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Issue Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Civic Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="gov-input text-xs font-semibold cursor-pointer"
                >
                  <option value="Solid Waste Management">🗑️ Solid Waste & Garbage Blackspots</option>
                  <option value="Drainage & Flooding">🌊 Waterlogging & Choked Drains</option>
                  <option value="Street Lighting & Electrical">💡 Street Light Outage & Dark Alleys</option>
                  <option value="Roads & Potholes">🕳️ Road Potholes & Broken Pavement</option>
                  <option value="Municipal Safety & Hazards">⚠️ Open Manholes & Missing Covers</option>
                  <option value="Public Health & Water Supply">🚰 Water Pipeline Leak / Contamination</option>
                </select>
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Describe the Problem</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Deep waterlogging near Metro underpass causing two-wheelers to stall..."
                  className="gov-input text-xs leading-relaxed"
                  required
                />
              </div>

              {/* Location (Geotagged & Locked to Verified Locality) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    <span>Geotagged Issue Location</span>
                  </label>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                    GPS Stamped
                  </span>
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ward location"
                  className="gov-input text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              {/* PHOTO & VIDEO UPLOAD ENGINE */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-700" />
                    <span>Attach Photo or Video Evidence</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenLiveCam && onOpenLiveCam('phone_device')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                      title="Point phone camera to auto-detect and attach live evidence"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 live-pulse"></span>
                      <span>Scan with Live AI Camera</span>
                    </button>

                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +15 Bonus Pts
                    </span>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                />

                {/* Media Preview Box or Upload Dropzone */}
                {!mediaPreviewUrl ? (
                  <div className="space-y-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50/70 hover:bg-blue-50/30 transition-all cursor-pointer space-y-1.5 group"
                    >
                      <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-blue-600 mx-auto transition-colors" />
                      <div className="text-xs font-bold text-slate-800">
                        Click to Upload Photo or Video
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Supports JPG, PNG, WebP, MP4, WebM (Max 50MB)
                      </p>
                    </div>

                    {/* Sample Civic Media Quick Selector */}
                    <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200/80 space-y-1.5 text-xs">
                      <span className="text-[11px] font-bold text-slate-600 block">
                        📸 Or Select a Sample Civic Media to Test:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {SAMPLE_MEDIA.slice(0, 4).map((sample) => (
                          <button
                            key={sample.id}
                            type="button"
                            onClick={() => handleSelectSampleMedia(sample)}
                            className="p-1.5 text-left rounded bg-white hover:bg-blue-50 border border-slate-200 text-[10px] font-semibold text-slate-700 truncate cursor-pointer transition-colors flex items-center gap-1"
                          >
                            {sample.type === 'video' ? '🎥' : '📷'} {sample.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Visual Media Preview Container */
                  <div className="relative rounded-xl overflow-hidden border-2 border-blue-300 bg-slate-900 p-1">
                    {mediaType === 'video' ? (
                      <video
                        src={mediaPreviewUrl}
                        controls
                        className="w-full h-44 rounded-lg object-cover bg-black"
                      />
                    ) : (
                      <img
                        src={mediaPreviewUrl}
                        alt="Issue Preview"
                        className="w-full h-44 rounded-lg object-cover"
                      />
                    )}

                    {/* Media Badge Overlay */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 text-white font-bold text-[10px] backdrop-blur-xs flex items-center gap-1">
                      {mediaType === 'video' ? <Video className="w-3 h-3 text-blue-400" /> : <Camera className="w-3 h-3 text-emerald-400" />}
                      <span>{mediaType === 'video' ? 'Video Evidence' : 'Photo Evidence'} (+15 Pts)</span>
                    </div>

                    {/* Remove Media Button */}
                    <button
                      type="button"
                      onClick={handleClearMedia}
                      className="absolute top-3 right-3 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Real-Time AI Computer Vision Preview */}
              {(isAiAnalyzing || aiPreview) && (
                <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                      <span>CivicEye AI Triage Engine:</span>
                    </span>
                    {isAiAnalyzing && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" />}
                  </div>

                  {aiPreview && (
                    <div className="space-y-1 text-slate-700">
                      <div>
                        Detected Category: <strong className="text-slate-900">{aiPreview.category}</strong>
                      </div>
                      <div>
                        Assigned Dept: <strong className="text-slate-900">{aiPreview.suggestedDepartment}</strong>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                          Severity: {aiPreview.severity || 'High'}
                        </span>
                        {aiPreview.mediaVerified && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Media Verified
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Geotagged Issue (+{mediaFile ? '40' : '25'} CivicScore)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Community Problems Feed & Doubting Verifications Hub (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Feed Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setActiveFeedTab('community_feed')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFeedTab === 'community_feed'
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Community Problems</span>
              </button>

              <button
                onClick={() => setActiveFeedTab('verifications')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFeedTab === 'verifications'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Confirm Doubting ({pendingVerificationTasks.length})</span>
              </button>

              <button
                onClick={() => setActiveFeedTab('my_reports')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFeedTab === 'my_reports'
                    ? 'bg-indigo-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My History</span>
              </button>
            </div>

            {/* Proximity Distance Radius Pill (for Community Feed) */}
            {activeFeedTab === 'community_feed' && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                <span>Radius:</span>
                <button
                  onClick={() => setProximityFilterKm(3.0)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${proximityFilterKm === 3.0 ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600'}`}
                >
                  &lt;3km
                </button>
                <button
                  onClick={() => setProximityFilterKm(5.0)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${proximityFilterKm === 5.0 ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600'}`}
                >
                  &lt;5km
                </button>
                <button
                  onClick={() => setProximityFilterKm(50.0)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${proximityFilterKm === 50.0 ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600'}`}
                >
                  All City
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: COMMUNITY PROBLEMS FEED */}
          {activeFeedTab === 'community_feed' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span>Showing issues around <strong className="text-slate-900">{verifiedLocality.locality}</strong></span>
                <span className="font-mono font-bold text-blue-800">{filteredReports.length} Active Issues</span>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {filteredReports.map((report) => (
                  <div 
                    key={report.id}
                    className="gov-card p-4 sm:p-5 space-y-3 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{report.title}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-600" /> {report.location}
                          </span>
                          <span>•</span>
                          <span>{report.timeAgo}</span>
                          <span>•</span>
                          <span className="text-blue-700 font-medium">{report.assignedDept}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                        {report.status}
                      </span>
                    </div>

                    {/* Media Preview Thumbnail if attached */}
                    {report.mediaUrl && (
                      <div className="rounded-lg overflow-hidden border border-slate-200 max-h-36 bg-slate-950">
                        {report.mediaType === 'video' ? (
                          <video src={report.mediaUrl} controls className="w-full h-36 object-cover" />
                        ) : (
                          <img src={report.mediaUrl} alt="Report Media" className="w-full h-36 object-cover" />
                        )}
                      </div>
                    )}

                    {/* Author & Upvote Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                          {report.avatar}
                        </div>
                        <span>Reported by <strong>{report.author}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors border border-slate-200">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{report.upvotes} Upvotes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CONFIRM DOUBTING ISSUES (CROWD VALIDATION WITH GEOLOCATION) */}
          {activeFeedTab === 'verifications' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold text-sm flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Geofenced Crowd Verification Hub (Confirm Doubting Issues)</span>
                </div>
                <p className="text-slate-700">
                  Municipal AI cameras and citizen reports flag uncertain issues. Verify problems near your GPS location (<strong>{verifiedLocality.locality}</strong>) to earn <strong className="text-emerald-900 font-bold">+15 to +25 CivicScore Points</strong>!
                </p>
              </div>

              {/* Distance Radius Filter for Doubting Issues */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-slate-500 font-medium">
                  Verified around: <strong className="text-slate-900">{verifiedLocality.locality}</strong>
                </span>

                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 p-1 rounded-lg">
                  <span className="text-slate-400 px-1">Radius:</span>
                  <button
                    onClick={() => setProximityFilterKm(3.0)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${proximityFilterKm === 3.0 ? 'bg-white text-emerald-800 shadow-2xs font-black' : 'text-slate-600'}`}
                  >
                    &lt; 3 km
                  </button>
                  <button
                    onClick={() => setProximityFilterKm(7.0)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${proximityFilterKm === 7.0 ? 'bg-white text-emerald-800 shadow-2xs font-black' : 'text-slate-600'}`}
                  >
                    &lt; 7 km
                  </button>
                  <button
                    onClick={() => setProximityFilterKm(50.0)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${proximityFilterKm === 50.0 ? 'bg-white text-emerald-800 shadow-2xs font-black' : 'text-slate-600'}`}
                  >
                    All City
                  </button>
                </div>
              </div>

              {/* Doubting Tasks List */}
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {verificationQueue
                  .filter((task) => {
                    const distKm = calculateDistanceKm(
                      verifiedLocality.lat,
                      verifiedLocality.lng,
                      task.lat || 25.6094,
                      task.lng || 85.1376
                    );
                    return proximityFilterKm >= 40 || distKm <= proximityFilterKm;
                  })
                  .map((task) => {
                    const isPending = task.status === 'pending';
                    const distKm = calculateDistanceKm(
                      verifiedLocality.lat,
                      verifiedLocality.lng,
                      task.lat || 25.6094,
                      task.lng || 85.1376
                    );
                    const isLocal = distKm <= 3.0;
                    const isZone = distKm <= 7.0;

                    return (
                      <div
                        key={task.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                          isPending 
                            ? 'gov-card border-slate-300' 
                            : 'bg-slate-50/70 border-slate-200 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                {task.detectedType}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">Source: {task.cameraSource}</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 leading-snug">
                              {task.prompt}
                            </h3>
                          </div>

                          <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                            +{task.rewardPoints} Pts
                          </span>
                        </div>

                        {/* Geolocation Distance & Proximity Badge */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2 text-slate-700">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                              <MapPin className="w-3.5 h-3.5 text-blue-700" />
                              <span>{task.location}</span>
                            </div>

                            {/* Geolocation Proximity Pill */}
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                              isLocal
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : isZone
                                ? 'bg-blue-100 text-blue-900 border-blue-300'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isLocal ? 'bg-emerald-600' : isZone ? 'bg-blue-600' : 'bg-amber-600'}`}></span>
                              {isLocal 
                                ? `📍 In Your Locality (${distKm} km)` 
                                : isZone 
                                ? `📍 In Your Ward Zone (${distKm} km)` 
                                : `⚠️ ${distKm} km away from you`}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600">
                            <strong>Doubt Reason:</strong> {task.doubtReason || 'Ground verification needed before dispatching field team.'}
                          </p>

                          {!isLocal && (
                            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60">
                              <span>Currently at this location?</span>
                              <button
                                type="button"
                                onClick={() => handleSelectWard({
                                  id: task.id,
                                  city: 'Patna',
                                  locality: task.localityName || task.location,
                                  shortName: task.localityName || task.location,
                                  lat: task.lat || 25.6094,
                                  lng: task.lng || 85.1376,
                                  landmark: task.location,
                                  zone: 'Patna Ward'
                                })}
                                className="text-blue-700 font-bold hover:underline cursor-pointer"
                              >
                                Set Location to {task.localityName || 'This Ward'}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Interactive Geofenced Confirmation Buttons */}
                        {isPending ? (
                          <div className="pt-1 space-y-2">
                            {/* Primary Button: Open Geolocation Verification Dialog */}
                            <button
                              type="button"
                              onClick={() => handleOpenGeoModal(task)}
                              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <LocateFixed className="w-4 h-4" />
                              <span>Verify with Live Geolocation (+{getDynamicGeoReward(distKm, task.rewardPoints)} Pts)</span>
                            </button>

                            {/* Secondary Quick Action Row */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  handleCommunityVerify(task, true);
                                }}
                                className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                                title="Quick 1-click confirm using active coordinates"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Quick Confirm ({distKm} km)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleCommunityVerify(task, false);
                                }}
                                className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-300"
                              >
                                <X className="w-3.5 h-3.5 text-slate-600" />
                                <span>False Alarm / Cleared</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="flex items-center gap-1.5 text-emerald-900">
                                <CheckCircle className="w-4 h-4 text-emerald-700" />
                                <span>GPS-Confirmed by You ({task.confirmedByGeo?.distanceKm ?? distKm} km away)</span>
                              </span>
                              <span className="font-mono text-emerald-800">
                                +{getDynamicGeoReward(distKm, task.rewardPoints)} Pts
                              </span>
                            </div>
                            <div className="text-[11px] text-emerald-800 flex items-center gap-2 flex-wrap">
                              <span className="font-semibold">{task.confirmedByGeo?.trustTier || 'High-Trust On-Ground'}</span>
                              <span>•</span>
                              <span>Verdict: {task.verifiedAnswer === 'yes' ? 'Hazard Confirmed' : 'Marked Cleared'}</span>
                              <span>•</span>
                              <span>{task.confirmedByGeo?.locality || verifiedLocality.locality}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 3: MY SUBMITTED REPORTS */}
          {activeFeedTab === 'my_reports' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Tracking all civic issues submitted by <strong>{userProfile.name}</strong>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {citizenReports.slice(0, 4).map((rep) => (
                  <div key={rep.id} className="gov-card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{rep.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                        {rep.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{rep.location}</span>
                      <span className="text-emerald-700 font-bold">+{rep.scoreEarned} Pts Earned</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. CHANGE LOCATION / MANUAL WARD PICKER MODAL */}
      {isWardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-300 max-h-[88vh] flex flex-col">
            <div className="p-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-blue-300" />
                <div>
                  <h3 className="text-base font-bold font-['Outfit']">Select Location / Municipal Ward</h3>
                  <p className="text-[11px] text-blue-200">Set your reporting locality or auto-detect via GPS</p>
                </div>
              </div>
              <button
                onClick={() => setIsWardModalOpen(false)}
                className="p-1 rounded-full text-blue-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
              {/* 1-Click Live GPS Auto-Detect Button */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <LocateFixed className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Use Real Device GPS</div>
                    <div className="text-[11px] text-emerald-800">Auto-scans your actual device satellite/network position</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await handleDetectLocation(true);
                    setIsWardModalOpen(false);
                  }}
                  disabled={isVerifyingLocality}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-2xs flex items-center gap-1 shrink-0"
                >
                  {isVerifyingLocality ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Compass className="w-3.5 h-3.5" />
                  )}
                  <span>Detect GPS</span>
                </button>
              </div>

              {/* Search Filter Box */}
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="text"
                    value={wardSearchQuery}
                    onChange={(e) => setWardSearchQuery(e.target.value)}
                    placeholder="Search city or area (e.g., Delhi, Gaya, Patna, Bangalore, Muzaffarpur...)"
                    className="gov-input text-xs w-full pl-8"
                  />
                  <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Toggle Custom Location Form */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Popular Municipalities & Wards</span>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomLoc(!isAddingCustomLoc)}
                  className="text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isAddingCustomLoc ? 'Hide Custom Input' : 'Enter Custom Area'}</span>
                </button>
              </div>

              {/* Custom Area Form */}
              {isAddingCustomLoc && (
                <form onSubmit={handleSaveCustomLocation} className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 space-y-2.5 animate-fadeIn">
                  <div className="font-bold text-slate-900 text-xs">Enter Your Custom City / Locality</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={customCityInput}
                      onChange={(e) => setCustomCityInput(e.target.value)}
                      placeholder="City (e.g. Pune, Ranchi, Delhi)"
                      className="gov-input text-xs"
                      required
                    />
                    <input
                      type="text"
                      value={customLocalityInput}
                      onChange={(e) => setCustomLocalityInput(e.target.value)}
                      placeholder="Locality / Area / Ward"
                      className="gov-input text-xs"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-2xs"
                  >
                    Set as My Active Location
                  </button>
                </form>
              )}

              {/* Popular Wards List */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {POPULAR_WARDS
                  .filter((ward) => {
                    if (!wardSearchQuery.trim()) return true;
                    const q = wardSearchQuery.toLowerCase();
                    return (
                      ward.city.toLowerCase().includes(q) ||
                      ward.locality.toLowerCase().includes(q) ||
                      ward.shortName.toLowerCase().includes(q) ||
                      ward.landmark.toLowerCase().includes(q)
                    );
                  })
                  .map((ward) => {
                    const isSelected = verifiedLocality.locality === ward.locality;
                    return (
                      <button
                        key={ward.id}
                        onClick={() => handleSelectWard(ward)}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-400 shadow-2xs' 
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{ward.locality}</span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {ward.city}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{ward.landmark} • {ward.zone}</div>
                        </div>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-700 text-white font-bold text-[10px]">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setIsWardModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. GEOFENCED DOUBT CONFIRMATION MODAL */}
      {geoModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-300 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-blue-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <LocateFixed className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-['Outfit'] flex items-center gap-1.5">
                    <span>Geofenced Doubt Confirmation</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 bg-emerald-500/20 rounded border border-emerald-400/30 text-emerald-200">
                      {geoModalTask.id}
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-200">Multi-point GPS and Proximity Validation</p>
                </div>
              </div>
              <button
                onClick={() => setGeoModalTask(null)}
                className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Task Summary Banner */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    {geoModalTask.detectedType}
                  </span>
                  <span className="text-slate-500 text-[11px]">Source: {geoModalTask.cameraSource}</span>
                </div>
                <p className="font-bold text-slate-900 text-sm">{geoModalTask.prompt}</p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                  <strong className="text-slate-800">Doubt Reason:</strong> {geoModalTask.doubtReason || 'Ground verification needed before dispatching municipal team.'}
                </div>
              </div>

              {/* Geolocation Telemetry Bridge Card */}
              {(() => {
                const distKm = calculateDistanceKm(
                  verifiedLocality.lat,
                  verifiedLocality.lng,
                  geoModalTask.lat || 25.6094,
                  geoModalTask.lng || 85.1376
                );
                const trustInfo = getGeoTrustTier(distKm);
                const points = getDynamicGeoReward(distKm, geoModalTask.rewardPoints);

                return (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/70 via-slate-50 to-emerald-50/50 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Navigation className="w-4 h-4 text-blue-700" />
                        <span>Live Geolocation Distance Telemetry</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                        +{points} Pts Reward
                      </span>
                    </div>

                    {/* 2-Point Location Comparison Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                        <div className="text-slate-500 font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-700" />
                          <span>Reported Issue Spot</span>
                        </div>
                        <div className="font-bold text-slate-900 truncate">{geoModalTask.location}</div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {geoModalTask.lat?.toFixed(4)}° N, {geoModalTask.lng?.toFixed(4)}° E
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                        <div className="text-slate-500 font-semibold flex items-center gap-1">
                          <LocateFixed className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Your Active Location</span>
                        </div>
                        <div className="font-bold text-slate-900 truncate">{verifiedLocality.locality}</div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {verifiedLocality.lat?.toFixed(4)}° N, {verifiedLocality.lng?.toFixed(4)}° E
                        </div>
                      </div>
                    </div>

                    {/* Calculated Distance & Trust Badge */}
                    <div className="p-3 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">Haversine Distance:</span>
                          <span className="font-mono font-black text-sm text-blue-900">{distKm} km</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{trustInfo.description}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 text-center ${
                        trustInfo.color === 'emerald'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : trustInfo.color === 'blue'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}>
                        {trustInfo.badge}
                      </span>
                    </div>

                    {/* Location Override / GPS refresh shortcut if distance > 2.5km */}
                    {distKm > 2.5 && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-950">
                        <span>Are you currently at {geoModalTask.localityName || 'this ward'}?</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDetectLocation(true)}
                            className="px-2 py-0.5 rounded bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold cursor-pointer"
                          >
                            Refresh GPS
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectWard({
                              id: geoModalTask.id,
                              city: 'Patna',
                              locality: geoModalTask.localityName || geoModalTask.location,
                              shortName: geoModalTask.localityName || geoModalTask.location,
                              lat: geoModalTask.lat || 25.6094,
                              lng: geoModalTask.lng || 85.1376,
                              landmark: geoModalTask.location,
                              zone: 'Patna Ward'
                            })}
                            className="px-2 py-0.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold cursor-pointer"
                          >
                            Set Location Here
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Verdict Selector */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 block text-xs">
                  Your On-Ground Verification Verdict:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGeoModalObservation('confirmed')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      geoModalObservation === 'confirmed'
                        ? 'bg-emerald-50 border-emerald-500 shadow-2xs text-emerald-950'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      geoModalObservation === 'confirmed' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}>
                      {geoModalObservation === 'confirmed' && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs">Yes, Issue Active</div>
                      <div className="text-[11px] text-slate-500">Problem is present on ground and needs municipal action</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGeoModalObservation('resolved')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      geoModalObservation === 'resolved'
                        ? 'bg-slate-100 border-slate-500 shadow-2xs text-slate-950'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      geoModalObservation === 'resolved' ? 'border-slate-600 bg-slate-600' : 'border-slate-300'
                    }`}>
                      {geoModalObservation === 'resolved' && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs">False Alarm / Resolved</div>
                      <div className="text-[11px] text-slate-500">Spot is clean or hazard has been cleared</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Optional Field Observation Note */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block text-xs">
                  Ground Observation Note (Optional):
                </label>
                <input
                  type="text"
                  value={geoModalComment}
                  onChange={(e) => setGeoModalComment(e.target.value)}
                  placeholder="e.g. Water is backing up from main drain, barrier is missing..."
                  className="gov-input text-xs w-full"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setGeoModalTask(null)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  handleExecuteGeoConfirmation(
                    geoModalTask, 
                    geoModalObservation === 'confirmed', 
                    geoModalComment
                  );
                }}
                className={`px-5 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all ${
                  geoModalObservation === 'confirmed'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  Submit Geotagged Verification ({
                    getDynamicGeoReward(
                      calculateDistanceKm(
                        verifiedLocality.lat,
                        verifiedLocality.lng,
                        geoModalTask.lat || 25.6094,
                        geoModalTask.lng || 85.1376
                      ),
                      geoModalTask.rewardPoints
                    )
                  } Pts)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CitizenPortal;
