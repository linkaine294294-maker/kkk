import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Shield,
  HelpCircle,
  Swords,
  Crown,
  ChevronRight,
  Info,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface NordicFolkGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 11x11 Board Definitions
const BOARD_SIZE = 11;
const THRONE: [number, number] = [5, 5];
const CORNERS: [number, number][] = [
  [0, 0],
  [0, 10],
  [10, 0],
  [10, 10],
];

// Piece Types: 'NONE' | 'ATTACKER' (Black) | 'DEFENDER' (White) | 'KING' (Gold)
type PieceType = 'NONE' | 'ATTACKER' | 'DEFENDER' | 'KING';

interface BoardState {
  grid: PieceType[][];
  currentTurn: 'ATTACKER' | 'DEFENDER';
  winner: 'ATTACKER' | 'DEFENDER' | null;
  moveHistory: Array<{
    from: [number, number];
    to: [number, number];
    piece: PieceType;
    captured: Array<[number, number]>;
  }>;
}

// Initial 11x11 Hnefatafl Layout
const createInitialBoard = (): PieceType[][] => {
  const grid: PieceType[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill('NONE'));

  // King at Center Throne
  grid[5][5] = 'KING';

  // 12 Defenders surrounding King in cross/diamond
  const defenderPositions: [number, number][] = [
    [5, 3],
    [5, 4],
    [5, 6],
    [5, 7],
    [3, 5],
    [4, 5],
    [6, 5],
    [7, 5],
    [4, 4],
    [4, 6],
    [6, 4],
    [6, 6],
  ];
  defenderPositions.forEach(([r, c]) => {
    grid[r][c] = 'DEFENDER';
  });

  // 24 Attackers on 4 edges
  const attackerPositions: [number, number][] = [
    // Top
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [1, 5],
    // Bottom
    [10, 3],
    [10, 4],
    [10, 5],
    [10, 6],
    [10, 7],
    [9, 5],
    // Left
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [5, 1],
    // Right
    [3, 10],
    [4, 10],
    [5, 10],
    [6, 10],
    [7, 10],
    [5, 9],
  ];
  attackerPositions.forEach(([r, c]) => {
    grid[r][c] = 'ATTACKER';
  });

  return grid;
};

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  char: string;
}

export const NordicFolkGamesModal: React.FC<NordicFolkGamesModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Game Setup & Mode
  const [gameMode, setGameMode] = useState<'ai' | 'pvp'>('ai');
  const [playerRole, setPlayerRole] = useState<'DEFENDER' | 'ATTACKER'>('DEFENDER');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'hard'>('hard');
  const [activeTab, setActiveTab] = useState<'game' | 'rules'>('game');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Board State
  const [board, setBoard] = useState<PieceType[][]>(createInitialBoard);
  const [currentTurn, setCurrentTurn] = useState<'ATTACKER' | 'DEFENDER'>('ATTACKER');
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<Array<[number, number]>>([]);
  const [winner, setWinner] = useState<'ATTACKER' | 'DEFENDER' | null>(null);
  const [moveHistory, setMoveHistory] = useState<BoardState['moveHistory']>([]);
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Sound Synthesizer via Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthesizedSound = (type: 'move' | 'capture' | 'win' | 'kingEscaped') => {
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

      if (type === 'move') {
        // Deep wooden thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'capture') {
        // Shattering rune clash
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'win' || type === 'kingEscaped') {
        // Norse victory fanfare
        const freqs = [329.63, 440, 523.25, 659.25, 880];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.1);
          gain.gain.setValueAtTime(0.18, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.4);
        });
      }
    } catch {
      // Audio fallback safe
    }
  };

  // Check if position is a Corner
  const isCorner = (r: number, c: number): boolean => {
    return CORNERS.some(([cr, cc]) => cr === r && cc === c);
  };

  // Check if position is Throne
  const isThrone = (r: number, c: number): boolean => {
    return r === THRONE[0] && c === THRONE[1];
  };

  // Calculate Legal Orthogonal Moves
  const getLegalMoves = useCallback(
    (r: number, c: number, currentGrid: PieceType[][]): Array<[number, number]> => {
      const piece = currentGrid[r][c];
      if (piece === 'NONE') return [];

      const moves: Array<[number, number]> = [];
      const directions: [number, number][] = [
        [-1, 0], // Up
        [1, 0], // Down
        [0, -1], // Left
        [0, 1], // Right
      ];

      directions.forEach(([dr, dc]) => {
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
          // If square occupied, stop in this direction
          if (currentGrid[nr][nc] !== 'NONE') break;

          // Corner squares are ONLY accessible by the KING
          if (isCorner(nr, nc) && piece !== 'KING') {
            break;
          }

          // Throne is only accessible by the KING
          if (isThrone(nr, nc) && piece !== 'KING') {
            break;
          }

          moves.push([nr, nc]);
          nr += dr;
          nc += dc;
        }
      });

      return moves;
    },
    []
  );

  // Check captures after a piece moves to (toR, toC)
  const checkCaptures = (
    grid: PieceType[][],
    toR: number,
    toC: number,
    moverSide: 'ATTACKER' | 'DEFENDER'
  ): { nextGrid: PieceType[][]; captured: Array<[number, number]>; kingEscaped: boolean; kingCaptured: boolean } => {
    const nextGrid = grid.map((row) => [...row]);
    const captured: Array<[number, number]> = [];
    let kingEscaped = false;
    let kingCaptured = false;

    const movingPiece = nextGrid[toR][toC];

    // Win check 1: Did King reach a Corner?
    if (movingPiece === 'KING' && isCorner(toR, toC)) {
      kingEscaped = true;
      return { nextGrid, captured, kingEscaped, kingCaptured };
    }

    // Directions to check custodial capture
    const directions: [number, number][] = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
    ];

    directions.forEach(([dr, dc]) => {
      const midR = toR + dr;
      const midC = toC + dc;
      const flankR = toR + dr * 2;
      const flankC = toC + dc * 2;

      // Check bounds
      if (midR < 0 || midR >= BOARD_SIZE || midC < 0 || midC >= BOARD_SIZE) return;
      if (flankR < 0 || flankR >= BOARD_SIZE || flankC < 0 || flankC >= BOARD_SIZE) return;

      const midPiece = nextGrid[midR][midC];
      const flankPiece = nextGrid[flankR][flankC];

      // Regular pieces capture
      if (midPiece !== 'NONE' && midPiece !== 'KING') {
        const isMidEnemy =
          moverSide === 'ATTACKER'
            ? midPiece === 'DEFENDER'
            : midPiece === 'ATTACKER';

        if (isMidEnemy) {
          // A friendly piece on the other flank
          const isFlankFriendly =
            moverSide === 'ATTACKER'
              ? flankPiece === 'ATTACKER'
              : flankPiece === 'DEFENDER' || flankPiece === 'KING';

          // A corner square or empty throne also acts as a hostile anvil
          const isFlankAnvil =
            isCorner(flankR, flankC) ||
            (isThrone(flankR, flankC) && nextGrid[flankR][flankC] === 'NONE');

          if (isFlankFriendly || isFlankAnvil) {
            nextGrid[midR][midC] = 'NONE';
            captured.push([midR, midC]);
          }
        }
      }
    });

    // Check King Capture: King must be flanked on all 4 sides (or 3 sides against throne/corner)
    let kingPos: [number, number] | null = null;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (nextGrid[r][c] === 'KING') {
          kingPos = [r, c];
          break;
        }
      }
      if (kingPos) break;
    }

    if (kingPos && moverSide === 'ATTACKER') {
      const [kr, kc] = kingPos;
      const kingNeighbors: [number, number][] = [
        [kr - 1, kc],
        [kr + 1, kc],
        [kr, kc - 1],
        [kr, kc + 1],
      ];

      // Check if all 4 neighbor cells are hostile attackers, edge of board, or throne
      const surroundedSides = kingNeighbors.every(([nr, nc]) => {
        if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) {
          return true; // Edge of board acts as barrier
        }
        if (isThrone(nr, nc)) {
          return true; // Empty throne acts as barrier
        }
        return nextGrid[nr][nc] === 'ATTACKER';
      });

      if (surroundedSides) {
        kingCaptured = true;
      }
    }

    return { nextGrid, captured, kingEscaped, kingCaptured };
  };

  // Spawn Rune Particles on Capture
  const triggerCaptureVFX = (coords: Array<[number, number]>) => {
    const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᛊ', 'ᛏ', 'ᛒ'];
    const newParticles: Particle[] = coords.flatMap(([r, c], idx) => {
      return Array.from({ length: 4 }).map((_, pIdx) => ({
        id: Date.now() + idx * 10 + pIdx + Math.random(),
        x: c,
        y: r,
        color: ['#fbbf24', '#f87171', '#38bdf8', '#a78bfa'][pIdx % 4],
        char: RUNES[Math.floor(Math.random() * RUNES.length)],
      }));
    });
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles([]);
    }, 1200);
  };

  // Execute Move
  const makeMove = (fromR: number, fromC: number, toR: number, toC: number) => {
    const movingPiece = board[fromR][fromC];
    const side = currentTurn;

    const interimGrid = board.map((row) => [...row]);
    interimGrid[fromR][fromC] = 'NONE';
    interimGrid[toR][toC] = movingPiece;

    const { nextGrid, captured, kingEscaped, kingCaptured } = checkCaptures(
      interimGrid,
      toR,
      toC,
      side
    );

    setBoard(nextGrid);
    setLastMove({ from: [fromR, fromC], to: [toR, toC] });
    setSelectedCell(null);
    setValidMoves([]);

    if (captured.length > 0) {
      playSynthesizedSound('capture');
      triggerCaptureVFX(captured);
    } else {
      playSynthesizedSound('move');
    }

    setMoveHistory((prev) => [
      ...prev,
      {
        from: [fromR, fromC],
        to: [toR, toC],
        piece: movingPiece,
        captured,
      },
    ]);

    // Check Victory
    if (kingEscaped) {
      setWinner('DEFENDER');
      playSynthesizedSound('win');
      return;
    }
    if (kingCaptured) {
      setWinner('ATTACKER');
      playSynthesizedSound('win');
      return;
    }

    // Pass turn
    const nextTurn = side === 'ATTACKER' ? 'DEFENDER' : 'ATTACKER';
    setCurrentTurn(nextTurn);
  };

  // Cell Click Handler
  const handleCellClick = (r: number, c: number) => {
    if (winner) return;

    // In AI mode, prevent human from clicking on AI's turn
    if (gameMode === 'ai' && currentTurn !== playerRole) {
      return;
    }

    const clickedPiece = board[r][c];

    // If already selected, check if clicked a valid move
    if (selectedCell) {
      const [selR, selC] = selectedCell;
      const isValid = validMoves.some(([vr, vc]) => vr === r && vc === c);

      if (isValid) {
        makeMove(selR, selC, r, c);
        return;
      }
    }

    // Select piece if it belongs to current player
    const isCurrentPlayerPiece =
      currentTurn === 'ATTACKER'
        ? clickedPiece === 'ATTACKER'
        : clickedPiece === 'DEFENDER' || clickedPiece === 'KING';

    if (isCurrentPlayerPiece) {
      setSelectedCell([r, c]);
      const moves = getLegalMoves(r, c, board);
      setValidMoves(moves);
    } else {
      setSelectedCell(null);
      setValidMoves([]);
    }
  };

  // Viking Skald AI Logic
  useEffect(() => {
    if (!isOpen || winner || gameMode !== 'ai') return;
    if (currentTurn === playerRole) return;

    // AI Turn delay for realism
    const aiTimer = setTimeout(() => {
      const aiSide = currentTurn;

      // Find all AI pieces and their legal moves
      const candidateMoves: Array<{
        from: [number, number];
        to: [number, number];
        piece: PieceType;
        score: number;
      }> = [];

      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const piece = board[r][c];
          const isAiPiece =
            aiSide === 'ATTACKER'
              ? piece === 'ATTACKER'
              : piece === 'DEFENDER' || piece === 'KING';

          if (isAiPiece) {
            const moves = getLegalMoves(r, c, board);
            moves.forEach(([toR, toC]) => {
              // Heuristic evaluation score
              let score = Math.random() * 5;

              // King reaches corner = instant maximum win
              if (piece === 'KING' && isCorner(toR, toC)) {
                score += 10000;
              }

              // Test move capture
              const tempGrid = board.map((row) => [...row]);
              tempGrid[r][c] = 'NONE';
              tempGrid[toR][toC] = piece;
              const { captured, kingCaptured } = checkCaptures(
                tempGrid,
                toR,
                toC,
                aiSide
              );

              if (kingCaptured && aiSide === 'ATTACKER') {
                score += 10000;
              }

              score += captured.length * 20;

              // King distance to corner
              if (piece === 'KING') {
                const minCornerDist = Math.min(
                  toR + toC,
                  toR + (10 - toC),
                  (10 - toR) + toC,
                  (10 - toR) + (10 - toC)
                );
                score += (20 - minCornerDist) * 3;
              }

              // Attacker surrounds king
              if (aiSide === 'ATTACKER') {
                // Find king
                for (let kr = 0; kr < BOARD_SIZE; kr++) {
                  for (let kc = 0; kc < BOARD_SIZE; kc++) {
                    if (board[kr][kc] === 'KING') {
                      const distToKing = Math.abs(toR - kr) + Math.abs(toC - kc);
                      score += (15 - distToKing) * 2;
                    }
                  }
                }
              }

              candidateMoves.push({
                from: [r, c],
                to: [toR, toC],
                piece,
                score,
              });
            });
          }
        }
      }

      if (candidateMoves.length > 0) {
        // Sort by heuristic score descending
        candidateMoves.sort((a, b) => b.score - a.score);
        const bestMove = candidateMoves[0];
        makeMove(bestMove.from[0], bestMove.from[1], bestMove.to[0], bestMove.to[1]);
      }
    }, 600);

    return () => clearTimeout(aiTimer);
  }, [currentTurn, board, winner, gameMode, playerRole, isOpen, getLegalMoves]);

  // Restart Game
  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentTurn('ATTACKER');
    setWinner(null);
    setSelectedCell(null);
    setValidMoves([]);
    setMoveHistory([]);
    setLastMove(null);
  };

  // Count active pieces
  const attackerCount = board.flat().filter((p) => p === 'ATTACKER').length;
  const defenderCount = board.flat().filter((p) => p === 'DEFENDER').length;
  const kingActive = board.flat().some((p) => p === 'KING');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in select-none">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[96vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg">
              <Swords className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-mono font-bold mb-1 border border-amber-500/30">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>VIKING HNEFATAFL · 11×11 國王突圍棋</span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-black text-white tracking-wide">
                維京傳奇國王棋 (Hnefatafl)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={soundEnabled ? '靜音' : '開啟音效'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab & Controls Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'game'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              ⚔️ 棋局對弈
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              📜 歷史起源與規則
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Selector */}
            <div className="bg-slate-900 p-0.5 rounded-xl border border-slate-800 flex items-center text-xs">
              <button
                onClick={() => {
                  setGameMode('ai');
                  resetGame();
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  gameMode === 'ai'
                    ? 'bg-slate-800 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                人機挑戰
              </button>
              <button
                onClick={() => {
                  setGameMode('pvp');
                  resetGame();
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  gameMode === 'pvp'
                    ? 'bg-slate-800 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                雙人對弈
              </button>
            </div>

            {gameMode === 'ai' && (
              <div className="bg-slate-900 p-0.5 rounded-xl border border-slate-800 flex items-center text-xs">
                <button
                  onClick={() => {
                    setPlayerRole('DEFENDER');
                    resetGame();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    playerRole === 'DEFENDER'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold'
                      : 'text-slate-400'
                  }`}
                  title="玩家執護王白棋"
                >
                  執白 (護王)
                </button>
                <button
                  onClick={() => {
                    setPlayerRole('ATTACKER');
                    resetGame();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    playerRole === 'ATTACKER'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700 font-bold'
                      : 'text-slate-400'
                  }`}
                  title="玩家執圍攻黑棋"
                >
                  執黑 (圍攻)
                </button>
              </div>
            )}

            <button
              onClick={resetGame}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新開始</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/80">
          {activeTab === 'game' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto items-start">
              {/* Left Column: 11x11 Board */}
              <div className="lg:col-span-8 flex flex-col items-center">
                {/* Turn & Status Indicator */}
                <div className="w-full flex items-center justify-between mb-3 px-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">當前輪次：</span>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                        currentTurn === 'ATTACKER'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                      }`}
                    >
                      {currentTurn === 'ATTACKER' ? '⚔️ 圍攻方 (黑棋)' : '👑 護王方 (白棋/國王)'}
                      {gameMode === 'ai' && (
                        <span className="text-[10px] text-slate-400">
                          {currentTurn === playerRole ? '(你的回合)' : '(維京 AI 思考中...)'}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>圍攻兵力: {attackerCount}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span>守衛兵力: {defenderCount}</span>
                    </span>
                  </div>
                </div>

                {/* 11x11 Grid Canvas Wrapper */}
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-900/60 shadow-2xl">
                  {/* Floating Particle Burst on Capture */}
                  {particles.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        left: `${(p.x / 11) * 100 + 4}%`,
                        top: `${(p.y / 11) * 100 + 4}%`,
                        color: p.color,
                      }}
                      className="absolute text-lg font-bold pointer-events-none animate-ping z-30 font-serif"
                    >
                      {p.char}
                    </div>
                  ))}

                  {/* 11x11 Board Container */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
                      width: 'min(86vw, 460px)',
                      height: 'min(86vw, 460px)',
                    }}
                    className="border border-amber-900/80 bg-amber-950/30 rounded-xl overflow-hidden"
                  >
                    {board.map((row, rIdx) =>
                      row.map((cellPiece, cIdx) => {
                        const isSelected = selectedCell?.[0] === rIdx && selectedCell?.[1] === cIdx;
                        const isValidDest = validMoves.some(([vr, vc]) => vr === rIdx && vc === cIdx);
                        const isCornerCell = isCorner(rIdx, cIdx);
                        const isThroneCell = isThrone(rIdx, cIdx);
                        const isLastMoved =
                          (lastMove?.from[0] === rIdx && lastMove?.from[1] === cIdx) ||
                          (lastMove?.to[0] === rIdx && lastMove?.to[1] === cIdx);

                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            onClick={() => handleCellClick(rIdx, cIdx)}
                            className={`relative flex items-center justify-center border border-amber-900/30 transition-all cursor-pointer select-none ${
                              (rIdx + cIdx) % 2 === 0 ? 'bg-slate-900/70' : 'bg-slate-950/80'
                            } ${
                              isCornerCell
                                ? 'bg-gradient-to-br from-amber-500/20 to-amber-900/40 ring-1 ring-amber-500/50'
                                : ''
                            } ${
                              isThroneCell
                                ? 'bg-gradient-to-br from-purple-900/40 to-slate-900 ring-1 ring-purple-500/50'
                                : ''
                            } ${isSelected ? 'ring-2 ring-cyan-400 bg-cyan-950/60 z-10' : ''} ${
                              isValidDest ? 'bg-emerald-950/50 hover:bg-emerald-900/60' : ''
                            } ${isLastMoved ? 'border-amber-500/50' : ''}`}
                          >
                            {/* Special Tile Markers */}
                            {isCornerCell && cellPiece === 'NONE' && (
                              <span className="text-[10px] text-amber-400/70 font-mono font-bold">
                                🏰
                              </span>
                            )}
                            {isThroneCell && cellPiece === 'NONE' && (
                              <span className="text-[10px] text-purple-400/80 font-mono font-bold">
                                👑
                              </span>
                            )}

                            {/* Valid Move Dot */}
                            {isValidDest && (
                              <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] z-10 pointer-events-none" />
                            )}

                            {/* Pieces Rendering */}
                            {cellPiece === 'ATTACKER' && (
                              <div className="w-[82%] h-[82%] rounded-full bg-gradient-to-br from-rose-800 via-rose-950 to-slate-950 border-2 border-rose-500/70 shadow-lg flex items-center justify-center text-rose-200 transition-transform hover:scale-105 active:scale-95">
                                <span className="text-[10px] sm:text-xs">⚔️</span>
                              </div>
                            )}

                            {cellPiece === 'DEFENDER' && (
                              <div className="w-[82%] h-[82%] rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-400 border-2 border-emerald-400/80 shadow-lg flex items-center justify-center text-slate-800 transition-transform hover:scale-105 active:scale-95">
                                <span className="text-[10px] sm:text-xs">🛡️</span>
                              </div>
                            )}

                            {cellPiece === 'KING' && (
                              <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-600 border-2 border-white shadow-[0_0_12px_rgba(251,191,36,0.8)] flex items-center justify-center text-slate-950 transition-transform hover:scale-110 active:scale-95 animate-pulse">
                                <Crown className="w-3.5 h-3.5 text-slate-950 fill-current" />
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Victory Banner */}
                {winner && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-amber-500/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 w-full animate-in zoom-in-95">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
                      <div>
                        <h4 className="text-sm sm:text-base font-serif font-black text-white">
                          {winner === 'DEFENDER'
                            ? '👑 護王方大獲全勝！國王成功殺出重圍脫逃！'
                            : '⚔️ 圍攻方大獲全勝！國王已被四面包圍生擒！'}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {winner === 'DEFENDER'
                            ? '國王成功抵達角落聖域，護衛隊功垂千古。'
                            : '維京狂戰士突破中央防線，生擒敵方君王。'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetGame}
                      className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-lg shrink-0"
                    >
                      再來一局 (REPLAY)
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Game Info & Move History */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>雙方陣營勝利目標</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                      <span className="font-bold text-emerald-300 block mb-0.5">
                        👑 護王方 (13 人)
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        協助中央的國王突破圍剿，移動至 4 個角落堡壘 (🏰) 即可脫逃獲勝！
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-rose-500/30">
                      <span className="font-bold text-rose-300 block mb-0.5">
                        ⚔️ 捉王方 (24 人)
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        利用人數優勢封鎖通道，將國王上下左右四面完全包圍生擒！
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-serif font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>夾擊吃子規則 (Custodial Capture)</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    所有棋子均正交直線移動（橫向或縱向任意格，不可跳躍）。
                    若移動後使敵方棋子在水平或垂直線兩側緊挨著被己方夾住（[己方] - [敵方] - [己方]），該敵棋即被吃掉消滅！
                  </p>
                </div>

                {/* Move History Log */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      對局步數記錄 ({moveHistory.length})
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {moveHistory.reduce((s, m) => s + m.captured.length, 0)} 子已戰損
                    </span>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
                    {moveHistory.length === 0 ? (
                      <p className="text-slate-500 text-xs py-2 text-center">
                        點選黑方棋子先行第一步...
                      </p>
                    ) : (
                      moveHistory.slice(-6).map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 text-slate-300"
                        >
                          <span>
                            {m.piece === 'ATTACKER' ? '⚔️ 圍攻' : m.piece === 'KING' ? '👑 國王' : '🛡️ 守衛'}{' '}
                            ({m.from[0]},{m.from[1]}) → ({m.to[0]},{m.to[1]})
                          </span>
                          {m.captured.length > 0 && (
                            <span className="text-rose-400 font-bold">
                              💥 夾吃 {m.captured.length} 子
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Rules & Lore Tab */
            <div className="max-w-3xl mx-auto space-y-6 text-slate-300">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-bold">
                  <span>HISTORICAL ORIGIN · 斯堪地那維亞起源</span>
                </div>
                <h3 className="text-lg font-serif font-black text-white">
                  維京突圍棋（Hnefatafl）的千年傳奇
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                  Hnefatafl（在古諾斯語中意為「國王的棋盤」）是流行於西元 400 年至 1100 年間日耳曼與維京海盜文化的核心智謀對弈遊戲。
                  在西洋棋普及至北歐之前，維京戰士與領主在航海出征、寒冬圍爐與宴席長廳中，均以此棋磨礪戰術與防守智慧。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-serif font-bold text-white text-sm flex items-center gap-1.5">
                    <span>1. 不對稱兵力平衡</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    捉王方擁有 24 名突擊士兵，人數為護王方（12 守衛 + 1 國王）的兩倍。
                    進攻方目標在於封鎖四個角落，護王方則需調虎離山、撕開防線。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-serif font-bold text-white text-sm flex items-center gap-1.5">
                    <span>2. 正交直線移動</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    如同國際象棋中的城堡（Rook），棋子可在橫排或縱列自由滑行任意格數，只要路徑未被其他棋子阻擋。不能跳子。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-serif font-bold text-white text-sm flex items-center gap-1.5">
                    <span>3. 夾擊吃子機制</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    當主動走子後，將敵棋夾在己方兩棋之間（或己方與角堡壘之間），即完成吃子。若棋子是自己主動走進兩敵子之間則不受夾吃。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-serif font-bold text-white text-sm flex items-center gap-1.5">
                    <span>4. 聖域角落與王座禁區</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    只有國王能夠踏入棋盤四個角落的逃脫堡壘。普通士兵不可進入角落或停在中央王座。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
