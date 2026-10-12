import React, { useEffect, useRef, useState } from 'react';
import {
  Snowflake,
  Sparkles,
  Camera,
  Sliders,
  Eye,
  EyeOff,
  Flame,
  Aperture,
  CheckCircle2,
} from 'lucide-react';

interface SnowflakeParticle {
  x: number;
  y: number;
  depth: number; // 0.15 (distant) to 1.0 (foreground)
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swaySpeed: number;
  swayOffset: number;
  isSpecialCrystal: boolean;
  rotation: number;
  rotationSpeed: number;
}

interface MagicSparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  vy: number;
}

interface CursorSparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  vx: number;
  vy: number;
}

interface FireworkSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
}

interface TwinkleStar {
  x: number;
  y: number;
  baseSize: number;
  phase: number;
  speed: number;
  hasSpikes: boolean;
  color: string;
}

export type AuroraFilterMode = 'emerald' | 'violet' | 'solar' | 'off';

export const SnowfallCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snowMode, setSnowMode] = useState<'gentle' | 'blizzard' | 'off'>('gentle');
  const [reindeerActive, setReindeerActive] = useState(true);

  // Aurora Photography Filter State
  const [auroraMode, setAuroraMode] = useState<AuroraFilterMode>('emerald');
  const [showCameraHUD, setShowCameraHUD] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // Mouse / Touch tracking with normalized coords & velocity
  const mousePosRef = useRef<{
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    normX: number; // -1 to 1
    normY: number; // -1 to 1
    active: boolean;
    speed: number;
  }>({
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    normX: 0,
    normY: 0,
    active: false,
    speed: 0,
  });

  // Dynamic Aurora Energy (boosts with mouse movement/touch drag)
  const auroraEnergyRef = useRef<number>(1.0);

  const cursorSparksRef = useRef<CursorSparkle[]>([]);
  const fireworksRef = useRef<FireworkSpark[]>([]);
  const starsRef = useRef<TwinkleStar[]>([]);

  // Reindeer flight state
  const reindeerRef = useRef<{
    x: number;
    y: number;
    speed: number;
    flying: boolean;
    nextFlightTime: number;
    sparks: MagicSparkle[];
  }>({
    x: -250,
    y: 90,
    speed: 3.2,
    flying: true,
    nextFlightTime: 0,
    sparks: [],
  });

  const [reindeerBubble, setReindeerBubble] = useState<string | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);

  const REINDEER_QUOTES = [
    '🦌 魯道夫祝全體同學聖誕快樂！極光滿天！',
    '✨ 叮叮噹～今晚拉普蘭極光指數破表！',
    '🎄 伴隨《所以我放棄了音樂》一起漫遊北歐！',
    '🌟 願同學在北歐十五天留下最燦爛浪漫的回憶！',
    '🔔 馴鹿雪橇已經準備就緒，出發追逐極光囉！',
  ];

  const playChristmasChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + index * 0.08 + 0.45
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.08);
        osc.stop(ctx.currentTime + index * 0.08 + 0.5);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const playCameraShutterSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      // Mechanical shutter click & mirror flap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);

      // Chime after capture
      setTimeout(() => {
        playChristmasChime();
      }, 150);
    } catch {
      // Audio policy fallback
    }
  };

  // Trigger Camera Snapshot Flash
  const triggerSnapshot = () => {
    playCameraShutterSound();
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 300);

    const modeLabels: Record<AuroraFilterMode, string> = {
      emerald: '拉普蘭翡翠極光光譜',
      violet: '特羅姆瑟紫霓極光',
      solar: '雷克雅維克太陽風暴',
      off: '純淨北歐星空',
    };

    setSnapshotToast(`📸 極光大片已定格！【${modeLabels[auroraMode]} · KP 8.6 強度】`);
    setTimeout(() => setSnapshotToast(null), 4000);
  };

  useEffect(() => {
    if (snowMode === 'off' && !reindeerActive && auroraMode === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    // Initialize Twinkling Star Field strictly along perimeter border edges
    const initStars = () => {
      const starList: TwinkleStar[] = [];
      const starCount = Math.floor((width + height) / 35);
      for (let i = 0; i < starCount; i++) {
        // Place stars along top edge (70%), left edge (15%), right edge (15%)
        let sx = 0;
        let sy = 0;
        const edgeChoice = Math.random();

        if (edgeChoice < 0.7) {
          // Top perimeter rim (y: 0 to 75px)
          sx = Math.random() * width;
          sy = Math.random() * 75;
        } else if (edgeChoice < 0.85) {
          // Left perimeter rim (x: 0 to 60px)
          sx = Math.random() * 60;
          sy = Math.random() * height;
        } else {
          // Right perimeter rim (x: width - 60px to width)
          sx = width - Math.random() * 60;
          sy = Math.random() * height;
        }

        starList.push({
          x: sx,
          y: sy,
          baseSize: Math.random() * 1.6 + 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.04 + 0.015,
          hasSpikes: Math.random() > 0.7,
          color:
            Math.random() > 0.4
              ? '#ffffff'
              : Math.random() > 0.5
              ? '#6ee7b7'
              : '#c084fc',
        });
      }
      starsRef.current = starList;
    };
    initStars();

    // Track mouse / touch position & energy
    const updateMotion = (clientX: number, clientY: number) => {
      const prev = mousePosRef.current;
      const dx = clientX - (prev.x === -1000 ? clientX : prev.x);
      const dy = clientY - (prev.y === -1000 ? clientY : prev.y);
      const dist = Math.sqrt(dx * dx + dy * dy);

      const normX = (clientX - width / 2) / (width / 2);
      const normY = (clientY - height / 2) / (height / 2);

      mousePosRef.current = {
        x: clientX,
        y: clientY,
        prevX: prev.x,
        prevY: prev.y,
        normX: Math.max(-1, Math.min(1, normX)),
        normY: Math.max(-1, Math.min(1, normY)),
        active: true,
        speed: dist,
      };

      // Boost aurora energy on movement
      auroraEnergyRef.current = Math.min(2.8, auroraEnergyRef.current + dist * 0.015);

      // Spawn fairy dust sparkles with holiday colors
      if (Math.random() > 0.35) {
        const colors =
          auroraMode === 'emerald'
            ? ['#34d399', '#6ee7b7', '#a7f3d0', '#fde047', '#ffffff']
            : auroraMode === 'violet'
            ? ['#c084fc', '#e879f9', '#f472b6', '#38bdf8', '#ffffff']
            : ['#fde047', '#fb923c', '#f87171', '#34d399', '#ffffff'];

        cursorSparksRef.current.push({
          x: clientX + (Math.random() * 14 - 7),
          y: clientY + (Math.random() * 14 - 7),
          size: Math.random() * 2.8 + 1.2,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1.8,
          vy: Math.random() * 1.4 + 0.2,
        });

        if (cursorSparksRef.current.length > 70) {
          cursorSparksRef.current.shift();
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMotion(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        updateMotion(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const particleCount = snowMode === 'blizzard' ? 150 : 75;
    const flakes: SnowflakeParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random() * 0.85 + 0.15; // 0.15 (far) to 1.0 (near)
      const isSpecial = Math.random() > 0.75;
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        depth,
        radius: depth * (snowMode === 'blizzard' ? 4 : 3) + 0.8,
        speedY: depth * (snowMode === 'blizzard' ? 2.8 : 1.4) + 0.5,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: Math.min(0.95, depth * 0.6 + 0.25),
        swaySpeed: Math.random() * 0.02 + 0.008,
        swayOffset: Math.random() * Math.PI * 2,
        isSpecialCrystal: isSpecial,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
      });
    }

    let frame = 0;
    let smoothParallaxX = 0;
    let smoothParallaxY = 0;

    // Helper to draw a 6-pointed crystalline snowflake
    const drawCrystalFlake = (
      cx: number,
      cy: number,
      r: number,
      rot: number,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = r > 3 ? 1.5 : 1;
      ctx.beginPath();
      for (let arm = 0; arm < 6; arm++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r * 1.6);
        if (r > 2.5) {
          ctx.moveTo(0, -r * 0.8);
          ctx.lineTo(r * 0.4, -r * 1.1);
          ctx.moveTo(0, -r * 0.8);
          ctx.lineTo(-r * 0.4, -r * 1.1);
        }
        ctx.rotate(Math.PI / 3);
      }
      ctx.stroke();
      ctx.restore();
    };

    // Helper to draw reindeer silhouette & Santa sleigh
    const drawReindeerSleigh = (x: number, y: number, time: number) => {
      ctx.save();
      ctx.translate(x, y);

      const wave = Math.sin(time * 0.05) * 6;
      ctx.translate(0, wave);

      // Draw Santa Sleigh
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(-15, 6);
      ctx.bezierCurveTo(-5, 12, 20, 12, 30, 4);
      ctx.lineTo(34, 8);
      ctx.lineTo(32, 10);
      ctx.bezierCurveTo(20, 16, -10, 16, -20, 8);
      ctx.closePath();
      ctx.fill();

      // Sleigh seat & gifts sack
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-8, 2, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(-4, -1, 4, 0, Math.PI * 2);
      ctx.fill();

      // Santa Hat
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(5, -6);
      ctx.lineTo(12, -6);
      ctx.lineTo(8, -14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -14, 2, 0, Math.PI * 2);
      ctx.fill();

      // Golden Reins Line
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(65, 2);
      ctx.stroke();

      // Draw Reindeer (Rudolph)
      ctx.translate(65, 0);

      const gallop = Math.sin(time * 0.15) * 0.2;
      ctx.rotate(gallop);

      // Reindeer Body
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Reindeer Neck & Head
      ctx.beginPath();
      ctx.ellipse(12, -7, 6, 4, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Red Nose (Rudolph)
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(17, -8, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Golden Antlers
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(10, -10);
      ctx.lineTo(8, -19);
      ctx.lineTo(5, -22);
      ctx.moveTo(8, -15);
      ctx.lineTo(12, -18);
      ctx.stroke();

      // Moving Legs
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      const leg1 = Math.sin(time * 0.15) * 8;
      const leg2 = Math.cos(time * 0.15) * 8;

      ctx.beginPath();
      ctx.moveTo(-6, 4);
      ctx.lineTo(-10 + leg1, 15);
      ctx.moveTo(6, 4);
      ctx.lineTo(10 - leg2, 15);
      ctx.stroke();

      ctx.restore();
    };

    // Helper to render Aurora Photography Ribbon Spectrums
    const drawAuroraBorders = (t: number, energy: number) => {
      const mouseX = mousePosRef.current.x;
      const normX = mousePosRef.current.normX;

      // Color palette configuration
      const palettes = {
        emerald: {
          primary: 'rgba(16, 185, 129, ',
          secondary: 'rgba(6, 182, 212, ',
          accent: 'rgba(168, 85, 247, ',
          highlight: 'rgba(253, 224, 71, ',
        },
        violet: {
          primary: 'rgba(168, 85, 247, ',
          secondary: 'rgba(236, 72, 153, ',
          accent: 'rgba(56, 189, 248, ',
          highlight: 'rgba(244, 114, 182, ',
        },
        solar: {
          primary: 'rgba(245, 158, 11, ',
          secondary: 'rgba(239, 68, 68, ',
          accent: 'rgba(16, 185, 129, ',
          highlight: 'rgba(254, 240, 138, ',
        },
        off: {
          primary: 'rgba(0,0,0,',
          secondary: 'rgba(0,0,0,',
          accent: 'rgba(0,0,0,',
          highlight: 'rgba(0,0,0,',
        },
      };

      const pal = palettes[auroraMode];

      // 1. Draw Top Edge Aurora Ribbon (strictly confined to top 45px - 70px)
      const curtainLayers = 2;
      for (let layer = 0; layer < curtainLayers; layer++) {
        ctx.save();
        const baseAlpha = (0.22 + layer * 0.1) * Math.min(1.4, energy);
        const yOffset = 18 + layer * 14;
        const waveSpeed = t * (0.015 + layer * 0.008);

        // Top Gradient confined strictly to top 65px
        const grad = ctx.createLinearGradient(0, 0, 0, 55 + layer * 20);
        if (layer === 0) {
          grad.addColorStop(0, `${pal.accent}${baseAlpha * 1.3})`);
          grad.addColorStop(0.35, `${pal.primary}${baseAlpha * 1.4})`);
          grad.addColorStop(0.7, `${pal.secondary}${baseAlpha * 0.6})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
        } else {
          grad.addColorStop(0, `${pal.primary}${baseAlpha})`);
          grad.addColorStop(0.4, `${pal.secondary}${baseAlpha * 1.2})`);
          grad.addColorStop(0.8, `${pal.highlight}${baseAlpha * 0.5})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);

        // Draw tight harmonic waving bottom edge along top rim
        const step = 30;
        for (let x = 0; x <= width + step; x += step) {
          const mouseInfluence =
            mouseX !== -1000 ? Math.sin(((x - mouseX) / width) * Math.PI) * 12 : 0;
          const sine1 = Math.sin(x * 0.006 + waveSpeed + normX * 0.6) * 12;
          const sine2 = Math.cos(x * 0.012 - waveSpeed * 1.1) * 8;
          const y = yOffset + sine1 + sine2 + mouseInfluence;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw Left & Right Side Perimeter Rim Glows (strictly outer 45px)
      const edgeGradLeft = ctx.createLinearGradient(0, 0, 50, 0);
      edgeGradLeft.addColorStop(0, `${pal.primary}${0.3 * energy})`);
      edgeGradLeft.addColorStop(0.6, `${pal.secondary}${0.12 * energy})`);
      edgeGradLeft.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = edgeGradLeft;
      ctx.fillRect(0, 0, 50, height);

      const edgeGradRight = ctx.createLinearGradient(width, 0, width - 50, 0);
      edgeGradRight.addColorStop(0, `${pal.accent}${0.3 * energy})`);
      edgeGradRight.addColorStop(0.6, `${pal.secondary}${0.12 * energy})`);
      edgeGradRight.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = edgeGradRight;
      ctx.fillRect(width - 50, 0, 50, height);

      // 3. Draw Bottom Screen Perimeter Rim Glow (strictly bottom 30px)
      const edgeGradBottom = ctx.createLinearGradient(0, height, 0, height - 30);
      edgeGradBottom.addColorStop(0, `${pal.primary}${0.18 * energy})`);
      edgeGradBottom.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = edgeGradBottom;
      ctx.fillRect(0, height - 30, width, 30);

      // 4. Draw Short Vertical Rim Ray Flares (strictly top 45px - 65px)
      const rayCount = 7;
      for (let r = 0; r < rayCount; r++) {
        const rx = (width / (rayCount + 1)) * (r + 1) + Math.sin(t * 0.02 + r) * 30;
        const rayWidth = 20 + Math.sin(t * 0.03 + r * 2) * 8;
        const rayHeight = 45 + Math.sin(t * 0.02 + r) * 18;

        const rayGrad = ctx.createLinearGradient(rx, 0, rx, rayHeight);
        rayGrad.addColorStop(0, `${pal.highlight}${0.32 * energy})`);
        rayGrad.addColorStop(0.5, `${pal.primary}${0.2 * energy})`);
        rayGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.save();
        ctx.fillStyle = rayGrad;
        ctx.fillRect(rx - rayWidth / 2, 0, rayWidth, rayHeight);
        ctx.restore();
      }
    };

    // Helper to draw twinkling star field
    const drawTwinklingStars = (t: number) => {
      const stars = starsRef.current;
      const mouseX = mousePosRef.current.x;
      const mouseY = mousePosRef.current.y;

      stars.forEach((star) => {
        const distToMouse =
          mouseX !== -1000
            ? Math.hypot(star.x - mouseX, star.y - mouseY)
            : 1000;
        const proximityBoost = distToMouse < 160 ? (160 - distToMouse) / 160 : 0;

        const twinkle = Math.sin(t * star.speed + star.phase);
        const alpha = Math.max(0.2, (twinkle * 0.5 + 0.5) * 0.85 + proximityBoost * 0.6);
        const size = star.baseSize * (1 + proximityBoost * 0.8);

        ctx.save();
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = proximityBoost > 0 ? 8 : 4;
        ctx.globalAlpha = Math.min(1, alpha);

        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Starburst spikes on prominent stars or nearby cursor
        if (star.hasSpikes || proximityBoost > 0.4) {
          const spikeLen = size * (3.5 + proximityBoost * 3);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(star.x - spikeLen, star.y);
          ctx.lineTo(star.x + spikeLen, star.y);
          ctx.moveTo(star.x, star.y - spikeLen);
          ctx.lineTo(star.x, star.y + spikeLen);
          ctx.stroke();
        }

        ctx.restore();
      });
    };

    // Main animation render cycle
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Ease aurora energy back towards baseline
      auroraEnergyRef.current += (1.0 - auroraEnergyRef.current) * 0.02;

      // 1. Render Aurora Photography Filter Spectrums & Twinkling Stars
      if (auroraMode !== 'off') {
        drawAuroraBorders(frame, auroraEnergyRef.current);
        drawTwinklingStars(frame);
      }

      // 2. Parallax Camera & Snow Particles
      if (snowMode !== 'off') {
        const mouseX = mousePosRef.current.x;
        const mouseY = mousePosRef.current.y;
        const mouseActive = mousePosRef.current.active;
        const targetParallaxX = mousePosRef.current.normX * 30;
        const targetParallaxY = mousePosRef.current.normY * 18;

        smoothParallaxX += (targetParallaxX - smoothParallaxX) * 0.05;
        smoothParallaxY += (targetParallaxY - smoothParallaxY) * 0.05;

        const windDrift = Math.sin(frame * 0.01) * 0.5;

        flakes.forEach((flake) => {
          flake.rotation += flake.rotationSpeed;
          flake.swayOffset += flake.swaySpeed;
          flake.speedX = Math.sin(flake.swayOffset) * 0.8;

          if (mouseActive) {
            const dx = flake.x - mouseX;
            const dy = flake.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              const force = (140 - dist) / 140;
              flake.x += (dx / dist) * force * (3.8 * flake.depth);
              flake.y += (dy / dist) * force * (2.4 * flake.depth);
            }
          }

          flake.y += flake.speedY;
          flake.x += flake.speedX + windDrift;

          if (flake.y > height + 20) {
            flake.y = -20;
            flake.x = Math.random() * width;
          }
          if (flake.x > width + 30) {
            flake.x = -20;
          } else if (flake.x < -30) {
            flake.x = width + 20;
          }

          const renderX = flake.x - smoothParallaxX * flake.depth;
          const renderY = flake.y - smoothParallaxY * flake.depth * 0.6;

          if (flake.isSpecialCrystal && flake.depth > 0.4) {
            drawCrystalFlake(
              renderX,
              renderY,
              flake.radius * 1.5,
              flake.rotation,
              flake.opacity
            );
          } else {
            ctx.beginPath();
            ctx.arc(renderX, renderY, flake.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240, 248, 255, ${flake.opacity})`;
            if (flake.depth > 0.7) {
              ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
              ctx.shadowBlur = 5;
            } else {
              ctx.shadowBlur = 0;
            }
            ctx.fill();
          }
        });
      }

      // 3. Render Reindeer Sleigh Flight
      if (reindeerActive) {
        const r = reindeerRef.current;

        if (r.flying) {
          r.x += r.speed;

          if (frame % 3 === 0) {
            r.sparks.push({
              x: r.x + Math.random() * 20 - 10,
              y: r.y + Math.sin(frame * 0.05) * 6 + 10 + (Math.random() * 12 - 6),
              size: Math.random() * 3 + 1,
              opacity: 1,
              color: Math.random() > 0.4 ? '#fef08a' : '#67e8f9',
              vy: Math.random() * 0.8 + 0.2,
            });
          }

          drawReindeerSleigh(
            r.x - smoothParallaxX * 0.3,
            r.y - smoothParallaxY * 0.2,
            frame
          );

          if (r.x > width + 260) {
            r.flying = false;
            r.nextFlightTime = Date.now() + 18000;
          }
        } else {
          if (Date.now() > r.nextFlightTime) {
            r.x = -260;
            r.y = Math.random() * (height * 0.35) + 60;
            r.speed = Math.random() * 1.5 + 2.5;
            r.flying = true;
          }
        }

        for (let i = r.sparks.length - 1; i >= 0; i--) {
          const sp = r.sparks[i];
          sp.y += sp.vy;
          sp.opacity -= 0.016;

          if (sp.opacity <= 0) {
            r.sparks.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(
            sp.x - smoothParallaxX * 0.3,
            sp.y - smoothParallaxY * 0.2,
            sp.size,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = sp.color;
          ctx.shadowColor = sp.color;
          ctx.shadowBlur = 6;
          ctx.globalAlpha = Math.max(0, sp.opacity);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // 4. Render Mouse Cursor Fairy Dust Sparkles
      const cursorSparks = cursorSparksRef.current;
      for (let i = cursorSparks.length - 1; i >= 0; i--) {
        const cs = cursorSparks[i];
        cs.x += cs.vx;
        cs.y += cs.vy;
        cs.opacity -= 0.035;

        if (cs.opacity <= 0) {
          cursorSparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, cs.opacity);
        ctx.fillStyle = cs.color;
        ctx.shadowColor = cs.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cs.x, cs.y, cs.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Render Fireworks Burst Particles
      const fireworks = fireworksRef.current;
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.vy += 0.04;
        fw.vx *= 0.98;
        fw.alpha -= fw.decay;

        if (fw.alpha <= 0) {
          fireworks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, fw.alpha);
        ctx.fillStyle = fw.color;
        ctx.shadowColor = fw.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [snowMode, reindeerActive, auroraMode]);

  const cycleSnowMode = () => {
    if (snowMode === 'gentle') setSnowMode('blizzard');
    else if (snowMode === 'blizzard') setSnowMode('off');
    else setSnowMode('gentle');
  };

  const cycleAuroraMode = () => {
    if (auroraMode === 'emerald') setAuroraMode('violet');
    else if (auroraMode === 'violet') setAuroraMode('solar');
    else if (auroraMode === 'solar') setAuroraMode('off');
    else setAuroraMode('emerald');
  };

  const triggerReindeerFlight = () => {
    playChristmasChime();
    reindeerRef.current.x = -260;
    reindeerRef.current.y = 80;
    reindeerRef.current.flying = true;
    setReindeerActive(true);

    const quote =
      REINDEER_QUOTES[Math.floor(Math.random() * REINDEER_QUOTES.length)];
    setReindeerBubble(quote);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = window.setTimeout(() => {
      setReindeerBubble(null);
    }, 4500);
  };

  const launchFireworks = () => {
    playChristmasChime();
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#a855f7', '#ec4899', '#fde047'];
    const centerX = window.innerWidth * (0.3 + Math.random() * 0.4);
    const centerY = window.innerHeight * (0.2 + Math.random() * 0.25);
    const burstColor = colors[Math.floor(Math.random() * colors.length)];
    const sparkCount = 45;

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() * 0.2 - 0.1);
      const speed = Math.random() * 4.5 + 2.0;
      fireworksRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.3 ? burstColor : '#ffffff',
        alpha: 1,
        decay: Math.random() * 0.018 + 0.012,
        size: Math.random() * 3 + 1.5,
      });
    }
  };

  return (
    <>
      {/* Background Interactive Snow, Aurora Spectrum & Reindeer Canvas */}
      {(snowMode !== 'off' || reindeerActive || auroraMode !== 'off') && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-1000"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Shutter Flash White Overlay Animation */}
      {shutterFlash && (
        <div className="fixed inset-0 z-50 bg-white opacity-80 pointer-events-none transition-opacity duration-300 animate-out fade-out" />
      )}

      {/* Camera Photography Snapshot Floating Toast */}
      {snapshotToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 bg-slate-900/95 text-white font-serif font-bold rounded-2xl shadow-2xl border border-emerald-400 backdrop-blur-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm text-emerald-200">{snapshotToast}</span>
        </div>
      )}

      {/* Optional Pro Camera Photography Viewfinder HUD Overlay */}
      {showCameraHUD && auroraMode !== 'off' && (
        <div className="fixed inset-0 pointer-events-none z-35 flex flex-col justify-between p-6 select-none">
          {/* Four Corner Framing Brackets */}
          <div className="flex justify-between">
            <div className="w-8 h-8 border-t-2 border-l-2 border-amber-400/70" />
            <div className="w-8 h-8 border-t-2 border-r-2 border-amber-400/70" />
          </div>

          {/* Central Focus Reticle & Horizon Line */}
          <div className="self-center flex flex-col items-center opacity-70">
            <div className="w-16 h-16 rounded-full border border-dashed border-emerald-400/60 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] font-mono text-emerald-300 mt-2 bg-slate-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              AURORA PRO PROJECTION · AF-ON
            </div>
          </div>

          {/* Bottom Camera Parameter HUD */}
          <div className="flex items-end justify-between">
            <div className="w-8 h-8 border-b-2 border-l-2 border-amber-400/70" />
            <div className="flex items-center gap-4 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-amber-400 font-bold">14mm f/1.4</span>
              <span>15s EXP</span>
              <span className="text-emerald-400 font-bold">ISO 3200</span>
              <span className="text-sky-400">EV +0.7</span>
              <span className="text-purple-400 font-bold">KP 8.6★</span>
            </div>
            <div className="w-8 h-8 border-b-2 border-r-2 border-amber-400/70" />
          </div>
        </div>
      )}

      {/* Floating Control Toolbar (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2 select-none print:hidden">
        {/* Reindeer Speech Bubble */}
        {reindeerBubble && (
          <div className="animate-bounce bg-slate-900/95 text-amber-200 border border-amber-500/50 px-3.5 py-2 rounded-2xl text-xs font-serif font-semibold shadow-2xl backdrop-blur-md max-w-xs flex items-center gap-2">
            <span>{reindeerBubble}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {/* Aurora Photography Filter Mode Toggle Button */}
          <button
            onClick={cycleAuroraMode}
            className={`p-2.5 px-3 rounded-full shadow-2xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs border ${
              auroraMode === 'emerald'
                ? 'bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border-emerald-500/60 ring-2 ring-emerald-500/30'
                : auroraMode === 'violet'
                ? 'bg-purple-950/90 hover:bg-purple-900 text-purple-300 border-purple-500/60 ring-2 ring-purple-500/30'
                : auroraMode === 'solar'
                ? 'bg-amber-950/90 hover:bg-amber-900 text-amber-300 border-amber-500/60 ring-2 ring-amber-500/30'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="切換極光攝影濾鏡（翡翠極光 / 紫霓極光 / 太陽風暴 / 關閉）"
          >
            <Sparkles
              className={`w-4 h-4 ${
                auroraMode === 'emerald'
                  ? 'text-emerald-400 animate-spin'
                  : auroraMode === 'violet'
                  ? 'text-purple-400 animate-spin'
                  : auroraMode === 'solar'
                  ? 'text-amber-400 animate-spin'
                  : 'text-slate-500'
              }`}
              style={{ animationDuration: '6s' }}
            />
            <span className="font-semibold hidden sm:inline">
              {auroraMode === 'emerald'
                ? '翡翠極光'
                : auroraMode === 'violet'
                ? '紫霓極光'
                : auroraMode === 'solar'
                ? '太陽風暴'
                : '極光濾鏡關'}
            </span>
          </button>

          {/* Camera Shutter Snapshot Button */}
          {auroraMode !== 'off' && (
            <button
              onClick={triggerSnapshot}
              className="p-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-full shadow-2xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs hover:scale-105 active:scale-95"
              title="定格並拍攝當前極光大片！"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden md:inline">極光快門</span>
            </button>
          )}

          {/* Toggle Camera HUD Viewfinder Button */}
          {auroraMode !== 'off' && (
            <button
              onClick={() => setShowCameraHUD(!showCameraHUD)}
              className={`p-2.5 rounded-full border transition-colors shadow-2xl backdrop-blur-md ${
                showCameraHUD
                  ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-white'
              }`}
              title={showCameraHUD ? '隱藏攝影取景框' : '開啟專業攝影取景框'}
            >
              <Aperture className="w-4 h-4" />
            </button>
          )}

          {/* Snow Mode Toggle Button */}
          <button
            onClick={cycleSnowMode}
            className="p-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 rounded-full shadow-2xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs"
            title="切換聖誕下雪特效（3D 視差飄雪 / 極地風雪 / 關閉）"
          >
            <Snowflake
              className={`w-4 h-4 ${
                snowMode === 'off'
                  ? 'text-slate-500'
                  : snowMode === 'blizzard'
                  ? 'text-cyan-300 animate-spin'
                  : 'text-emerald-400'
              }`}
              style={{ animationDuration: '8s' }}
            />
            <span className="hidden sm:inline font-medium">
              {snowMode === 'gentle'
                ? '3D 視差飄雪'
                : snowMode === 'blizzard'
                ? '極地暴風雪'
                : '雪花暫停'}
            </span>
          </button>

          {/* Interactive Fireworks Button */}
          <button
            onClick={launchFireworks}
            className="p-2.5 px-3 bg-gradient-to-r from-amber-950/80 to-purple-950/80 hover:from-amber-900 hover:to-purple-900 text-amber-300 hover:text-white border border-amber-500/40 rounded-full shadow-2xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs group hover:scale-105 active:scale-95"
            title="施放北歐跨年璀璨煙火！"
          >
            <span className="group-hover:scale-125 transition-transform">🎆</span>
            <span className="font-semibold text-amber-300 hidden sm:inline">跨年煙火</span>
          </button>

          {/* Interactive Reindeer Mascot Button */}
          <button
            onClick={triggerReindeerFlight}
            className="p-2.5 px-3.5 bg-gradient-to-r from-amber-950/90 to-rose-950/90 hover:from-amber-900 hover:to-rose-900 text-amber-200 hover:text-white border border-amber-500/50 rounded-full shadow-2xl backdrop-blur-md transition-all flex items-center gap-2 text-xs group hover:scale-105 active:scale-95"
            title="點擊讓聖誕馴鹿雪橇劃過夜空並奏響聖誕風鈴！"
          >
            <span className="text-base group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300">
              🦌
            </span>
            <span className="font-semibold text-amber-300 hidden sm:inline">馴鹿雪橇</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </button>
        </div>
      </div>
    </>
  );
};
