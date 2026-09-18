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
  FlaskConical,
  Upload,
  FileVideo,
  Pause,
  RotateCcw,
  FastForward,
  Key,
  RadioTower,
  SmartphoneNfc,
  QrCode,
  Laptop,
  WifiOff
} from 'lucide-react';
import { 
  detectCivicIssuesInLiveImage, 
  playDetectionBeep, 
  getApiKey, 
  setApiKey as persistApiKey,
  getGroqApiKey,
  getOpenAiApiKey,
  getActiveVisionProvider,
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
  initialMode = 'ip_stream' // 'ip_stream', 'phone_device', 'custom_video', 'mcd_dashcam', 'ml_benchmark'
}) {
  const [activeMode, setActiveMode] = useState(initialMode);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // 'environment' (back) | 'user' (front)
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [activeDeviceLabel, setActiveDeviceLabel] = useState('No Camera Connected');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  // IP Camera Stream State
  const defaultHost = typeof window !== 'undefined' ? (window.location.hostname || '192.168.1.6') : '192.168.1.6';
  const [ipCameraUrl, setIpCameraUrl] = useState(`http://${defaultHost}:8080/video`);
  const [selectedPreset, setSelectedPreset] = useState('ip_webcam_android');
  const [ipConnectStatus, setIpConnectStatus] = useState('idle'); // 'idle' | 'testing' | 'connected' | 'error'
  const [ipErrorMsg, setIpErrorMsg] = useState('');
  const [isSampleVideoActive, setIsSampleVideoActive] = useState(false);
  const [activeStreamType, setActiveStreamType] = useState('video'); // 'video' | 'mjpeg_img'
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // ML Detection State
  const [isAiScanning, setIsAiScanning] = useState(true);
  const [scanIntervalSec, setScanIntervalSec] = useState(3);
  const [sensitivity, setSensitivity] = useState(75);
  const [detectionRate, setDetectionRate] = useState(0.20); // 0.20 = 20%, 0.50 = 50%, 1.0 = 100%
  const [selectedModel, setSelectedModel] = useState(getSelectedModel());
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [detections, setDetections] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [isAnalyzingFrame, setIsAnalyzingFrame] = useState(false);
  const [fps, setFps] = useState(0);
  const [lastInferenceTimeMs, setLastInferenceTimeMs] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [opticalStatus, setOpticalStatus] = useState('Camera disconnected / Standby');

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

  // Custom Video File Upload State
  const [customVideoFile, setCustomVideoFile] = useState(null);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [customVideoDuration, setCustomVideoDuration] = useState(0);
  const [customVideoCurrentTime, setCustomVideoCurrentTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  const fileInputRef = useRef(null);

  // DOM Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const ipImageRef = useRef(null);
  const streamTrackRef = useRef(null);
  const scanTimerRef = useRef(null);
  const connectTimeoutRef = useRef(null);

  // Check mobile device environment
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
    }
  }, []);

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
    setIpErrorMsg('');

    if (activeMode === 'phone_device') {
      // Don't auto-claim phone connected; user or component explicitly triggers camera
      setIpConnectStatus('idle');
      setOpticalStatus('Ready to connect device camera');
    } else if (activeMode === 'mcd_dashcam') {
      loadSampleVideo();
    } else if (activeMode === 'custom_video') {
      if (customVideoUrl && videoRef.current) {
        setIsStreaming(true);
        setActiveStreamType('video');
        setIpConnectStatus('connected');
        setActiveDeviceLabel('Custom Video File');
        videoRef.current.srcObject = null;
        videoRef.current.src = customVideoUrl;
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      } else {
        setIsSampleVideoActive(false);
        setIpConnectStatus('idle');
        setActiveDeviceLabel('No Video Loaded');
        setOpticalStatus('Select a video file to analyze');
      }
    } else if (activeMode === 'ip_stream') {
      setIsSampleVideoActive(false);
      setIpConnectStatus('idle');
      setActiveDeviceLabel('Phone IP Camera (Disconnected)');
      setOpticalStatus('Phone IP Camera Disconnected');
    }

    return () => {
      stopAllStreams();
    };
  }, [activeMode, cameraFacingMode, selectedDeviceId]);

  // Start Built-in Phone / Web Camera (WebRTC)
  const startDeviceCamera = async () => {
    stopAllStreams();
    setIpConnectStatus('testing');
    setIpErrorMsg('');
    setOpticalStatus('Requesting camera lens access...');

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsStreaming(false);
      setIpConnectStatus('error');
      setIpErrorMsg('Camera access API (getUserMedia) is not supported in this browser or requires HTTPS / localhost.');
      setActiveDeviceLabel('Camera API Unsupported');
      return;
    }

    let stream = null;
    let lastError = null;

    // Strategy 1: Selected Device ID (if user selected a specific lens from dropdown)
    if (selectedDeviceId) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { ideal: selectedDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (e) {
        lastError = e;
      }
    }

    // Strategy 2: Facing mode (environment / user) with ideal resolution
    if (!stream) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: cameraFacingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (e) {
        lastError = e;
      }
    }

    // Strategy 3: Basic facingMode
    if (!stream) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacingMode },
          audio: false
        });
      } catch (e) {
        lastError = e;
      }
    }

    // Strategy 4: Simple video: true constraint (Any working camera lens)
    if (!stream) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      } catch (e) {
        lastError = e;
      }
    }

    if (!stream) {
      console.warn('All camera initialization strategies failed:', lastError);
      setIsStreaming(false);
      setIpConnectStatus('error');
      setActiveDeviceLabel('Camera Access Failed');
      if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
        setIpErrorMsg('Camera permission was denied. Please allow camera access in your browser address bar permissions.');
      } else if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
        setIpErrorMsg('No camera hardware found on this device.');
      } else if (lastError?.name === 'NotReadableError' || lastError?.name === 'TrackStartError') {
        setIpErrorMsg('Camera hardware is currently busy or in use by another application. Please close other camera apps and retry.');
      } else {
        setIpErrorMsg(`Could not start camera: ${lastError?.message || 'Device error'}`);
      }
      return;
    }

    try {
      if (videoRef.current) {
        videoRef.current.removeAttribute('src');
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        await videoRef.current.play().catch(e => console.warn('Video play warning:', e));
      }
      const track = stream.getVideoTracks()[0];
      streamTrackRef.current = track;

      if (track && track.getCapabilities) {
        const capabilities = track.getCapabilities();
        setTorchSupported(Boolean(capabilities.torch));
      }

      // Re-enumerate devices now that permission is granted so device labels are available
      try {
        if (navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          setAvailableDevices(videoInputs);
        }
      } catch (e) {}

      const trackLabel = track?.label || '';
      const isContinuity = trackLabel.toLowerCase().includes('iphone') || trackLabel.toLowerCase().includes('continuity');

      let deviceDesc = 'Laptop Webcam Active';
      if (isMobileDevice) {
        deviceDesc = 'Smartphone Camera (Mobile WebRTC)';
      } else if (isContinuity) {
        deviceDesc = 'iPhone Continuity Camera Active';
      } else if (trackLabel) {
        deviceDesc = `${trackLabel} (Webcam)`;
      }

      setActiveDeviceLabel(deviceDesc);
      setIsStreaming(true);
      setIsSampleVideoActive(false);
      setActiveStreamType('video');
      setIpConnectStatus('connected');
      setOpticalStatus(isMobileDevice ? 'Live Mobile Camera Active' : 'Live Local Camera Active');
      setFps(30);
      setActionSuccessMsg(`${deviceDesc} streaming live!`);
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } catch (playErr) {
      console.warn('Video play error on live camera:', playErr);
      setIsStreaming(true);
      setActiveStreamType('video');
      setIpConnectStatus('connected');
    }
  };

  // Connect to Phone IP Camera Stream (Android IP Webcam / DroidCam / Sample Feeds)
  const handleConnectIpCamera = () => {
    stopAllStreams();
    let url = ipCameraUrl.trim();
    if (!url) {
      setIpConnectStatus('error');
      setIpErrorMsg('Please enter your phone IP address (e.g. 192.168.1.6:8080/video)');
      return;
    }

    // Auto-prepend http:// if omitted and not https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }

    // Auto-normalize IP Webcam root URL (e.g. http://192.168.1.6:8080 -> http://192.168.1.6:8080/video)
    try {
      const parsed = new URL(url);
      if (parsed.port === '8080' && (!parsed.pathname || parsed.pathname === '/')) {
        url = `${url.replace(/\/$/, '')}/video`;
        setIpCameraUrl(url);
      }
    } catch (e) {}

    setIpErrorMsg('');
    setIpConnectStatus('testing');
    setIsStreaming(false);
    setOpticalStatus(`Connecting to phone stream at ${url}...`);

    // If it is a direct video file (like sample videos or mp4/webm stream)
    const isVideoFile = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('mixkit.co');

    if (isVideoFile) {
      setActiveStreamType('video');
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.loop = true;
        videoRef.current.muted = true;
        videoRef.current.onloadeddata = () => {
          setIpConnectStatus('connected');
          setIsStreaming(true);
          setIsSampleVideoActive(url.includes('mixkit.co'));
          setActiveDeviceLabel('Network Video Stream');
          setOpticalStatus('Connected to video stream');
          setFps(30);
          setActionSuccessMsg('Connected to video stream successfully!');
          setTimeout(() => setActionSuccessMsg(null), 3000);
        };
        videoRef.current.onerror = () => {
          setIpConnectStatus('error');
          setIsStreaming(false);
          setOpticalStatus('Video stream unreachable');
          setIpErrorMsg(`Unable to load video stream from ${url}`);
        };
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(e => console.warn(e));
      }
      return;
    }

    // For Phone IP Webcam (MJPEG Stream)
    setActiveStreamType('mjpeg_img');
    setActiveDeviceLabel('Phone IP Camera (Connecting...)');

    if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    
    // Set a 7-second timeout for IP camera response
    connectTimeoutRef.current = setTimeout(() => {
      if (ipConnectStatus !== 'connected') {
        setIpConnectStatus('error');
        setIsStreaming(false);
        setOpticalStatus('Phone stream unreachable');
        setActiveDeviceLabel('Phone IP Camera (Unreachable)');
        setIpErrorMsg(
          `Could not reach phone camera at ${url}.\n` +
          `1. Ensure phone app (e.g. IP Webcam) is running and "Start server" is active.\n` +
          `2. Check that both phone and computer are on the same Wi-Fi network.\n` +
          `3. Alternatively, scan the QR code to run directly on your phone's browser!`
        );
      }
    }, 7000);

    // Trigger image load on ipImageRef
    if (ipImageRef.current) {
      ipImageRef.current.src = url;
    }
  };

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Upload and stream custom video file (.mp4, .webm, .mov, etc.)
  const handleCustomVideoUpload = (file) => {
    if (!file) return;
    stopAllStreams();
    const url = URL.createObjectURL(file);
    setCustomVideoFile(file);
    setCustomVideoUrl(url);
    setIsSampleVideoActive(false);
    setIsStreaming(true);
    setActiveStreamType('video');
    setIpConnectStatus('connected');
    setActiveDeviceLabel(`Custom Video: ${file.name}`);
    setOpticalStatus(`Custom Video: ${file.name}`);
    setFps(30);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = url;
      videoRef.current.loop = isLooping;
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.muted = true;
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch((e) => {
        console.warn('Playback error:', e);
      });
    }
  };

  // Toggle Video Play / Pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  // Seek video to specific timestamp (seconds)
  const handleSeekVideo = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCustomVideoCurrentTime(seconds);
      setTimeout(() => {
        runFrameInference(true);
      }, 100);
    }
  };

  // Change video playback rate
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Load sample video stream for MCD Dashcam mode
  const loadSampleVideo = () => {
    stopAllStreams();
    setIsSampleVideoActive(true);
    setIsStreaming(true);
    setActiveStreamType('video');
    setIpConnectStatus('connected');
    setActiveDeviceLabel('MCD Patrol Dashcam Simulation');
    setOpticalStatus('MCD Patrol Dashcam Simulation Active');
    setFps(30);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = "https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-street-in-the-city-43450-large.mp4";
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    }
  };

  // Disconnect stream cleanly
  const handleDisconnect = () => {
    stopAllStreams();
    setIpConnectStatus('idle');
    setDetections([]);
    setLatestAnalysis(null);
    setOpticalStatus('Stream Disconnected');
    setActiveDeviceLabel('Disconnected');
    setFps(0);
    setActionSuccessMsg('Camera stream stopped.');
    setTimeout(() => setActionSuccessMsg(null), 2500);
  };

  // Stop camera streams
  const stopAllStreams = () => {
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
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

      // Only draw overlays when streaming is active
      if (!isStreaming || ipConnectStatus !== 'connected') {
        return;
      }

      // 1. Targeting Corner Reticles
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 2;
      const reticleSize = 24;
      const margin = 20;

      // Top-Left Reticle
      ctx.beginPath();
      ctx.moveTo(margin, margin + reticleSize);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + reticleSize, margin);
      ctx.stroke();

      // Top-Right Reticle
      ctx.beginPath();
      ctx.moveTo(width - margin - reticleSize, margin);
      ctx.lineTo(width - margin, margin);
      ctx.lineTo(width - margin, margin + reticleSize);
      ctx.stroke();

      // Bottom-Left Reticle
      ctx.beginPath();
      ctx.moveTo(margin, height - margin - reticleSize);
      ctx.lineTo(margin, height - margin);
      ctx.lineTo(margin + reticleSize, height - margin);
      ctx.stroke();

      // Bottom-Right Reticle
      ctx.beginPath();
      ctx.moveTo(width - margin - reticleSize, height - margin);
      ctx.lineTo(width - margin, height - margin);
      ctx.lineTo(width - margin, height - margin - reticleSize);
      ctx.stroke();

      // Center Aiming Crosshair
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 12, height / 2);
      ctx.lineTo(width / 2 + 12, height / 2);
      ctx.moveTo(width / 2, height / 2 - 12);
      ctx.lineTo(width / 2 + 12, height / 2);
      ctx.stroke();

      // 2. Draw Detected Bounding Boxes
      if (detections && detections.length > 0) {
        detections.forEach((det) => {
          const { bbox, label, confidence, severity, roadPotholeDepthEst } = det;
          if (!bbox) return;

          const bx = (bbox.x / 100) * width;
          const by = (bbox.y / 100) * height;
          const bw = (bbox.w / 100) * width;
          const bh = (bbox.h / 100) * height;

          const isCritical = severity === 'critical';
          const boxColor = isCritical ? 'rgba(239, 68, 68, 0.9)' : 'rgba(245, 158, 11, 0.9)';
          const fillColor = isCritical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.12)';

          // Fill Box
          ctx.fillStyle = fillColor;
          ctx.fillRect(bx, by, bw, bh);

          // Border
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(bx, by, bw, bh);

          // Corner Highlights
          ctx.lineWidth = 4;
          const cLen = 8;
          ctx.beginPath();
          ctx.moveTo(bx, by + cLen);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx + cLen, by);

          ctx.moveTo(bx + bw - cLen, by);
          ctx.lineTo(bx + bw, by);
          ctx.lineTo(bx + bw, by + cLen);

          ctx.moveTo(bx, by + bh - cLen);
          ctx.lineTo(bx, by + bh);
          ctx.lineTo(bx + cLen, by + bh);

          ctx.moveTo(bx + bw - cLen, by + bh);
          ctx.lineTo(bx + bw, by + bh);
          ctx.lineTo(bx + bw, by + bh - cLen);
          ctx.stroke();

          // Label Banner
          const labelText = `${label.toUpperCase()} • ${confidence}%`;
          ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
          const textWidth = ctx.measureText(labelText).width;

          ctx.fillStyle = isCritical ? 'rgba(220, 38, 38, 0.95)' : 'rgba(217, 119, 6, 0.95)';
          ctx.fillRect(bx, Math.max(0, by - 22), textWidth + 14, 22);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(labelText, bx + 7, Math.max(15, by - 6));

          // Depth Estimate Badge
          if (roadPotholeDepthEst) {
            const depthText = `Depth: ${roadPotholeDepthEst}`;
            ctx.font = 'bold 10px monospace';
            const depthWidth = ctx.measureText(depthText).width;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(bx, by + bh, depthWidth + 10, 18);
            ctx.fillStyle = '#38bdf8';
            ctx.fillText(depthText, bx + 5, by + bh + 13);
          }
        });
      }

      animationFrameId = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [detections, isStreaming, ipConnectStatus]);

  // Capture current live frame & validate optical luminance
  const captureCurrentFrameBase64 = useCallback(() => {
    if (!isStreaming || ipConnectStatus !== 'connected') return null;

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
  }, [isStreaming, ipConnectStatus, activeStreamType]);

  // Run AI ML Inference on the current live frame
  const runFrameInference = useCallback(async (forceImmediate = false) => {
    if (isAnalyzingFrame || !isStreaming || ipConnectStatus !== 'connected') {
      if (forceImmediate && (!isStreaming || ipConnectStatus !== 'connected')) {
        setActionSuccessMsg('Please start a camera stream first before scanning.');
        setTimeout(() => setActionSuccessMsg(null), 3000);
      }
      return;
    }
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
        isSampleVideo: isSampleVideoActive,
        detectionRate,
        forceDetect: forceImmediate
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
  }, [isAnalyzingFrame, isStreaming, ipConnectStatus, captureCurrentFrameBase64, selectedModel, sensitivity, isSampleVideoActive, soundAlerts, detectionRate]);

  // Periodic AI Scanning Loop
  useEffect(() => {
    if (scanTimerRef.current) clearInterval(scanTimerRef.current);

    if (isAiScanning && isStreaming && ipConnectStatus === 'connected') {
      scanTimerRef.current = setInterval(() => {
        runFrameInference();
      }, scanIntervalSec * 1000);
    }

    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, [isAiScanning, isStreaming, ipConnectStatus, scanIntervalSec, runFrameInference]);

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
    setActionSuccessMsg('Test Pothole anomaly injected onto HUD canvas.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Register active camera as a municipal sentinel node
  const handleRegisterAsCctv = () => {
    if (!isStreaming) return;
    
    const newCam = {
      id: `CAM-LIVE-${Math.floor(100 + Math.random() * 900)}`,
      name: activeMode === 'phone_device' ? 'Field Smartphone Sentinel' : 'Patrol Dashcam Node',
      sourceType: activeMode === 'phone_device' ? 'Mobile WebRTC Phone' : 'IP Stream Sentinel',
      lat: userLocation?.lat || 12.9716,
      lng: userLocation?.lng || 77.5946,
      locality: userLocation?.locality || 'Civil Lines Ward Grid',
      status: 'active',
      fps: fps || 30,
      mlModel: selectedModel,
      detectionCount: detectionHistory.length,
      lastPing: 'Just now'
    };

    if (onRegisterCamera) onRegisterCamera(newCam);
    setActionSuccessMsg(`Camera registered as Municipal Sentinel Node [${newCam.id}]!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Auto-log a civic report from real-time detection
  const handleAutoLogReport = (detection) => {
    const report = {
      id: `REP-LIVE-${Date.now()}`,
      title: `${detection.label} (AI Live Camera)`,
      category: detection.category || 'Roads & Potholes',
      severity: detection.severity || 'high',
      confidence: detection.confidence || 88,
      status: 'PENDING_TRIAGE',
      locality: userLocation?.locality || 'Civil Lines Ward Grid',
      lat: userLocation?.lat || 12.9716,
      lng: userLocation?.lng || 77.5946,
      description: `${detection.description} (Depth Est: ${detection.roadPotholeDepthEst || 'N/A'}). Auto-logged by Civix Live Sentinel.`,
      suggestedAction: detection.suggestedAction || 'Inspect and dispatch road maintenance unit.',
      createdAt: new Date().toISOString(),
      source: 'Mobile Live Camera AI'
    };

    if (onAddReport) onAddReport(report);
    setActionSuccessMsg(`Report logged & correlated to municipal problem cluster (+35 CivicScore pts)!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Run IoT Streetlight Test
  const handleRunIotDiagnosis = () => {
    const res = analyzeStreetlightTelemetry(iotVoltage, iotCurrent, 0.92, iotLux);
    setIotDiagnosis(res);
  };

  // Local Wi-Fi Pairing URL for phone
  const mobileWebUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5173` : 'http://localhost:5173';

  const copyMobileLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(mobileWebUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
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
                  isStreaming && ipConnectStatus === 'connected'
                    ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300' 
                    : ipConnectStatus === 'testing'
                    ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                    : 'bg-slate-700/50 border border-slate-600 text-slate-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isStreaming && ipConnectStatus === 'connected' 
                      ? 'bg-emerald-400 live-pulse' 
                      : ipConnectStatus === 'testing'
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-slate-400'
                  }`}></span>
                  {isStreaming && ipConnectStatus === 'connected' 
                    ? 'Stream Active' 
                    : ipConnectStatus === 'testing' 
                    ? 'Connecting...' 
                    : 'Standby / Disconnected'}
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Active Source: <strong className="text-white">{activeDeviceLabel}</strong> • {getActiveVisionProvider().toUpperCase()} Vision
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-xs font-semibold text-indigo-200 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Scan QR Code to open on Phone Camera"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-300" />
              <span>Connect Phone (QR)</span>
            </button>

            <button
              onClick={() => onOpenApiKeyModal ? onOpenApiKeyModal() : setShowPairingGuide(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-xs font-semibold text-amber-200 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Configure Vision AI Model API Key (Groq, Gemini, OpenAI)"
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>{hasValidApiKey() ? 'API Keys Active' : 'Set AI API Keys'}</span>
            </button>

            <button
              onClick={() => setShowPairingGuide(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-300" />
              <span>Phone Guide</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODE NAVIGATION TABS */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
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
              <span>1. Phone IP Camera (App Stream)</span>
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
              <span>2. Direct Device Camera (WebRTC)</span>
            </button>

            {/* Mode 3: Custom Video File AI Analyzer */}
            <button
              onClick={() => setActiveMode('custom_video')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeMode === 'custom_video'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>3. Upload Video File</span>
            </button>

            {/* Mode 4: MCD Vehicle Mobile Dashcam */}
            <button
              onClick={() => setActiveMode('mcd_dashcam')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeMode === 'mcd_dashcam'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>4. MCD Dashcam Sim</span>
            </button>

            {/* Mode 5: ML Model Test Bench */}
            <button
              onClick={() => setActiveMode('ml_benchmark')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeMode === 'ml_benchmark'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>5. Edge ML & IoT Benchmark</span>
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
              Vision Engine: <strong className={hasValidApiKey() ? 'text-emerald-700 font-bold' : 'text-slate-700 font-bold'}>
                {getActiveVisionProvider().toUpperCase()}
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
                <span className={`w-2 h-2 rounded-full ${isStreaming && ipConnectStatus === 'connected' ? 'bg-red-500 live-pulse' : 'bg-slate-500'}`}></span>
                <span className="font-mono font-bold tracking-wider">
                  {isStreaming && ipConnectStatus === 'connected' ? 'LIVE FEED' : 'STANDBY'}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-[11px] text-slate-300 font-mono">
                  {isStreaming && ipConnectStatus === 'connected' ? `${fps} FPS` : '0 FPS'}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-[11px] text-blue-300 max-w-[160px] truncate">
                  {activeDeviceLabel}
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
              
              {(!isStreaming || ipConnectStatus !== 'connected') && (
                <div className="text-center p-6 space-y-4 max-w-md z-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-blue-400 shadow-inner">
                    {activeMode === 'ip_stream' ? (
                      <Wifi className="w-8 h-8" />
                    ) : activeMode === 'phone_device' ? (
                      <Camera className="w-8 h-8" />
                    ) : activeMode === 'custom_video' ? (
                      <Upload className="w-8 h-8" />
                    ) : (
                      <Car className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-['Outfit']">
                      {activeMode === 'ip_stream' && (ipConnectStatus === 'testing' ? 'Connecting to Phone Camera...' : 'Phone IP Camera Disconnected')}
                      {activeMode === 'phone_device' && 'Direct Camera Lens Ready'}
                      {activeMode === 'custom_video' && 'Custom Video AI Inspector'}
                      {activeMode === 'mcd_dashcam' && 'MCD Patrol Dashcam Ready'}
                      {activeMode === 'ml_benchmark' && 'ML Model Test Bench Active'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {activeMode === 'ip_stream' && (
                        ipConnectStatus === 'testing'
                          ? `Attempting handshake with ${ipCameraUrl}... Please ensure server is running.`
                          : 'Enter your phone IP webcam address on the right panel or scan QR code to stream directly.'
                      )}
                      {activeMode === 'phone_device' && (
                        isMobileDevice
                          ? 'Tap Start Camera to open your phone rear lens with real-time IMU shock detection.'
                          : 'Tap Start Camera to use this device webcam, or scan QR code to use your phone camera.'
                      )}
                      {activeMode === 'custom_video' && 'Select any MP4, WebM, or MOV video file to run continuous real-time AI computer vision.'}
                      {activeMode === 'mcd_dashcam' && 'Click Start Dashcam Stream to inspect municipal patrol road footage.'}
                    </p>
                  </div>

                  {ipErrorMsg && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs text-left">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>Connection Notice:</span>
                      </div>
                      <p className="whitespace-pre-line text-[11px] leading-relaxed">{ipErrorMsg}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {activeMode === 'custom_video' && (
                      <>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Video File (.mp4, .mov, .webm)</span>
                        </button>
                        <button
                          onClick={loadSampleVideo}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Load Demo Video
                        </button>
                      </>
                    )}
                    {activeMode === 'phone_device' && (
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <button
                          onClick={startDeviceCamera}
                          disabled={ipConnectStatus === 'testing'}
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          {ipConnectStatus === 'testing' ? 'Starting Camera...' : 'Start Device Camera'}
                        </button>
                        {!isMobileDevice && (
                          <button
                            onClick={() => setShowQrModal(true)}
                            className="px-3 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-indigo-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Pair Phone via QR</span>
                          </button>
                        )}
                      </div>
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
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <button
                          onClick={handleConnectIpCamera}
                          disabled={ipConnectStatus === 'testing'}
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <Wifi className="w-3.5 h-3.5" />
                          <span>{ipConnectStatus === 'testing' ? 'Verifying Stream...' : 'Connect to Phone Camera'}</span>
                        </button>
                        <button
                          onClick={() => setShowQrModal(true)}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR Pair (Zero App)</span>
                        </button>
                      </div>
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
                onLoadedMetadata={(e) => setCustomVideoDuration(e.target.duration || 0)}
                onTimeUpdate={(e) => setCustomVideoCurrentTime(e.target.currentTime || 0)}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                className={`w-full h-full object-contain ${activeStreamType === 'video' && isStreaming && ipConnectStatus === 'connected' ? 'block' : 'hidden'}`}
              />

              {/* MJPEG Image Stream */}
              <img
                ref={ipImageRef}
                alt="Phone IP Stream"
                onLoad={() => {
                  if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
                  setIpConnectStatus('connected');
                  setIsStreaming(true);
                  setActiveDeviceLabel('Phone IP Camera (Live MJPEG)');
                  setOpticalStatus('Connected to phone IP stream (MJPEG)');
                  setFps(25);
                  setActionSuccessMsg('Phone IP Camera stream connected successfully!');
                  setTimeout(() => setActionSuccessMsg(null), 3000);
                }}
                onError={() => {
                  if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
                  if (activeStreamType === 'mjpeg_img') {
                    setIpConnectStatus('error');
                    setIsStreaming(false);
                    setActiveDeviceLabel('Phone IP Camera (Disconnected)');
                    setOpticalStatus('Phone stream unreachable');
                    setIpErrorMsg(`Unable to reach phone stream at ${ipCameraUrl}. Please check that the IP Webcam app is running ("Start server") and both devices are on the same Wi-Fi.`);
                  }
                }}
                className={`w-full h-full object-contain ${activeStreamType === 'mjpeg_img' && isStreaming && ipConnectStatus === 'connected' ? 'block' : 'hidden'}`}
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
                <span className={`w-1.5 h-1.5 rounded-full ${isStreaming && ipConnectStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span>{opticalStatus}</span>
              </div>
            </div>

            {/* VIDEO TIMELINE SCRUBBER & PLAYBACK CONTROLS (Active in Custom Video Mode) */}
            {activeMode === 'custom_video' && isStreaming && (
              <div className="bg-slate-900/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 mt-2 space-y-1.5 text-white text-xs z-20 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={togglePlayPause}
                    className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shrink-0"
                    title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleSeekVideo(0)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer shrink-0"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Scrubber Range Bar */}
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] text-blue-300 w-11 text-right shrink-0">
                      {formatTime(customVideoCurrentTime)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={customVideoDuration || 100}
                      step="0.1"
                      value={customVideoCurrentTime}
                      onChange={(e) => handleSeekVideo(Number(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="font-mono text-[11px] text-slate-400 w-11 shrink-0">
                      {formatTime(customVideoDuration)}
                    </span>
                  </div>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 shrink-0">
                    {[0.5, 1, 1.5, 2].map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handleSpeedChange(sp)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                          playbackSpeed === sp ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sp}x
                      </button>
                    ))}
                  </div>

                  {/* Loop Button */}
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isLooping ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40' : 'bg-slate-800 text-slate-400'
                    }`}
                    title={isLooping ? 'Looping enabled' : 'Looping disabled'}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin-slow' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {/* BOTTOM HUD ACTION BAR */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAiScanning(!isAiScanning)}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAiScanning ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isAiScanning ? 'AI Scanning: ACTIVE' : 'AI Scanning: PAUSED'}</span>
                </button>

                <button
                  onClick={() => runFrameInference(true)}
                  disabled={!isStreaming || isAnalyzingFrame || ipConnectStatus !== 'connected'}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-40"
                  title="Force an immediate AI defect detection on the current camera frame"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzingFrame ? 'Analyzing Frame...' : 'Scan Frame Now'}</span>
                </button>

                <button
                  onClick={handleInjectTestAnomaly}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Inject test pothole bounding box to verify HUD"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Test Anomaly</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isStreaming && ipConnectStatus === 'connected' && (
                  <button
                    onClick={handleDisconnect}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-red-300 border border-red-800/40 font-bold transition-all cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}

                <button
                  onClick={handleRegisterAsCctv}
                  disabled={!isStreaming || ipConnectStatus !== 'connected'}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-40"
                >
                  <RadioTower className="w-3.5 h-3.5" />
                  <span>Register as Sentinel</span>
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
                      {ipConnectStatus === 'connected' ? 'CONNECTED' : ipConnectStatus === 'testing' ? 'CONNECTING...' : ipConnectStatus === 'error' ? 'DISCONNECTED' : 'STANDBY'}
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
                        if (preset) {
                          if (preset.defaultPort) {
                            setIpCameraUrl(`http://${defaultHost}:${preset.defaultPort}${preset.videoPath}`);
                          } else if (preset.videoPath) {
                            setIpCameraUrl(preset.videoPath);
                          }
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
                      placeholder={`http://${defaultHost}:8080/video`}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono text-slate-800 focus:outline-blue-600"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Open <strong>IP Webcam</strong> on phone, tap "Start server", and enter displayed IP.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleConnectIpCamera}
                      disabled={ipConnectStatus === 'testing'}
                      className="py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Wifi className="w-3.5 h-3.5" />
                      <span>{ipConnectStatus === 'testing' ? 'Verifying...' : 'Connect Stream'}</span>
                    </button>

                    <button
                      onClick={() => setShowQrModal(true)}
                      className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-300"
                    >
                      <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Scan Mobile QR</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. PHONE WEBRTC / DIRECT DEVICE PANEL */}
              {activeMode === 'phone_device' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-600" />
                      Direct Camera Lens (WebRTC)
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isStreaming && ipConnectStatus === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isStreaming && ipConnectStatus === 'connected' ? 'ACTIVE' : 'READY'}
                    </span>
                  </div>

                  {!isMobileDevice && (
                    <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                        <Smartphone className="w-4 h-4 text-indigo-600" />
                        <span>Want to stream from your Phone instead?</span>
                      </div>
                      <p className="text-[11px] text-indigo-800">
                        You are currently on a computer browser. Scan the QR code to open Civix directly on your phone's browser with rear camera zoom & shock sensors!
                      </p>
                      <button
                        onClick={() => setShowQrModal(true)}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>Open Mobile QR Pairer</span>
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Camera Device Input Lens:
                    </label>
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => setSelectedDeviceId(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800 focus:outline-blue-600"
                    >
                      {availableDevices.length > 0 ? (
                        availableDevices.map((d, idx) => (
                          <option key={d.deviceId || idx} value={d.deviceId}>
                            {d.label || `Camera Device ${idx + 1}`}
                          </option>
                        ))
                      ) : (
                        <option value="">Default System Camera</option>
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={startDeviceCamera}
                      disabled={ipConnectStatus === 'testing'}
                      className="py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isStreaming && ipConnectStatus === 'connected' ? 'Restart Camera' : 'Start Camera'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setCameraFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
                        setSelectedDeviceId('');
                      }}
                      className="py-2.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                      <span>Flip: {cameraFacingMode === 'environment' ? 'Rear (Back)' : 'Front (Selfie)'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. CUSTOM VIDEO FILE INSPECTION PANEL */}
              {activeMode === 'custom_video' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileVideo className="w-4 h-4 text-blue-600" />
                      Custom Video AI Inspection
                    </h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      FRAME INFERENCE
                    </span>
                  </div>

                  {/* Video Upload Dropzone */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.[0]) {
                        handleCustomVideoUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 p-4 rounded-xl text-center cursor-pointer transition-all space-y-2"
                  >
                    <Upload className="w-6 h-6 text-blue-600 mx-auto" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {customVideoFile ? customVideoFile.name : 'Click or Drag & Drop Video File'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Supports MP4, WebM, MOV, AVI, MKV (1080p/4K)
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleCustomVideoUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </div>

                  {customVideoFile && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>File Size:</span>
                        <strong className="text-slate-800">{(customVideoFile.size / (1024 * 1024)).toFixed(1)} MB</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>Duration:</span>
                        <strong className="text-slate-800">{formatTime(customVideoDuration)}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>Current Frame:</span>
                        <strong className="text-blue-700 font-mono">{formatTime(customVideoCurrentTime)}</strong>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Different Video</span>
                    </button>
                    <button
                      onClick={loadSampleVideo}
                      className="py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Load city driving sample video"
                    >
                      <span>Demo Sample</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 4. MCD PATROL VEHICLE DASHCAM SIMULATOR */}
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

              {/* 5. SMARTPHONE IMU & IOT SMART LIGHTING BENCHMARK */}
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
                    Computer Vision AI Engine
                  </h3>
                  <button
                    onClick={() => onOpenApiKeyModal ? onOpenApiKeyModal() : null}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                      hasValidApiKey() ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200' : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    }`}
                    title="Change AI Vision Provider (Groq, Gemini, OpenAI)"
                  >
                    <span>{getActiveVisionProvider().toUpperCase()}</span>
                    <Key className="w-2.5 h-2.5 opacity-70" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Select Active Vision Model / API:
                  </label>
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

                {/* Detection Frequency Preset */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1 font-bold text-slate-600">
                    <span>Detection Frequency:</span>
                    <span className="text-blue-700 font-mono">
                      {detectionRate === 1.0 ? '100% (Continuous)' : detectionRate === 0.5 ? '50% (Active Demo)' : '20% (Patrol Interval)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setDetectionRate(0.20)}
                      className={`py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        detectionRate === 0.20 ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      15-20%
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetectionRate(0.50)}
                      className={`py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        detectionRate === 0.50 ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      50% Demo
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetectionRate(1.0)}
                      className={`py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        detectionRate === 1.0 ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      100% Live
                    </button>
                  </div>
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
                    {isStreaming && ipConnectStatus === 'connected' ? (detections.length > 0 ? 'ACTIVE DETECTIONS' : 'SURVEILLANCE OK') : 'STREAM OFFLINE'}
                  </span>
                </div>

                {detections.length === 0 ? (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                    <span>
                      {isStreaming && ipConnectStatus === 'connected' 
                        ? 'No civic anomalies detected in current camera frame.' 
                        : 'Connect a camera stream to begin real-time detection.'}
                    </span>
                    {isStreaming && ipConnectStatus === 'connected' && (
                      <div className="pt-1">
                        <button
                          onClick={handleInjectTestAnomaly}
                          className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                        >
                          Click to test pothole anomaly detection & sound
                        </button>
                      </div>
                    )}
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

        {/* QR CODE MOBILE PAIRING MODAL */}
        {showQrModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-indigo-700" />
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Scan to Stream from Your Smartphone
                  </h3>
                </div>
                <button onClick={() => setShowQrModal(false)} className="text-slate-500 hover:text-slate-800 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-3">
                <p className="text-xs text-slate-600">
                  Point your iPhone or Android camera at this QR code to open Civix directly on your phone with zero app installation:
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block mx-auto shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mobileWebUrl)}`}
                    alt="Mobile Pairing QR Code"
                    className="w-44 h-44 mx-auto rounded-lg"
                  />
                </div>

                <div className="p-3 bg-slate-100 rounded-lg text-left space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">Mobile Web URL:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-blue-700 font-mono text-[11px] flex-1 truncate bg-white p-1.5 rounded border border-slate-200">
                      {mobileWebUrl}
                    </code>
                    <button
                      onClick={copyMobileLink}
                      className="px-2.5 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Ensure phone is connected to the same Wi-Fi network.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}

        {/* PHONE PAIRING & SETUP GUIDE MODAL */}
        {showPairingGuide && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-700" />
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    How to Connect & Stream Your Phone Camera
                  </h3>
                </div>
                <button onClick={() => setShowPairingGuide(false)} className="text-slate-500 hover:text-slate-800 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <strong className="block mb-1">Option A: Direct Phone Browser (Fastest — No App Needed)</strong>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-emerald-800">
                    <li>Scan the QR code or open: <code>{mobileWebUrl}</code> on phone.</li>
                    <li>Tap <strong>Tab 2 (Direct Device Camera)</strong> and allow camera access.</li>
                    <li>Flip to Rear Camera to start real-time road & civic defect scanning!</li>
                  </ol>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                  <strong className="block mb-1">Option B: Android Phone with "IP Webcam" App</strong>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-800">
                    <li>Install free <strong>IP Webcam</strong> from Google Play Store.</li>
                    <li>Ensure phone and laptop are on same Wi-Fi.</li>
                    <li>Scroll to bottom and tap <strong>Start server</strong>.</li>
                    <li>Enter the displayed IP (e.g. <code>http://192.168.x.x:8080/video</code>) into Tab 1!</li>
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
