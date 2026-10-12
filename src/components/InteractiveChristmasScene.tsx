import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Bell,
  Gift,
  TreePine,
  Star,
  RefreshCw,
} from 'lucide-react';

interface FloatingOrnament {
  id: string;
  type: 'star' | 'bell' | 'gift' | 'bauble' | 'candy' | 'crystal';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  color: string;
  emoji: string;
  label: string;
  glowColor: string;
}

interface GoldSparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
  gravity: number;
  rotation: number;
  vRot: number;
  shape: 'star' | 'circle' | 'diamond';
}

interface FloatingTextPopup {
  id: string;
  text: string;
  x: number;
  y: number;
  alpha: number;
  color: string;
}

const FESTIVE_WISHES = [
  '✨ 聖誕快樂 Merry Christmas!',
  '🔔 叮叮噹～金鈴響徹！',
  '🌟 極光願望即將實現！',
  '🎁 幸運與溫暖常伴！',
  '🎄 平安夜溫暖喜樂！',
  '❄️ 北歐冰雪奇緣之旅！',
  '🥂 乾杯！北歐 15 天永恆回憶！',
  '🦌 魯道夫馴鹿捎來祝福！',
];

const ORNAMENT_TYPES: Array<{
  type: FloatingOrnament['type'];
  emoji: string;
  label: string;
  color: string;
  glowColor: string;
}> = [
  { type: 'star', emoji: '🌟', label: '耀眼極星', color: '#fde047', glowColor: 'rgba(253, 224, 71, 0.6)' },
  { type: 'bell', emoji: '🔔', label: '聖誕金鈴', color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.6)' },
  { type: 'gift', emoji: '🎁', label: '驚喜禮物', color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.6)' },
  { type: 'bauble', emoji: '🎄', label: '聖誕晶球', color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.6)' },
  { type: 'candy', emoji: '🍬', label: '薄荷甜糖', color: '#ec4899', glowColor: 'rgba(236, 72, 153, 0.6)' },
  { type: 'crystal', emoji: '❄️', label: '極光雪晶', color: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.6)' },
];

export const InteractiveChristmasScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sceneEnabled, setSceneEnabled] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);

  const particlesRef = useRef<GoldSparkleParticle[]>([]);
  const popupsRef = useRef<FloatingTextPopup[]>([]);
  const ornamentsRef = useRef<FloatingOrnament[]>([]);

  // Synthesize gentle crystalline Christmas bell chimes using Web Audio API
  const playGentleChristmasBell = (pitchMultiplier: number = 1.0) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Christmas bell harmonic series (Fundamental + High metallic bell harmonics)
      const baseFreqs = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0]; // C6, E6, G6, C7, E7
      const now = ctx.currentTime;

      baseFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Mix of sine and triangle for pure metallic bell timbre
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * pitchMultiplier, now + idx * 0.04);

        // Gentle envelope: fast attack, smooth long exponential decay
        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.07 / (idx + 1), startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.75);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.8);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Trigger bursting golden stardust particles at (x, y)
  const spawnGoldDustExplosion = (x: number, y: number, count: number = 40) => {
    const goldPalette = [
      '#fef08a', // Pale Gold
      '#fde047', // Radiant Gold
      '#eab308', // Deep Amber Gold
      '#fbbf24', // Champagne
      '#ffffff', // Diamond Sparkle
      '#f472b6', // Holiday Rose Gold
      '#6ee7b7', // Emerald Spark
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6.5 + 1.5;
      const shapes: Array<'star' | 'circle' | 'diamond'> = ['star', 'circle', 'diamond'];

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 2.5 + 1),
        size: Math.random() * 4.5 + 2.0,
        alpha: 1.0,
        color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
        decay: Math.random() * 0.02 + 0.012,
        gravity: 0.08,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    // Add floating text popup
    const wish = FESTIVE_WISHES[Math.floor(Math.random() * FESTIVE_WISHES.length)];
    popupsRef.current.push({
      id: Math.random().toString(),
      text: wish,
      x,
      y: y - 20,
      alpha: 1.0,
      color: goldPalette[Math.floor(Math.random() * 4)],
    });

    setTotalClicks((prev) => prev + 1);
  };

  // Initialize floating ornaments
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = 9;
    const initialOrnaments: FloatingOrnament[] = [];

    for (let i = 0; i < count; i++) {
      const template = ORNAMENT_TYPES[i % ORNAMENT_TYPES.length];
      initialOrnaments.push({
        id: `ornament-${i}`,
        type: template.type,
        x: (width / (count + 1)) * (i + 1) + (Math.random() * 40 - 20),
        y: Math.random() * (height * 0.6) + 80,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 10 + 36,
        rotation: Math.random() * 0.4 - 0.2,
        vRot: (Math.random() - 0.5) * 0.01,
        color: template.color,
        emoji: template.emoji,
        label: template.label,
        glowColor: template.glowColor,
      });
    }

    ornamentsRef.current = initialOrnaments;
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    if (!sceneEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Global click handler on viewport to produce golden stardust
    const handleGlobalCanvasClick = (e: MouseEvent) => {
      // Check if clicked close to an ornament
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let hitOrnament = false;
      ornamentsRef.current.forEach((ornament) => {
        const dx = clickX - ornament.x;
        const dy = clickY - ornament.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ornament.size + 15) {
          hitOrnament = true;
          // High burst
          spawnGoldDustExplosion(ornament.x, ornament.y, 55);
          playGentleChristmasBell(1.15);

          // Push ornament with impulse
          ornament.vx += (Math.random() - 0.5) * 3;
          ornament.vy -= 3.5;
        }
      });

      if (!hitOrnament) {
        // Click on background
        spawnGoldDustExplosion(clickX, clickY, 28);
        playGentleChristmasBell(0.95 + Math.random() * 0.2);
      }
    };

    window.addEventListener('click', handleGlobalCanvasClick);

    // Helper to draw a sparkling 4-pointed star
    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      rot: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(rot);
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 8;

      context.beginPath();
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? r : r * 0.35;
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.fill();
      context.restore();
    };

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Update & Render Floating Ornaments
      const ornaments = ornamentsRef.current;
      ornaments.forEach((ornament) => {
        // Floating gentle sine wave + velocity
        ornament.x += ornament.vx;
        ornament.y += ornament.vy + Math.sin(frame * 0.03 + ornament.x * 0.01) * 0.25;
        ornament.rotation += ornament.vRot;

        // Screen boundary rebound with damping
        if (ornament.x < 40) {
          ornament.x = 40;
          ornament.vx = Math.abs(ornament.vx) * 0.8;
        } else if (ornament.x > width - 40) {
          ornament.x = width - 40;
          ornament.vx = -Math.abs(ornament.vx) * 0.8;
        }

        if (ornament.y < 70) {
          ornament.y = 70;
          ornament.vy = Math.abs(ornament.vy) * 0.8;
        } else if (ornament.y > height - 100) {
          ornament.y = height - 100;
          ornament.vy = -Math.abs(ornament.vy) * 0.8;
        }

        // Draw glowing aura behind ornament
        ctx.save();
        ctx.shadowColor = ornament.glowColor;
        ctx.shadowBlur = 18;

        // Draw hanging string from top ceiling
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(ornament.x, 0);
        ctx.lineTo(ornament.x, ornament.y - ornament.size * 0.6);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Ornament Background Capsule
        ctx.translate(ornament.x, ornament.y);
        ctx.rotate(ornament.rotation);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.strokeStyle = ornament.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, ornament.size * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw Ornament Emoji
        ctx.font = `${Math.round(ornament.size * 0.85)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ornament.emoji, 0, 1);

        // Small Sparkle on top
        if (frame % 30 === 0 && Math.random() > 0.5) {
          particlesRef.current.push({
            x: ornament.x + (Math.random() * 20 - 10),
            y: ornament.y + (Math.random() * 20 - 10),
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 1.2 - 0.3,
            size: Math.random() * 2 + 1.5,
            alpha: 0.9,
            color: ornament.color,
            decay: 0.03,
            gravity: 0.02,
            rotation: 0,
            vRot: 0.1,
            shape: 'star',
          });
        }

        ctx.restore();
      });

      // 2. Update & Render Golden Stardust Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, p.size * 1.6, p.rotation, p.color, p.alpha);
        } else if (p.shape === 'diamond') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 7;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 3. Update & Render Floating Festive Text Popups
      const popups = popupsRef.current;
      for (let i = popups.length - 1; i >= 0; i--) {
        const pop = popups[i];
        pop.y -= 0.8;
        pop.alpha -= 0.015;

        if (pop.alpha <= 0) {
          popups.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, pop.alpha);
        ctx.font = 'bold 13px "Cinzel", "Noto Serif TC", serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = pop.color;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.fillText(pop.text, pop.x, pop.y);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleGlobalCanvasClick);
      cancelAnimationFrame(animId);
    };
  }, [sceneEnabled, soundEnabled]);

  const triggerGrandGoldShower = () => {
    playGentleChristmasBell(1.0);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Shower from multiple random points
    for (let s = 0; s < 5; s++) {
      const rx = (width / 6) * (s + 1) + (Math.random() * 60 - 30);
      const ry = Math.random() * (height * 0.3) + 100;
      spawnGoldDustExplosion(rx, ry, 30);
    }
  };

  return (
    <>
      {/* Interactive Christmas Particles & Ornaments Fullscreen Overlay */}
      {sceneEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-35"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Floating Interactive Christmas Scene Controller Pill (Top Right under Navbar) */}
      <div className="fixed top-20 right-4 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-amber-500/40 shadow-2xl transition-all select-none print:hidden">
        {/* Festive Icon & Counter */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif font-bold text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="hidden sm:inline">聖誕金粉互動</span>
          {totalClicks > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
              {totalClicks}
            </span>
          )}
        </div>

        {/* Trigger Grand Shower Button */}
        <button
          onClick={triggerGrandGoldShower}
          className="p-1.5 px-2.5 bg-gradient-to-r from-amber-500/20 to-amber-400/10 hover:from-amber-500/40 hover:to-amber-400/30 text-amber-200 hover:text-white rounded-xl text-xs font-semibold border border-amber-500/30 transition-all flex items-center gap-1"
          title="撒下全螢幕聖誕金粉雨"
        >
          <TreePine className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">全螢幕金粉</span>
        </button>

        {/* Gentle Bell Chime Sound Toggle */}
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (!soundEnabled) playGentleChristmasBell(1.0);
          }}
          className={`p-1.5 rounded-xl border transition-colors ${
            soundEnabled
              ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title={soundEnabled ? '點擊靜音聖誕風鈴聲' : '開啟聖誕風鈴音效'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Scene Toggle */}
        <button
          onClick={() => setSceneEnabled(!sceneEnabled)}
          className={`p-1.5 px-2 rounded-xl border text-[11px] font-medium transition-colors ${
            sceneEnabled
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title={sceneEnabled ? '隱藏互動聖誕裝飾' : '顯示互動聖誕裝飾'}
        >
          {sceneEnabled ? '開啟中' : '已暫停'}
        </button>
      </div>
    </>
  );
};
