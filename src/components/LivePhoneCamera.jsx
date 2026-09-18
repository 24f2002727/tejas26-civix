import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  Video, 
  Smartphone, 
  Wifi, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Play, 
  Square, 
  RefreshCw, 
  Maximize2, 
  Sliders, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Car, 
  Zap, 
  Download, 
  Eye, 
  Info, 
  X, 
  HelpCircle, 
  ExternalLink,
  Code2,
  Copy,
  Check,
  Compass,
  Cpu,
  Flashlight,
  Radio,
  Gauge,
  Waves,
  Lightbulb,
  RadioTower,
  SmartphoneNfc,
  Key,
  FlaskConical
} from 'lucide-react';
import { 
  detectCivicIssuesInLiveImage, 
  playDetectionBeep, 
  getApiKey, 
  setApiKey as persistApiKey,
  hasValidApiKey, 
  getSelectedModel, 
  setSelectedModel as persistSelectedModel,
  SUPPORTED_MODELS,
  analyzeTelemetryImpact,
  analyzeStreetlightTelemetry
} from '../services/aiService';
import { IP_CAMERA_PRESETS, MCD_VEHICLE_FLEET } from '../data/mcdFleetData';
import { dataProcessingService } from '../services/dataProcessingService';

export function LivePhoneCamera({ 
  onClose, 
  onRegisterCamera, 
  onAddReport, 
  onDispatchCluster,
  onOpenApiKeyModal,
  userLocation,
  initialMode = 'ip_stream' // 'ip_stream', 'phone_device', 'mcd_dashcam', 'ml_benchmark'
}) {
  const [activeMode, setActiveMode] = useState(initialMode);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // 'environment' (back) | 'user' (front)
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  
  // IP Camera Stream State
  const [ipCameraUrl, setIpCameraUrl] = useState('http://192.168.1.6:8080/video');
  const [selectedPreset, setSelectedPreset] = useState('ip_webcam_android');
  const [ipConnectStatus, setIpConnectStatus] = useState('idle'); // 'idle' | 'testing' | 'connected' | 'error'
  const [ipErrorMsg, setIpErrorMsg] = useState('');
  const [isSampleVideoActive, setIsSampleVideoActive] = useState(false);
  const [activeStreamType, setActiveStreamType] = useState('video'); // 'video' | 'mjpeg_img'

  // ML Detection State
  const [isAiScanning, setIsAiScanning] = useState(true);
  const [scanIntervalSec, setScanIntervalSec] = useState(3);
  const [sensitivity, setSensitivity] = useState(75);
  const [selectedModel, setSelectedModel] = useState(getSelectedModel());
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [detections, setDetections] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [isAnalyzingFrame, setIsAnalyzingFrame] = useState(false);
  const [fps, setFps] = useState(0);
  const [lastInferenceTimeMs, setLastInferenceTimeMs] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [opticalStatus, setOpticalStatus] = useState('Lens waiting for stream');

  // Accelerometer / IMU Telemetry (Smartphone Z-Axis Sensor)
  const [imuActive, setImuActive] = useState(false);
  const [liveZAccel, setLiveZAccel] = useState(9.81);
  const [lastImpactEvent, setLastImpactEvent] = useState(null);

  // IoT Smart Lighting Telemetry Test State
  const [iotVoltage, setIotVoltage] = useState(230);
  const [iotCurrent, setIotCurrent] = useState(0.52);
  const [iotLux, setIotLux] = useState(5);
  const [iotDiagnosis, setIotDiagnosis] = useState(null);

  // MCD Vehicle Patrol Simulation
  const [selectedVehicle, setSelectedVehicle] = useState(MCD_VEHICLE_FLEET[0]);
  const [vehicleSpeed, setVehicleSpeed] = useState(32);
  const [roadDistressIndex, setRoadDistressIndex] = useState(76);

  // UI state
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);
  const [showPairingGuide, setShowPairingGuide] = useState(false);

  // DOM Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const ipImageRef = useRef(null);
  const streamTrackRef = useRef(null);
  const scanTimerRef = useRef(null);

  // Initialize available video devices
  useEffect(() => {
    async function getDevices() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          setAvailableDevices(videoInputs);
          if (videoInputs.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(videoInputs[0].deviceId);
          }
        }
      } catch (e) {
        console.warn('Could not enumerate video devices:', e);
      }
    }
    getDevices();
  }, []);

  // Accelerometer Device Motion Listener for Real Smartphones
  useEffect(() => {
    const handleMotion = (event) => {
      if (event.accelerationIncludingGravity) {
        const z = event.accelerationIncludingGravity.z || 9.8;
        setLiveZAccel(Math.round(z * 100) / 100);
        setImuActive(true);

        const impact = analyzeTelemetryImpact(z, vehicleSpeed);
        if (impact.isImpact) {
          setLastImpactEvent(impact);
          if (soundAlerts) playDetectionBeep(impact.severity);
        }
      }
    };

    if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [vehicleSpeed, soundAlerts]);

  // Handle Mode Switching
  useEffect(() => {
    stopAllStreams();
    setDetections([]);
    setLatestAnalysis(null);

    if (activeMode === 'phone_device') {
      startDeviceCamera();
    } else if (activeMode === 'mcd_dashcam') {
      loadSampleVideo();
    } else if (activeMode === 'ip_stream') {
      setIsSampleVideoActive(false);
      setIpConnectStatus('idle');
    }

    return () => {
      stopAllStreams();
    };
  }, [activeMode, cameraFacingMode, selectedDeviceId]);

  // Start Built-in Phone / Web Camera (WebRTC)
  const startDeviceCamera = async () => {
    stopAllStreams();
    setIpConnectStatus('testing');
    try {
      const constraints = {
        video: selectedDeviceId 
          ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: cameraFacingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      const track = stream.getVideoTracks()[0];
      streamTrackRef.current = track;

      if (track && track.getCapabilities) {
        const capabilities = track.getCapabilities();
        setTorchSupported(Boolean(capabilities.torch));
      }

      setIsStreaming(true);
      setIsSampleVideoActive(false);
      setActiveStreamType('video');
      setIpConnectStatus('connected');
      setOpticalStatus('Camera stream active');
      setFps(30);
    } catch (err) {
      console.warn('Device camera error:', err);
      setIsStreaming(false);
      setIpConnectStatus('error');
      setIpErrorMsg(err.name === 'NotAllowedError' ? 'Camera permission was denied. Please allow camera access in your browser settings.' : 'Could not start camera device.');
    }
  };

  // Connect to Phone IP Camera Stream (Android IP Webcam / DroidCam)
  const handleConnectIpCamera = () => {
    stopAllStreams();
    const url = ipCameraUrl.trim();
    if (!url || !url.startsWith('http')) {
      setIpConnectStatus('error');
      setIpErrorMsg('Please enter a valid HTTP stream URL (e.g. http://192.168.1.6:8080/video)');
      return;
    }

    setIpConnectStatus('testing');
    setIpErrorMsg('');
    setOpticalStatus('Pinging phone stream...');

    const testImg = new Image();
    let isHandled = false;

    const timeoutId = setTimeout(() => {
      if (!isHandled) {
        isHandled = true;
        setIpConnectStatus('error');
        setIsStreaming(false);
        setIpErrorMsg(`Cannot reach phone camera at ${url}. Ensure the IP Webcam / DroidCam app is running and your laptop & phone are on the same Wi-Fi.`);
        setOpticalStatus('Stream unreachable');
      }
    }, 4500);

    testImg.onload = () => {
      if (isHandled) return;
      isHandled = true;
      clearTimeout(timeoutId);

      setActiveStreamType('mjpeg_img');
      setIsStreaming(true);
      setIsSampleVideoActive(false);
      setIpConnectStatus('connected');
      setOpticalStatus('Connected to phone IP stream (MJPEG)');
      setFps(25);
      setActionSuccessMsg('Connected to Phone Camera Stream successfully!');
      setTimeout(() => setActionSuccessMsg(null), 3000);
    };

    testImg.onerror = () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.play().then(() => {
          if (isHandled) return;
          isHandled = true;
          clearTimeout(timeoutId);
          setActiveStreamType('video');
          setIsStreaming(true);
          setIpConnectStatus('connected');
          setOpticalStatus('Connected to phone IP video stream');
          setFps(28);
        }).catch(() => {
          if (isHandled) return;
          isHandled = true;
          clearTimeout(timeoutId);
          setIpConnectStatus('error');
          setIsStreaming(false);
          setIpErrorMsg(`Failed to connect to ${url}. Check IP address & port.`);
          setOpticalStatus('Connection failed');
        });
      }
    };

    const testUrl = url.includes('/video') ? url.replace('/video', '/shot.jpg') : url;
    testImg.src = `${testUrl}?t=${Date.now()}`;
  };

  // Load sample video stream for MCD Dashcam mode
  const loadSampleVideo = () => {
    stopAllStreams();
    setIsSampleVideoActive(true);
    setIsStreaming(true);
    setActiveStreamType('video');
    setIpConnectStatus('connected');
    setOpticalStatus('MCD Patrol Dashcam Simulation Active');
    setFps(30);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = "https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-street-in-the-city-43450-large.mp4";
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  };

  // Disconnect stream
  const handleDisconnect = () => {
    stopAllStreams();
    setIpConnectStatus('idle');
    setDetections([]);
    setLatestAnalysis(null);
    setOpticalStatus('Disconnected');
    setFps(0);
  };

  // Stop camera streams
  const stopAllStreams = () => {
    if (streamTrackRef.current) {
      streamTrackRef.current.stop();
      streamTrackRef.current = null;
    }
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      videoRef.current.pause();
    }
    if (ipImageRef.current) {
      ipImageRef.current.src = '';
    }
    setIsStreaming(false);
  };

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (streamTrackRef.current && torchSupported) {
      try {
        const nextState = !torchOn;
        await streamTrackRef.current.applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setTorchOn(nextState);
      } catch (e) {
        console.warn('Torch toggle error:', e);
      }
    }
  };

  // Draw HUD Canvas Overlay (Bounding Boxes & Corner Reticles)
  useEffect(() => {
    let animationFrameId;

    const renderOverlay = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Targeting Corner Reticles
      ctx.strokeStyle = isStreaming ? 'rgba(59, 130, 246, 0.45)' : 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 2;
      const pad = 24;
      const len = 28;

      ctx.beginPath();
      ctx.moveTo(pad, pad + len); ctx.lineTo(pad, pad); ctx.lineTo(pad + len, pad);
      ctx.moveTo(width - pad - len, pad); ctx.lineTo(width - pad, pad); ctx.lineTo(width - pad, pad + len);
      ctx.moveTo(pad, height - pad - len); ctx.lineTo(pad, height - pad); ctx.lineTo(pad + len, height - pad);
      ctx.moveTo(width - pad - len, height - pad); ctx.lineTo(width - pad, height - pad); ctx.lineTo(width - pad, height - pad - len);
      ctx.stroke();

      // 2. Center AI Crosshair
      const cx = width / 2;
      const cy = height / 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
      ctx.stroke();

      // 3. Draw Bounding Boxes with distinct styles for Live Objects vs. Civic Hazards
      if (isStreaming && detections && detections.length > 0) {
        const time = Date.now() / 300;

        detections.forEach((d) => {
          const bbox = d.bbox || { x: 25, y: 40, w: 40, h: 30 };
          const bx = (bbox.x / 100) * width;
          const by = (bbox.y / 100) * height;
          const bw = (bbox.w / 100) * width;
          const bh = (bbox.h / 100) * height;

          const isHazard = d.isHazard !== undefined ? d.isHazard : (d.severity === 'critical' || d.severity === 'high');
          const isCritical = d.severity === 'critical';
          const isHigh = d.severity === 'high';

          const strokeColor = isHazard
            ? (isCritical ? 'rgba(239, 68, 68, 0.95)' : 'rgba(245, 158, 11, 0.95)')
            : 'rgba(6, 182, 212, 0.95)'; // Cyan for Live Scene Objects
          const fillColor = isHazard
            ? (isCritical ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.10)')
            : 'rgba(6, 182, 212, 0.08)';

          ctx.fillStyle = fillColor;
          ctx.fillRect(bx, by, bw, bh);

          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2.5;
          if (isHazard) {
            ctx.setLineDash([8, 4]);
            ctx.lineDashOffset = -time * 5;
          } else {
            ctx.setLineDash([]);
          }
          ctx.strokeRect(bx, by, bw, bh);
          ctx.setLineDash([]);

          // Corner reticles
          const cLen = 12;
          ctx.lineWidth = 3.5;
          ctx.strokeStyle = strokeColor;
          ctx.beginPath();
          ctx.moveTo(bx, by + cLen); ctx.lineTo(bx, by); ctx.lineTo(bx + cLen, by);
          ctx.moveTo(bx + bw - cLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cLen);
          ctx.moveTo(bx, by + bh - cLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cLen, by + bh);
          ctx.moveTo(bx + bw - cLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cLen);
          ctx.stroke();

          // Label
          const prefix = isHazard ? '⚠️ ' : '🎯 ';
          const labelText = `${prefix}${d.label} • ${d.confidence}%`;
          ctx.font = 'bold 12px "Outfit", sans-serif';
          const textMetrics = ctx.measureText(labelText);
          const bannerWidth = Math.max(textMetrics.width + 16, 110);
          const bannerHeight = 22;

          ctx.fillStyle = strokeColor;
          ctx.fillRect(bx, Math.max(0, by - bannerHeight), bannerWidth, bannerHeight);

          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(labelText, bx + 8, Math.max(15, by - 6));

          if (d.roadPotholeDepthEst && isHazard) {
            const depthText = `Depth: ~${d.roadPotholeDepthEst}`;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(bx, by + bh, 140, 20);
            ctx.fillStyle = '#F59E0B';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(depthText, bx + 6, by + bh + 14);
          }
        });
      }

      animationFrameId = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [detections, isStreaming]);

  // Capture current live frame & validate optical luminance
  const captureCurrentFrameBase64 = useCallback(() => {
    if (!isStreaming) return null;

    try {
      const hiddenCanvas = hiddenCanvasRef.current || document.createElement('canvas');
      let width = 640;
      let height = 480;
      let sourceElement = null;

      if (activeStreamType === 'video' && videoRef.current && videoRef.current.videoWidth > 0) {
        sourceElement = videoRef.current;
        width = videoRef.current.videoWidth;
        height = videoRef.current.videoHeight;
      } else if (activeStreamType === 'mjpeg_img' && ipImageRef.current && ipImageRef.current.naturalWidth > 0) {
        sourceElement = ipImageRef.current;
        width = ipImageRef.current.naturalWidth;
        height = ipImageRef.current.naturalHeight;
      }

      if (!sourceElement) return null;

      hiddenCanvas.width = width;
      hiddenCanvas.height = height;
      const ctx = hiddenCanvas.getContext('2d');
      ctx.drawImage(sourceElement, 0, 0, width, height);

      // Safe Luminance check (Non-blocking on cross-origin security errors)
      try {
        const sampleSize = 32;
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = sampleSize;
        sampleCanvas.height = sampleSize;
        const sCtx = sampleCanvas.getContext('2d');
        sCtx.drawImage(hiddenCanvas, 0, 0, sampleSize, sampleSize);
        const imgData = sCtx.getImageData(0, 0, sampleSize, sampleSize).data;

        let totalLuminance = 0;
        const totalPixels = sampleSize * sampleSize;
        for (let i = 0; i < imgData.length; i += 4) {
          totalLuminance += 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
        }
        const avgBrightness = totalLuminance / totalPixels;

        if (avgBrightness < 10) {
          setOpticalStatus('Lens covered / dark frame (Zero luminance)');
          return null;
        }

        setOpticalStatus(`Optical frame valid (Avg Brightness: ${Math.round(avgBrightness)})`);
      } catch (corsErr) {
        setOpticalStatus('Live IP stream active (Cross-origin frame)');
      }

      try {
        return hiddenCanvas.toDataURL('image/jpeg', 0.82);
      } catch (toDataUrlErr) {
        return 'live_stream_frame';
      }
    } catch (e) {
      console.warn('Frame capture error:', e);
      return null;
    }
  }, [isStreaming, activeStreamType]);

  // Run AI ML Inference on the current live frame
  const runFrameInference = useCallback(async () => {
    if (isAnalyzingFrame || !isStreaming) return;
    setIsAnalyzingFrame(true);

    try {
      const frameBase64 = captureCurrentFrameBase64();
      
      if (!frameBase64) {
        setIsAnalyzingFrame(false);
        return;
      }

      const result = await detectCivicIssuesInLiveImage(frameBase64, {
        model: selectedModel,
        sensitivity,
        isSampleVideo: isSampleVideoActive
      });

      setLatestAnalysis(result);
      setLastInferenceTimeMs(result.latencyMs);

      if (result.hasAnomaly && result.detections?.length > 0) {
        setDetections(result.detections);
        
        if (soundAlerts) {
          const topSeverity = result.detections.some(d => d.severity === 'critical') ? 'critical' : 'high';
          playDetectionBeep(topSeverity);
        }

        const topDetection = result.detections[0];
        setDetectionHistory(prev => [
          {
            id: `DET-${Date.now()}`,
            label: topDetection.label,
            category: topDetection.category,
            confidence: topDetection.confidence,
            severity: topDetection.severity,
            time: new Date().toLocaleTimeString(),
            depth: topDetection.roadPotholeDepthEst
          },
          ...prev.slice(0, 9)
        ]);
      } else {
        setDetections([]);
      }
    } catch (e) {
      console.warn('Inference cycle error:', e);
    } finally {
      setIsAnalyzingFrame(false);
    }
  }, [isAnalyzingFrame, isStreaming, captureCurrentFrameBase64, selectedModel, sensitivity, isSampleVideoActive, soundAlerts]);

  // Periodic AI Scanning Loop
  useEffect(() => {
    if (scanTimerRef.current) clearInterval(scanTimerRef.current);

    if (isAiScanning && isStreaming) {
      scanTimerRef.current = setInterval(() => {
        runFrameInference();
      }, scanIntervalSec * 1000);
    }

    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, [isAiScanning, isStreaming, scanIntervalSec, runFrameInference]);

  // Manually Inject a Test Pothole Anomaly to verify HUD & Telemetry
  const handleInjectTestAnomaly = () => {
    const testDet = [
      {
        label: "Pothole / Road Surface Crater",
        category: "Roads & Potholes",
        confidence: 94,
        severity: "critical",
        bbox: { x: 26, y: 50, w: 42, h: 28 },
        description: "Severe asphalt crater with exposed sub-base aggregate.",
        suggestedAction: "Deploy rapid bitumen patch repair unit.",
        roadPotholeDepthEst: "12.8 cm (Critical Hazard)"
      }
    ];
    setDetections(testDet);
    if (soundAlerts) playDetectionBeep('critical');
    setActionSuccessMsg('Injected test pothole anomaly: Bounding box HUD & audio alert verified!');
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // Register Live Camera into Municipal CCTV Grid
  const handleRegisterAsCctv = async () => {
    const newCamera = {
      id: `CAM-LIVE-${Math.floor(100 + Math.random() * 900)}`,
      name: activeMode === 'mcd_dashcam' 
        ? `${selectedVehicle.name} (Live Dashcam)`
        : `Phone Sentinel Node (${cameraFacingMode === 'environment' ? 'Rear Cam' : 'Front Cam'})`,
      location: activeMode === 'mcd_dashcam' 
        ? selectedVehicle.currentLocation 
        : (userLocation?.locality || 'Live Mobile Streamer'),
      lat: activeMode === 'mcd_dashcam' ? selectedVehicle.lat : (userLocation?.lat || 12.9716),
      lng: activeMode === 'mcd_dashcam' ? selectedVehicle.lng : (userLocation?.lng || 77.5946),
      status: 'active',
      aiDetection: detections[0] || {
        type: 'Active Live Stream',
        confidence: 95,
        severity: 'high',
        bbox: { x: 25, y: 45, w: 40, h: 30 },
        details: 'Live AI Camera Vision Node registered by operator.'
      },
      lastPing: 'Just now',
      streamQuality: '1080p 30fps'
    };

    if (onRegisterCamera) {
      onRegisterCamera(newCamera);
    }

    setActionSuccessMsg(`Live Camera registered to Municipal CCTV Grid as "${newCamera.name}"!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // 1-Click Auto-Log as Citizen Report
  const handleAutoLogReport = async (det) => {
    const frame = captureCurrentFrameBase64();
    const reportData = {
      title: `Live Flagged: ${det.label}`,
      category: det.category,
      location: activeMode === 'mcd_dashcam' ? selectedVehicle.currentLocation : (userLocation?.locality || 'Civil Lines Ward Area'),
      lat: activeMode === 'mcd_dashcam' ? selectedVehicle.lat : (userLocation?.lat || 12.9716),
      lng: activeMode === 'mcd_dashcam' ? selectedVehicle.lng : (userLocation?.lng || 77.5946),
      assignedDept: det.category === 'Roads & Potholes' ? 'Roads & Bridges Dept' : 'Solid Waste Management',
      scoreEarned: 35,
      mediaType: 'photo',
      mediaUrl: frame || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      potholeDepthEst: det.roadPotholeDepthEst
    };

    if (onAddReport) {
      onAddReport(reportData);
    }

    setActionSuccessMsg(`Report logged & correlated to municipal problem cluster (+35 CivicScore pts)!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Run IoT Streetlight Test
  const handleRunIotDiagnosis = () => {
    const res = analyzeStreetlightTelemetry(iotVoltage, iotCurrent, 0.92, iotLux);
    setIotDiagnosis(res);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden text-slate-900">
        
        {/* TOP MODAL HEADER */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-blue-700/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/40 border border-blue-400/30 flex items-center justify-center text-white shadow-inner">
              <Radio className="w-5 h-5 text-blue-200 live-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-['Outfit'] text-white">
                  Live AI Camera & Edge Vision Sentinel Hub
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                  isStreaming 
                    ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300' 
                    : 'bg-slate-700/50 border border-slate-600 text-slate-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-emerald-400 live-pulse' : 'bg-slate-400'}`}></span>
                  {isStreaming ? 'Stream Active' : 'Standby / Disconnected'}
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Phone IP Streaming • Gemini Multimodal Vision • YOLOv12 Edge Detection • IMU Shock Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenApiKeyModal ? onOpenApiKeyModal() : setShowPairingGuide(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-xs font-semibold text-amber-200 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Configure Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>{hasValidApiKey() ? 'API Key Configured' : 'Set Gemini API Key'}</span>
            </button>

            <button
              onClick={() => setShowPairingGuide(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-300" />
              <span>Phone Setup Guide</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 CORE NAVIGATION MODES */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Mode 1: IP Camera Stream */}
            <button
              onClick={() => setActiveMode('ip_stream')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeMode === 'ip_stream'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>1. Phone IP Camera Stream</span>
            </button>

            {/* Mode 2: Direct Device / Phone Camera */}
            <button
              onClick={() => setActiveMode('phone_device')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeMode === 'phone_device'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>2. Phone / Web Camera (WebRTC)</span>
            </button>

            {/* Mode 3: MCD Vehicle Mobile Dashcam */}
            <button
              onClick={() => setActiveMode('mcd_dashcam')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeMode === 'mcd_dashcam'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>3. MCD Vehicle Mobile Dashcam</span>
            </button>

            {/* Mode 4: ML Model Test Bench */}
            <button
              onClick={() => setActiveMode('ml_benchmark')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeMode === 'ml_benchmark'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>4. Edge ML & IoT Benchmark</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 pr-2">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-blue-600" />
              Latency: <strong className="text-slate-700">{lastInferenceTimeMs}ms</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Cpu className={`w-3 h-3 ${hasValidApiKey() ? 'text-emerald-600' : 'text-blue-600'}`} />
              Model: <strong className={hasValidApiKey() ? 'text-emerald-700 font-bold' : 'text-slate-700 font-bold'}>
                {hasValidApiKey() ? 'GEMINI 2.5 FLASH (DEEP LIVE AI)' : 'YOLOv12 EDGE CV (LOCAL OPTICAL)'}
              </strong>
            </span>
          </div>
        </div>

        {/* NOTIFICATION BANNER */}
        {actionSuccessMsg && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg(null)}>
              <X className="w-3.5 h-3.5 opacity-80 hover:opacity-100" />
            </button>
          </div>
        )}

        {/* MAIN BODY: 2-COLUMN VIEWPORT */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* LEFT 7 COLS: VIDEO HUD VIEWPORT */}
          <div className="lg:col-span-7 bg-slate-950 p-4 flex flex-col justify-between relative min-h-[380px] lg:min-h-[500px]">
            
            {/* TOP HUD STATUS BAR OVER VIDEO */}
            <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-white text-xs shadow-lg">
                <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-red-500 live-pulse' : 'bg-slate-500'}`}></span>
                <span className="font-mono font-bold tracking-wider">
                  {isStreaming ? 'LIVE REC' : 'OFFLINE'}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-[11px] text-slate-300 font-mono">
                  {fps} FPS
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-[11px] text-blue-300">
                  {activeMode === 'mcd_dashcam' ? selectedVehicle.name : 'Sentinel Node'}
                </span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                {torchSupported && activeMode === 'phone_device' && (
                  <button
                    onClick={toggleTorch}
                    className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      torchOn ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800/80 text-white hover:bg-slate-700'
                    }`}
                    title="Toggle Flashlight/Torch"
                  >
                    <Flashlight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setSoundAlerts(!soundAlerts)}
                  className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
                    soundAlerts ? 'bg-blue-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                  }`}
                  title="Toggle Audio Beep Alerts"
                >
                  {soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* VIDEO & CANVAS CONTAINER */}
            <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-slate-900 border border-slate-800 my-auto">
              
              {!isStreaming && (
                <div className="text-center p-6 space-y-4 max-w-md z-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-blue-400 shadow-inner">
                    {activeMode === 'ip_stream' ? (
                      <Wifi className="w-8 h-8" />
                    ) : activeMode === 'phone_device' ? (
                      <Camera className="w-8 h-8" />
                    ) : (
                      <Car className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-['Outfit']">
                      {activeMode === 'ip_stream' && 'Phone IP Camera Disconnected'}
                      {activeMode === 'phone_device' && 'Phone Camera Ready'}
                      {activeMode === 'mcd_dashcam' && 'MCD Patrol Dashcam Ready'}
                      {activeMode === 'ml_benchmark' && 'ML Model Test Bench Active'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {activeMode === 'ip_stream' && 'Enter your phone IP address on the right panel and tap Connect to stream live video.'}
                      {activeMode === 'phone_device' && 'Grant browser camera permission to stream directly with your phone or laptop lens.'}
                      {activeMode === 'mcd_dashcam' && 'Click Start Dashcam Stream to inspect municipal patrol road footage.'}
                    </p>
                  </div>

                  {ipErrorMsg && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs text-left">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>Connection Issue:</span>
                      </div>
                      <p>{ipErrorMsg}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-2">
                    {activeMode === 'phone_device' && (
                      <button
                        onClick={startDeviceCamera}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Start Phone Camera
                      </button>
                    )}
                    {activeMode === 'mcd_dashcam' && (
                      <button
                        onClick={loadSampleVideo}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Start Dashcam Stream
                      </button>
                    )}
                    {activeMode === 'ip_stream' && (
                      <button
                        onClick={handleConnectIpCamera}
                        disabled={ipConnectStatus === 'testing'}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        {ipConnectStatus === 'testing' ? 'Testing Connection...' : 'Connect to Phone Camera'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Real Video Element */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-contain ${activeStreamType === 'video' && isStreaming ? 'block' : 'hidden'}`}
              />

              {/* MJPEG Image Stream */}
              <img
                ref={ipImageRef}
                alt="Phone IP Stream"
                crossOrigin="anonymous"
                src={isStreaming && activeStreamType === 'mjpeg_img' ? ipCameraUrl : ''}
                className={`w-full h-full object-contain ${activeStreamType === 'mjpeg_img' && isStreaming ? 'block' : 'hidden'}`}
              />

              {/* AI Bounding Box HUD Overlay Canvas */}
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              />

              {/* Hidden Canvas for Optical Analysis */}
              <canvas ref={hiddenCanvasRef} className="hidden" />

              {/* Live Optical Status Pill */}
              <div className="absolute bottom-3 left-3 z-20 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700 text-[10px] text-slate-300 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>{opticalStatus}</span>
              </div>
            </div>

            {/* BOTTOM HUD ACTION CONTROLS */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAiScanning(!isAiScanning)}
                  disabled={!isStreaming}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 ${
                    isAiScanning && isStreaming
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isAiScanning && isStreaming ? 'AI Auto-Scanning (ON)' : 'AI Scanning (OFF)'}</span>
                </button>

                <button
                  onClick={runFrameInference}
                  disabled={!isStreaming || isAnalyzingFrame}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingFrame ? 'animate-spin text-blue-400' : ''}`} />
                  <span>{isAnalyzingFrame ? 'Analyzing...' : 'Scan Frame Now'}</span>
                </button>

                <button
                  onClick={handleInjectTestAnomaly}
                  disabled={!isStreaming}
                  className="px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                  title="Inject test pothole bounding box to verify HUD & sound"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Test Anomaly</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isStreaming && (
                  <button
                    onClick={handleDisconnect}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-red-300 border border-red-800/40 font-bold transition-all cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}

                <button
                  onClick={handleRegisterAsCctv}
                  disabled={!isStreaming}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-40"
                >
                  <RadioTower className="w-3.5 h-3.5" />
                  <span>Register as Municipal Sentinel</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: CONTROLS, TELEMETRY & ML SETTINGS */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-4 overflow-y-auto">
            
            <div className="space-y-4">

              {/* 1. IP CAMERA CONFIG PANEL */}
              {activeMode === 'ip_stream' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Wifi className="w-4 h-4 text-blue-600" />
                      Phone IP Camera Stream Settings
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ipConnectStatus === 'connected' ? 'bg-emerald-100 text-emerald-800' :
                      ipConnectStatus === 'testing' ? 'bg-amber-100 text-amber-800' :
                      ipConnectStatus === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {ipConnectStatus.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Select Stream Source / Preset:
                    </label>
                    <select
                      value={selectedPreset}
                      onChange={(e) => {
                        setSelectedPreset(e.target.value);
                        const preset = IP_CAMERA_PRESETS.find(p => p.id === e.target.value);
                        if (preset && preset.defaultPort) {
                          setIpCameraUrl(`http://192.168.1.6:${preset.defaultPort}${preset.videoPath}`);
                        }
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800 focus:outline-blue-600"
                    >
                      {IP_CAMERA_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Phone Live Video URL (MJPEG/HTTP):
                    </label>
                    <input
                      type="text"
                      value={ipCameraUrl}
                      onChange={(e) => setIpCameraUrl(e.target.value)}
                      placeholder="http://192.168.1.6:8080/video"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono text-slate-800 focus:outline-blue-600"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Open <strong>IP Webcam</strong> app on phone, tap "Start server", and enter the displayed IP.
                    </p>
                  </div>

                  <button
                    onClick={handleConnectIpCamera}
                    disabled={ipConnectStatus === 'testing'}
                    className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Wifi className="w-4 h-4" />
                    <span>{ipConnectStatus === 'testing' ? 'Verifying Stream...' : 'Connect & Stream Phone Camera'}</span>
                  </button>
                </div>
              )}

              {/* 2. PHONE WEBRTC / DIRECT DEVICE PANEL */}
              {activeMode === 'phone_device' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-600" />
                      Direct Phone / Web Camera (WebRTC)
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      DIRECT LENS
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Camera Device Input (iPhone Continuity / Built-in):
                    </label>
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => setSelectedDeviceId(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800 focus:outline-blue-600"
                    >
                      {availableDevices.map((d, idx) => (
                        <option key={d.deviceId || idx} value={d.deviceId}>
                          {d.label || `Camera ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCameraFacingMode(cameraFacingMode === 'environment' ? 'user' : 'environment')}
                      className="flex-1 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                      <span>Flip: {cameraFacingMode === 'environment' ? 'Rear (Back Cam)' : 'Front (Selfie)'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. MCD PATROL VEHICLE DASHCAM SIMULATOR */}
              {activeMode === 'mcd_dashcam' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-blue-600" />
                      MCD Municipal Fleet Telematics
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      PATROLLING
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Active Municipal Patrol Vehicle:
                    </label>
                    <select
                      value={selectedVehicle.id}
                      onChange={(e) => {
                        const v = MCD_VEHICLE_FLEET.find(x => x.id === e.target.value);
                        if (v) {
                          setSelectedVehicle(v);
                          setVehicleSpeed(v.speedKmH);
                          setRoadDistressIndex(v.roadDistressIndex);
                        }
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800 focus:outline-blue-600"
                    >
                      {MCD_VEHICLE_FLEET.map((v) => (
                        <option key={v.id} value={v.id}>{v.name} ({v.vehicleNumber})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Patrol Speed</span>
                      <strong className="text-sm font-mono text-slate-800">{vehicleSpeed} km/h</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <span className="text-[10px] text-amber-800 block">Road Distress Index</span>
                      <strong className="text-sm font-mono text-amber-900">{roadDistressIndex}/100</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SMARTPHONE IMU & IOT SMART LIGHTING BENCHMARK */}
              {activeMode === 'ml_benchmark' && (
                <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <SmartphoneNfc className="w-4 h-4 text-indigo-600" />
                        Smartphone Z-Axis Impact Sensor (LSTM)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        {imuActive ? 'LIVE IMU' : 'SIMULATED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Measures vertical vehicle vibrations & shocks to detect severe pothole impacts.
                    </p>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 font-mono text-xs">
                      <span>Z-Axis Acceleration:</span>
                      <strong className="text-indigo-700">{liveZAccel} m/s²</strong>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        IoT Streetlight Fault Classifier (XGBoost)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 block">Voltage (V)</label>
                        <input
                          type="number"
                          value={iotVoltage}
                          onChange={(e) => setIotVoltage(Number(e.target.value))}
                          className="w-full text-xs p-1.5 rounded border border-slate-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Current (A)</label>
                        <input
                          type="number"
                          step="0.05"
                          value={iotCurrent}
                          onChange={(e) => setIotCurrent(Number(e.target.value))}
                          className="w-full text-xs p-1.5 rounded border border-slate-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Lux (Light)</label>
                        <input
                          type="number"
                          value={iotLux}
                          onChange={(e) => setIotLux(Number(e.target.value))}
                          className="w-full text-xs p-1.5 rounded border border-slate-300 font-mono"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleRunIotDiagnosis}
                      className="w-full py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Run XGBoost Grid Diagnostic
                    </button>
                    {iotDiagnosis && (
                      <div className={`p-2 rounded text-[11px] ${iotDiagnosis.hasFault ? 'bg-red-50 text-red-900 border border-red-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'}`}>
                        <strong>{iotDiagnosis.hasFault ? 'Fault Flagged:' : 'Grid Normal:'}</strong> {iotDiagnosis.faultType || 'Luminaire operating within nominal range.'} (Power: {iotDiagnosis.measuredPowerW}W)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ML MODEL SELECTOR & CONFIDENCE THRESHOLD */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    Multimodal Computer Vision Model
                  </h3>
                  {hasValidApiKey() && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      GEMINI CLOUD LIVE
                    </span>
                  )}
                </div>

                <div>
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      persistSelectedModel(e.target.value);
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800 focus:outline-blue-600"
                  >
                    {SUPPORTED_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1 font-bold text-slate-600">
                    <span>Confidence Threshold:</span>
                    <span className="text-blue-700 font-mono">{sensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* DETECTED ANOMALIES FEED */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    Detected Civic Anomalies ({detections.length})
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {detections.length > 0 ? 'REAL-TIME ACTIVE' : 'NO ANOMALIES'}
                  </span>
                </div>

                {detections.length === 0 ? (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                    <span>No civic anomalies detected in current frame.</span>
                    <div className="pt-1">
                      <button
                        onClick={handleInjectTestAnomaly}
                        className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        Click to test pothole anomaly detection & sound
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {detections.map((det, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              det.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {det.severity.toUpperCase()}
                            </span>
                            <strong className="text-slate-900">{det.label}</strong>
                          </div>
                          <span className="font-mono font-bold text-blue-700 text-xs">
                            {det.confidence}% Conf.
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600">{det.description}</p>

                        <div className="flex items-center justify-between pt-1">
                          {det.roadPotholeDepthEst && (
                            <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                              Depth Est: {det.roadPotholeDepthEst}
                            </span>
                          )}

                          <button
                            onClick={() => handleAutoLogReport(det)}
                            className="px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-[11px] cursor-pointer"
                          >
                            1-Click Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* PHONE PAIRING & SETUP GUIDE MODAL */}
        {showPairingGuide && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-700" />
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    How to Use Your Phone as a Live Camera
                  </h3>
                </div>
                <button onClick={() => setShowPairingGuide(false)} className="text-slate-500 hover:text-slate-800">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <strong className="block mb-1">Option A: Direct Phone Browser (Fastest — No App Needed)</strong>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-emerald-800">
                    <li>Connect phone to same Wi-Fi and open: <code>http://192.168.1.6:5173</code></li>
                    <li>Tap <strong>Tab 2 (Phone / Web Camera)</strong> and allow camera access.</li>
                    <li>Flip to Rear Camera to start real-time road & civic defect scanning!</li>
                  </ol>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                  <strong className="block mb-1">Option B: Android Phone with "IP Webcam" App</strong>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-800">
                    <li>Install free <strong>IP Webcam</strong> from Google Play Store.</li>
                    <li>Ensure phone and laptop are on same Wi-Fi.</li>
                    <li>Scroll to bottom and tap <strong>Start server</strong>.</li>
                    <li>Enter the displayed IP (e.g. <code>http://192.168.1.6:8080/video</code>) into Tab 1!</li>
                  </ol>
                </div>

                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
                  <strong className="block mb-1">Option C: iPhone on Mac (Continuity Camera)</strong>
                  <p className="text-[11px] text-slate-600">
                    Bring your iPhone near your Mac with Wi-Fi & Bluetooth ON, then pick <strong>iPhone Camera</strong> in Tab 2 dropdown!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPairingGuide(false)}
                className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold cursor-pointer"
              >
                Got It, Let's Stream!
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
