import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Compass,
  X,
  Volume2,
  VolumeX,
  Clock,
  MapPin,
  Wind,
  Ticket,
  Bell,
  Star,
  Check,
} from 'lucide-react';

interface PolarExpressIntroProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  type: 'smoke' | 'spark' | 'snow' | 'goldDust' | 'confetti';
  color?: string;
  rotation?: number;
  vRot?: number;
}

export const PolarExpressIntro: React.FC<PolarExpressIntroProps> = ({
  onComplete,
}) => {
  // Sequence phase: 'entering' (高速進站) -> 'braking' (減速煞車放氣) -> 'docked' (進站靠站停穩)
  const [phase, setPhase] = useState<'entering' | 'braking' | 'docked'>('entering');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isShaking, setIsShaking] = useState(true);
  const [ticketPunched, setTicketPunched] = useState(false);
  const [selectedPunchWord, setSelectedPunchWord] = useState<'BELIEVE' | 'LEAD' | 'TRUST' | 'EXPLORE'>('BELIEVE');
  const [bellRinging, setBellRinging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthesizer for Movie-Accurate Bell, Whistle, and Steam
  const playStationAudio = (type: 'whistle' | 'hiss' | 'bell' | 'punch') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      if (type === 'whistle') {
        // Deep Resonant Steam Whistle (D4, A4, D5, F#5 chords)
        [293.66, 440.0, 587.33, 739.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = idx === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 1.2);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.09, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 2.6);
        });
      } else if (type === 'bell') {
        // Brass Locomotive Bell ("Ding!")
        [1046.5, 2093.0].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.15 / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.25);
        });
      } else if (type === 'hiss') {
        // Steam Brake Release Hiss
        const bufferSize = ctx.sampleRate * 2.0;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + 1.8);
        filter.Q.setValueAtTime(2.5, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 2.0);
      } else if (type === 'punch') {
        // Ticket Puncher "Chunk-Ding"
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      }
    } catch {
      // Audio fallback
    }
  };

  // High-Performance Particle Engine (Snowstorm, Steam Vortex, Golden Sparkles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial Blizzard snowdrifts
    const particles: Particle[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: -(Math.random() * 2 + 1),
        vy: Math.random() * 2 + 1.5,
        size: Math.random() * 2.8 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        maxAlpha: 1,
        life: 0,
        maxLife: 350,
        type: 'snow',
      });
    }
    particlesRef.current = particles;

    let lastTime = performance.now();

    const render = (now: number) => {
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Aurora Borealis Night Sky Waves
      const timeSec = now * 0.001;
      const grad = ctx.createLinearGradient(0, 0, width, height * 0.45);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= width; x += 40) {
        const y = Math.sin(x * 0.003 + timeSec * 1.2) * 45 + Math.cos(x * 0.007 + timeSec * 0.8) * 30 + 120;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, 0);
      ctx.closePath();
      ctx.fill();

      // Train Center Coordinates
      const trainCenterY = height * 0.55;
      const chimneyX = width * 0.65;
      const chimneyY = trainCenterY - 90;
      const wheelBaseY = trainCenterY + 120;

      // Chimney Volumetric Steam Vortex
      if (Math.random() < 0.85) {
        particles.push({
          x: chimneyX + (Math.random() - 0.5) * 20,
          y: chimneyY,
          vx: -(Math.random() * 3.5 + 2.5),
          vy: -(Math.random() * 2.5 + 2),
          size: Math.random() * 16 + 12,
          alpha: 0.85,
          maxAlpha: 0.85,
          life: 0,
          maxLife: 95,
          type: 'smoke',
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.05,
        });
      }

      // Rail Friction Sparks
      if (phase === 'braking' || phase === 'entering') {
        const sparkRate = phase === 'braking' ? 6 : 2;
        for (let s = 0; s < sparkRate; s++) {
          particles.push({
            x: width * 0.35 + Math.random() * (width * 0.4),
            y: wheelBaseY + (Math.random() - 0.5) * 6,
            vx: -(Math.random() * 9 + 4),
            vy: -(Math.random() * 4 + 1),
            size: Math.random() * 3 + 1.5,
            alpha: 1,
            maxAlpha: 1,
            life: 0,
            maxLife: 35,
            type: 'spark',
            color: Math.random() > 0.4 ? '#fbbf24' : '#f97316',
          });
        }
      }

      // Golden Stardust & Confetti
      if (ticketPunched) {
        for (let c = 0; c < 3; c++) {
          particles.push({
            x: width * 0.5 + (Math.random() - 0.5) * 200,
            y: height * 0.75 + (Math.random() - 0.5) * 50,
            vx: (Math.random() - 0.5) * 8,
            vy: -(Math.random() * 6 + 3),
            size: Math.random() * 4 + 2,
            alpha: 1,
            maxAlpha: 1,
            life: 0,
            maxLife: 50,
            type: 'confetti',
            color: Math.random() > 0.5 ? '#fde047' : '#fbbf24',
          });
        }
      }

      // Update and Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.rotation !== undefined && p.vRot) {
          p.rotation += p.vRot;
        }

        const progress = p.life / p.maxLife;

        if (p.type === 'smoke') {
          p.size += 0.8;
          p.alpha = (1 - progress) * p.maxAlpha;
          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.rotation) ctx.rotate(p.rotation);
          const sGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          sGrad.addColorStop(0, `rgba(241, 245, 249, ${p.alpha * 0.65})`);
          sGrad.addColorStop(0.6, `rgba(203, 213, 225, ${p.alpha * 0.3})`);
          sGrad.addColorStop(1, 'rgba(148, 163, 184, 0)');
          ctx.fillStyle = sGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'spark') {
          p.vy += 0.25;
          p.alpha = (1 - progress) * p.maxAlpha;
          ctx.fillStyle = p.color || '#fbbf24';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (p.type === 'confetti') {
          p.vy += 0.2;
          p.alpha = (1 - progress) * p.maxAlpha;
          ctx.fillStyle = p.color || '#fde047';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (p.type === 'snow') {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [phase, ticketPunched]);

  // Timeline & Sound Sequence
  useEffect(() => {
    // 1. Initial Whistle & Bell
    playStationAudio('whistle');
    const bellTimer = setTimeout(() => {
      playStationAudio('bell');
      setBellRinging(true);
    }, 800);

    // 2. Braking & Steam Hiss Phase at 2.4s
    const brakeTimer = setTimeout(() => {
      setPhase('braking');
      playStationAudio('hiss');
    }, 2400);

    // 3. Complete Stop at 4.6s
    const stopTimer = setTimeout(() => {
      setPhase('docked');
      setIsShaking(false);
      setBellRinging(false);
    }, 4600);

    return () => {
      clearTimeout(bellTimer);
      clearTimeout(brakeTimer);
      clearTimeout(stopTimer);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Ring Locomotive Bell
  const handleRingBell = () => {
    playStationAudio('bell');
    setBellRinging(true);
    setTimeout(() => setBellRinging(false), 1200);
  };

  // Pull Whistle Cord
  const handlePullWhistle = () => {
    playStationAudio('whistle');
  };

  // Ticket Punch & Enter
  const handlePunchTicket = () => {
    setTicketPunched(true);
    playStationAudio('punch');
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between overflow-hidden select-none ${
        isShaking ? 'animate-screen-rumble' : ''
      }`}
    >
      {/* Dynamic Keyframe Animations */}
      <style>{`
        @keyframes trainPullIntoStation {
          0% {
            transform: translateX(-120%) scale(0.92);
            filter: blur(2px);
          }
          45% {
            transform: translateX(-28%) scale(1);
            filter: blur(0px);
          }
          80% {
            transform: translateX(-3%) scale(1);
          }
          100% {
            transform: translateX(0%) scale(1);
          }
        }

        @keyframes wheelFastToStop {
          0% { transform: rotate(0deg); }
          60% { transform: rotate(1800deg); }
          85% { transform: rotate(2300deg); }
          100% { transform: rotate(2520deg); }
        }

        @keyframes connectingRodPiston {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(8px) translateY(-5px); }
          50% { transform: translateX(16px) translateY(0px); }
          75% { transform: translateX(8px) translateY(5px); }
        }

        @keyframes screenRumble {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -2px); }
          80% { transform: translate(2px, 1px); }
        }

        @keyframes boilerFirePulse {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 15px #f97316); }
          50% { opacity: 1; filter: drop-shadow(0 0 35px #ef4444); }
        }

        @keyframes volumetricLightSweep {
          0%, 100% { opacity: 0.75; transform: rotate(-2deg) scaleY(1); }
          50% { opacity: 0.95; transform: rotate(1deg) scaleY(1.15); }
        }

        @keyframes bellSwing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-22deg); }
          75% { transform: rotate(22deg); }
        }

        .animate-station-pull-in {
          animation: trainPullIntoStation 4.6s cubic-bezier(0.12, 0.9, 0.22, 1) forwards;
        }

        .animate-wheel-decelerate {
          animation: wheelFastToStop 4.6s cubic-bezier(0.12, 0.9, 0.22, 1) forwards;
          transform-origin: center;
        }

        .animate-piston-rod {
          animation: connectingRodPiston 0.35s ease-in-out infinite;
        }

        .animate-screen-rumble {
          animation: screenRumble 0.15s ease-in-out infinite;
        }

        .animate-firebox-glow {
          animation: boilerFirePulse 1.8s ease-in-out infinite;
        }

        .animate-god-ray {
          animation: volumetricLightSweep 4s ease-in-out infinite;
          transform-origin: left center;
        }

        .animate-bell-swing {
          animation: bellSwing 0.4s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>

      {/* 1. Canvas VFX Background Layer (Blizzard, Steam Vortex, Aurora, Sparks) */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* 2. Top Station Header Bar: Movie-Accurate The Polar Express Theme */}
      <div className="relative z-30 w-full max-w-7xl mx-auto pt-4 px-6 flex items-center justify-between">
        {/* Movie Title & Polar Express Clock */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/90 border border-amber-500/50 backdrop-blur-md shadow-2xl">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-serif font-black text-amber-300 tracking-wide flex items-center gap-2">
              <span>THE POLAR EXPRESS · 北極特快車</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300">
                NO. 1225 · BERKSHIRE 2-8-4
              </span>
            </h1>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>DECEMBER 24 · 11:55 PM · CHRISTMAS EVE</span>
            </span>
          </div>
        </div>

        {/* Action Buttons: Bell + Whistle + Sound Toggle + Skip */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Ring Bell Button */}
          <button
            onClick={handleRingBell}
            className={`px-3 py-1.5 rounded-2xl border text-xs font-serif font-bold transition-all flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 cursor-pointer ${
              bellRinging
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/30'
                : 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/50 text-amber-300'
            }`}
            title="敲響火車金鐘！"
          >
            <Bell className={`w-3.5 h-3.5 ${bellRinging ? 'animate-bell-swing' : ''}`} />
            <span className="hidden sm:inline">敲響金鐘</span>
          </button>

          {/* Pull Whistle Cord */}
          <button
            onClick={handlePullWhistle}
            className="px-3 py-1.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 hover:text-amber-200 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            title="拉響高亢蒸汽汽笛！"
          >
            <Wind className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-xs font-serif font-bold hidden sm:inline">拉響汽笛</span>
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playStationAudio('whistle');
            }}
            className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            title={soundEnabled ? '靜音' : '開啟火車音效'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={onComplete}
            className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white rounded-2xl backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <span>跳過</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. MAIN STAGE: HIGH-DETAIL PERE MARQUETTE 1225 STEAM LOCOMOTIVE */}
      <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-center p-4">
        {/* Train Container */}
        <div className="animate-station-pull-in relative max-w-5xl w-full flex flex-col items-center">
          {/* Volumetric Headlight God-Ray Cutting through Snowstorm */}
          <div className="animate-god-ray absolute top-[28%] right-[-24%] w-[650px] h-[260px] bg-gradient-to-r from-amber-300/80 via-amber-200/30 via-cyan-300/15 to-transparent blur-2xl pointer-events-none transform -rotate-3 z-30" />

          {/* Boiler Firebox Red Glow */}
          <div className="animate-firebox-glow absolute bottom-12 right-[25%] w-72 h-14 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 rounded-full blur-xl pointer-events-none opacity-80" />

          {/* Movie-Accurate The Polar Express Steam Locomotive Vector */}
          <svg
            className="w-full h-auto max-h-[340px] drop-shadow-[0_0_45px_rgba(251,191,36,0.6)]"
            viewBox="0 0 1000 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Passenger Carriage with Warm Golden Windows */}
            <g id="passenger-car">
              <rect x="20" y="110" width="240" height="150" rx="12" fill="#0B1A28" stroke="#F59E0B" strokeWidth="3" />
              <rect x="30" y="96" width="220" height="18" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />

              {/* Cozy Carriage Windows with Golden Lighting */}
              {Array.from({ length: 4 }).map((_, i) => (
                <rect key={i} x={38 + i * 42} y={135} width="28" height="45" rx="6" fill="#FDE047" stroke="#B45309" strokeWidth="2" />
              ))}

              {/* Carriage Door with Warm Spill */}
              <g id="carriage-door">
                <rect x="205" y="135" width="42" height="115" rx="4" fill={phase === 'docked' ? '#FDE047' : '#0B1A28'} stroke="#F59E0B" strokeWidth="2" />
                {phase === 'docked' && (
                  <rect x="210" y="140" width="32" height="105" rx="2" fill="#FEF08A" opacity="0.95" />
                )}
              </g>

              {/* Movie Golden Lettering */}
              <rect x="30" y="195" width="165" height="16" fill="#78350F" />
              <text x="112" y="207" fill="#FDE047" fontSize="10" fontFamily="serif" fontWeight="bold" textAnchor="middle">
                THE POLAR EXPRESS
              </text>

              {/* Carriage Wheels */}
              <circle cx="65" cy="275" r="20" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
              <circle cx="65" cy="275" r="8" fill="#F59E0B" />
              <circle cx="185" cy="275" r="20" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
              <circle cx="185" cy="275" r="8" fill="#F59E0B" />
            </g>

            {/* Tender Coal Car with Polar Express Script */}
            <g id="tender-car">
              <rect x="270" y="140" width="160" height="120" rx="8" fill="#0F172A" stroke="#F59E0B" strokeWidth="3" />
              <path d="M280 140 Q350 110 420 140 Z" fill="#020617" />
              <rect x="280" y="205" width="140" height="16" fill="#B45309" />
              <text x="350" y="217" fill="#FDE047" fontSize="10" fontFamily="serif" textAnchor="middle" fontWeight="bold">
                1225 · PERE MARQUETTE
              </text>
              <circle cx="310" cy="275" r="18" fill="#1E293B" stroke="#F59E0B" strokeWidth="3" />
              <circle cx="390" cy="275" r="18" fill="#1E293B" stroke="#F59E0B" strokeWidth="3" />
            </g>

            {/* Heavy Baldwin Berkshire Steam Locomotive Engine Body */}
            <g id="steam-engine">
              {/* Engineer Cab */}
              <rect x="440" y="100" width="140" height="160" rx="10" fill="#0F172A" stroke="#F59E0B" strokeWidth="4" />
              <path d="M435 100 L585 100 L580 85 L440 85 Z" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
              <rect x="465" y="125" width="45" height="55" rx="6" fill="#FDE047" stroke="#78350F" strokeWidth="3" />
              <rect x="520" y="125" width="45" height="55" rx="6" fill="#FDE047" stroke="#78350F" strokeWidth="3" />

              {/* Heavy Cylindrical Boiler */}
              <rect x="575" y="125" width="280" height="125" rx="12" fill="#111827" stroke="#F59E0B" strokeWidth="4" />
              <line x1="630" y1="125" x2="630" y2="250" stroke="#F59E0B" strokeWidth="6" />
              <line x1="710" y1="125" x2="710" y2="250" stroke="#F59E0B" strokeWidth="6" />
              <line x1="790" y1="125" x2="790" y2="250" stroke="#F59E0B" strokeWidth="6" />

              {/* Golden Brass Locomotive Bell on top of boiler */}
              <g className={bellRinging ? 'animate-bell-swing' : ''} style={{ transformOrigin: '700px 95px' }}>
                <path d="M692 105 L708 105 L705 92 L695 92 Z" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
                <circle cx="700" cy="107" r="3" fill="#B45309" />
              </g>

              {/* Steam Chimney Smoke Stack */}
              <path d="M780 125 L780 65 L815 65 L815 125 Z" fill="#020617" stroke="#F59E0B" strokeWidth="3" />
              <rect x="772" y="58" width="52" height="10" rx="3" fill="#F59E0B" />

              {/* Front Golden Headlight with Number 1225 */}
              <rect x="850" y="150" width="45" height="100" rx="6" fill="#020617" stroke="#F59E0B" strokeWidth="3" />
              <circle cx="895" cy="175" r="26" fill="#FDE047" stroke="#F59E0B" strokeWidth="5" />
              <circle cx="895" cy="175" r="16" fill="#FFFFFF" />

              {/* Heavy Snowplow Cowcatcher */}
              <path d="M890 250 L965 285 L890 285 Z" fill="#78350F" stroke="#F59E0B" strokeWidth="3" />

              {/* Massive Drive Wheels (Berkshire 2-8-4) */}
              <g className="animate-wheel-decelerate">
                <circle cx="510" cy="275" r="32" fill="#020617" stroke="#F59E0B" strokeWidth="5" />
                <circle cx="510" cy="275" r="10" fill="#FDE047" />
                <line x1="510" y1="243" x2="510" y2="307" stroke="#F59E0B" strokeWidth="3" />
                <line x1="478" y1="275" x2="542" y2="275" stroke="#F59E0B" strokeWidth="3" />
              </g>

              <g className="animate-wheel-decelerate">
                <circle cx="620" cy="275" r="32" fill="#020617" stroke="#F59E0B" strokeWidth="5" />
                <circle cx="620" cy="275" r="10" fill="#FDE047" />
                <line x1="620" y1="243" x2="620" y2="307" stroke="#F59E0B" strokeWidth="3" />
                <line x1="588" y1="275" x2="652" y2="275" stroke="#F59E0B" strokeWidth="3" />
              </g>

              <g className="animate-wheel-decelerate">
                <circle cx="730" cy="275" r="32" fill="#020617" stroke="#F59E0B" strokeWidth="5" />
                <circle cx="730" cy="275" r="10" fill="#FDE047" />
                <line x1="730" y1="243" x2="730" y2="307" stroke="#F59E0B" strokeWidth="3" />
                <line x1="698" y1="275" x2="762" y2="275" stroke="#F59E0B" strokeWidth="3" />
              </g>

              {/* Piston Transmission Rod */}
              <line className="animate-piston-rod" x1="510" y1="275" x2="820" y2="260" stroke="#FDE047" strokeWidth="8" strokeLinecap="round" />
            </g>
          </svg>

          {/* Snowy Platform Track Safety Line */}
          <div className="w-full h-8 bg-slate-900 border-t-4 border-amber-400 rounded-b-xl my-1 flex items-center justify-between px-4 shadow-2xl relative z-20">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#f59e0b,#f59e0b_12px,#020617_12px,#020617_24px)] opacity-60 h-2 top-0" />
            <span className="text-[10px] font-mono font-bold text-amber-300 z-10 pt-1">
              ▼ NORTH POLE ROUTE · ARCTIC CIRCLE 66°33′N
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 z-10 pt-1">
              {phase === 'docked' ? 'STATUS: ALL ABOARD! (已停穩等候登車)' : 'STATUS: APPROACHING (極地進站中)'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. THE ICONIC GOLDEN TICKET & CONDUCTOR CALL */}
      <div className="relative z-30 w-full p-6 sm:p-8 flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-4">
        {phase === 'docked' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 w-full max-w-xl">
            {/* Conductor Dialogue Quote Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-serif italic text-center shadow-lg">
              「車票請準備好！Tickets, please! ... 那麼，你要上車嗎？這可是北極特快車！」
            </div>

            {/* Interactive Golden Boarding Pass with Movie Ticket Punch Options */}
            <div
              className={`p-5 rounded-3xl bg-gradient-to-r from-amber-500/30 via-yellow-500/25 to-amber-500/30 border-2 border-amber-400/90 shadow-[0_0_40px_rgba(251,191,36,0.35)] backdrop-blur-xl transition-all duration-300 ${
                ticketPunched ? 'scale-95 opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between border-b border-amber-400/40 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span className="text-xs sm:text-sm font-serif font-black text-amber-200 tracking-wider">
                    THE POLAR EXPRESS · ROUND TRIP GOLDEN TICKET
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/50">
                  NO. 1225-NORTH POLE
                </span>
              </div>

              {/* Punch Word Selector */}
              <div className="mb-3 text-left">
                <span className="text-[11px] font-mono text-amber-300 block mb-1.5 font-bold">
                  選擇車長打孔祝願詞 (Select Word to Punch):
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['BELIEVE', 'LEAD', 'TRUST', 'EXPLORE'] as const).map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={() => setSelectedPunchWord(word)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-mono font-black border transition-all cursor-pointer ${
                        selectedPunchWord === word
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                          : 'bg-slate-900/80 text-amber-200/80 border-amber-500/30 hover:bg-slate-800'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Punched Letters Visualization */}
              <div className="bg-slate-950/80 border border-dashed border-amber-400/60 rounded-2xl p-3 flex items-center justify-center gap-2 my-2">
                {selectedPunchWord.split('').map((char, idx) => (
                  <span
                    key={idx}
                    className={`text-lg sm:text-2xl font-mono font-black tracking-widest ${
                      ticketPunched ? 'text-amber-300 animate-bounce' : 'text-amber-400/80'
                    }`}
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    {char}
                  </span>
                ))}
              </div>

              {/* Click to Punch Button */}
              <div className="mt-4 pt-3 border-t border-amber-400/40 flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>已就緒 · 點擊車票驗票登車</span>
                </span>

                <button
                  onClick={handlePunchTicket}
                  disabled={ticketPunched}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  {ticketPunched ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>已驗票！出發！</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>打孔驗票 (PUNCH & BOARD)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-amber-300 font-mono font-bold animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {phase === 'entering'
                  ? '🚂 北極特快車正穿過暴風雪松林駛來... 聖誕夜 11:55 PM'
                  : '💨 列車減速煞車靠站中... 鐵軌飛濺金黃火花'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
