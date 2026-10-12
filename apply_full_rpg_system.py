import re

file_path = "src/components/PolarExpressReindeerRpgModal.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

print("File loaded, length:", len(code))

# =========================================================================
# 1. Enhance drawStockholmWorldMap
# =========================================================================
old_stockholm_water = '''  // 3. Lake Mälaren Dark Shimmering Water
  const waterY = 240;
  const waterH = 95;
  ctx.fillStyle = '#061324';
  ctx.fillRect(0, waterY, width, waterH);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  for (let w = 20; w < width; w += 35) {
    ctx.fillRect(w, waterY + 20 + Math.sin((tick + w) * 0.05) * 8, 22, 2);
  }

  // 4. Gamla Stan Granite Quayside & Golden Hall (Gyllene Salen) Mosaic Floor
  const quayY = waterY + waterH;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, quayY, width, height - quayY);

  // Gilded Mosaic Gold Flecks (Simulating Gyllene Salen 18 million gold tiles)
  for (let m = 0; m < 70; m++) {
    const mx = (m * 47 + 13) % width;
    const my = quayY + 12 + ((m * 31) % (height - quayY - 24));
    ctx.fillStyle = (m % 2 === 0) ? 'rgba(234, 179, 8, 0.45)' : 'rgba(250, 204, 21, 0.3)';
    ctx.fillRect(mx, my, 4, 4);
  }'''

new_stockholm_water = '''  // 3. Lake Mälaren Flowing Current & Glacial Ice Floes (會流動的梅拉倫湖冰川水流)
  const waterY = 240;
  const waterH = 95;
  const waterGrad = ctx.createLinearGradient(0, waterY, 0, waterY + waterH);
  waterGrad.addColorStop(0, '#061324');
  waterGrad.addColorStop(0.5, '#0c2744');
  waterGrad.addColorStop(1, '#05101e');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, waterY, width, waterH);

  // Flowing current wave ribbons
  for (let layer = 0; layer < 3; layer++) {
    const waveSpeed = (layer + 1) * 0.04;
    const waveY = waterY + 18 + layer * 28;
    ctx.strokeStyle = layer === 0 ? 'rgba(56, 189, 248, 0.35)' : layer === 1 ? 'rgba(103, 232, 249, 0.25)' : 'rgba(147, 197, 253, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let wx = 0; wx < width; wx += 20) {
      const wy = waveY + Math.sin(tick * waveSpeed + wx * 0.03) * 5;
      if (wx === 0) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();
  }

  // Drifting Translucent Glacial Ice Floes on Lake Mälaren (隨波漂流的冰晶浮冰)
  const iceFloes = [
    { base: 60, speed: 0.3, size: 22, yOff: 25 },
    { base: 260, speed: 0.25, size: 28, yOff: 45 },
    { base: 490, speed: 0.35, size: 18, yOff: 30 },
    { base: 710, speed: 0.28, size: 25, yOff: 60 },
    { base: 980, speed: 0.32, size: 20, yOff: 40 },
  ];
  iceFloes.forEach((floe, idx) => {
    const fx = (floe.base + tick * floe.speed) % (width + 60) - 30;
    const fy = waterY + floe.yOff + Math.sin(tick * 0.05 + idx) * 3;
    ctx.save();
    ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fx - floe.size, fy);
    ctx.lineTo(fx - floe.size * 0.5, fy - floe.size * 0.4);
    ctx.lineTo(fx + floe.size * 0.6, fy - floe.size * 0.3);
    ctx.lineTo(fx + floe.size, fy + floe.size * 0.2);
    ctx.lineTo(fx + floe.size * 0.2, fy + floe.size * 0.5);
    ctx.lineTo(fx - floe.size * 0.7, fy + floe.size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(fx - floe.size * 0.2, fy - floe.size * 0.15, floe.size * 0.4, 2);
    ctx.restore();
  });

  // Quayside lapping water splash foam
  ctx.fillStyle = 'rgba(240, 249, 255, 0.45)';
  for (let spX = 10; spX < width; spX += 32) {
    const foamY = waterY + waterH - 2 + Math.sin(tick * 0.08 + spX) * 2;
    ctx.fillRect(spX, foamY, 14, 2);
  }

  // 4. Gamla Stan Granite Quayside & Shipyard Timber Details
  const quayY = waterY + waterH;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, quayY, width, height - quayY);

  // Quayside heavy timber curb
  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, quayY - 4, width, 6);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(0, quayY - 8, width, 4);

  // Mooring Bollards & Hanging Coiled Ropes
  for (let bx = 80; bx < width - 80; bx += 160) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx - 5, quayY - 18, 10, 14);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(bx - 7, quayY - 20, 14, 3);
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bx, quayY - 4, 7, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Vasa Drydock Shipyard Crane Derrick (17世紀造船吊架木塔)
  const craneX = 990;
  ctx.fillStyle = '#5c2d12';
  ctx.fillRect(craneX - 4, quayY - 70, 8, 70);
  ctx.fillRect(craneX - 35, quayY - 70, 60, 5);
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(craneX, quayY - 70);
  ctx.lineTo(craneX - 32, quayY - 40);
  ctx.lineTo(craneX - 32, quayY - 15);
  ctx.stroke();
  ctx.fillStyle = '#78350f';
  ctx.fillRect(craneX - 40, quayY - 20, 16, 14);
  ctx.strokeStyle = '#0f172a';
  ctx.strokeRect(craneX - 40, quayY - 20, 16, 14);

  // Stacked Oak Shipbuilding Planks (瓦薩號橡木造船板堆)
  const plankX = 660;
  for (let pl = 0; pl < 4; pl++) {
    ctx.fillStyle = pl % 2 === 0 ? '#7c2d12' : '#9a3412';
    ctx.fillRect(plankX - pl * 2, quayY + 35 - pl * 6, 48 + pl * 4, 5);
  }

  // Gilded Mosaic Gold Flecks Drifting from City Hall Golden Hall (諾貝爾金廳金箔隨風灑落)
  for (let m = 0; m < 65; m++) {
    const mx = (m * 43 + tick * 0.4) % width;
    const my = quayY + 10 + ((m * 37 + tick * 0.3) % (height - quayY - 20));
    const goldGlint = Math.sin(tick * 0.15 + m) * 0.4 + 0.6;
    ctx.fillStyle = (m % 2 === 0) ? `rgba(234, 179, 8, ${goldGlint})` : `rgba(250, 204, 21, ${goldGlint * 0.8})`;
    ctx.fillRect(mx, my, 3.5, 3.5);
  }'''

if old_stockholm_water in code:
    code = code.replace(old_stockholm_water, new_stockholm_water, 1)
    print("Stockholm water upgraded successfully!")
else:
    print("Could not find old Stockholm water block, searching...")

# =========================================================================
# 2. Enhance drawIcelandWorldMap with flowing glacial river, geysir, and steam
# =========================================================================
old_iceland_lagoon = '''  // 3. The World-Famous Blue Lagoon: Steaming Milky-Cyan Thermal Mineral Pools
  const lagoonY = 240;
  const lagoonH = 110;
  // Milky Turquoise Geothermal Water
  const lagGrad = ctx.createLinearGradient(0, lagoonY, 0, lagoonY + lagoonH);
  lagGrad.addColorStop(0, '#0891b2');
  lagGrad.addColorStop(0.4, '#06b6d4');
  lagGrad.addColorStop(1, '#67e8f9');
  ctx.fillStyle = lagGrad;
  ctx.fillRect(0, lagoonY, width, lagoonH);

  // Billowing White Geothermal Steam Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let sm = 0; sm < 8; sm++) {
    const smX = (sm * 130 + tick * 0.8) % width;
    const smY = lagoonY + 25 + Math.sin(tick * 0.04 + sm) * 12;
    ctx.beginPath();
    ctx.arc(smX, smY, 18 + (sm % 3) * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pure White Silica Mud Banks & Wooden Footbridges
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(160, lagoonY + 50, 80, 14);
  ctx.fillRect(520, lagoonY + 40, 110, 16);
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#0891b2';
  ctx.fillText('♨️ 藍湖白矽泥泉 (38°C)', 530, lagoonY + 52);'''

new_iceland_lagoon = '''  // 3. The World-Famous Blue Lagoon & Flowing Glacial Meltwater River (會流動的冰川融水河與藍湖溫泉)
  const lagoonY = 240;
  const lagoonH = 110;

  // Flowing Glacial Meltwater River Channel (辛格瓦德拉大裂谷冰川融水河)
  const riverY = 240;
  const riverH = 65;
  const riverGrad = ctx.createLinearGradient(0, riverY, 0, riverY + riverH);
  riverGrad.addColorStop(0, '#0369a1');
  riverGrad.addColorStop(0.35, '#0284c7');
  riverGrad.addColorStop(0.7, '#38bdf8');
  riverGrad.addColorStop(1, '#0e7490');
  ctx.fillStyle = riverGrad;
  ctx.fillRect(0, riverY, width, riverH);

  // Flowing River Rapids Ripples & Water Current
  for (let rLayer = 0; rLayer < 3; rLayer++) {
    const rSpeed = (rLayer + 1) * 0.05;
    const rWaveY = riverY + 12 + rLayer * 18;
    ctx.strokeStyle = rLayer === 0 ? 'rgba(255, 255, 255, 0.45)' : rLayer === 1 ? 'rgba(103, 232, 249, 0.35)' : 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let rx = 0; rx < width; rx += 22) {
      const ry = rWaveY + Math.sin(tick * rSpeed + rx * 0.04) * 4;
      if (rx === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.stroke();
  }

  // Drifting Glacial Icebergs Downstream (辛格韋德利大裂谷隨波漂流冰山)
  const glacialBergs = [
    { startX: 80, speed: 0.45, size: 24, yOffset: 16 },
    { startX: 340, speed: 0.38, size: 30, yOffset: 34 },
    { startX: 620, speed: 0.42, size: 20, yOffset: 22 },
    { startX: 880, speed: 0.35, size: 26, yOffset: 40 },
    { startX: 1100, speed: 0.48, size: 18, yOffset: 18 },
  ];
  glacialBergs.forEach((berg, bidx) => {
    const bx = (berg.startX + tick * berg.speed) % (width + 70) - 35;
    const by = riverY + berg.yOffset + Math.sin(tick * 0.06 + bidx) * 3;
    ctx.save();
    ctx.fillStyle = 'rgba(240, 249, 255, 0.9)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(bx - berg.size, by);
    ctx.lineTo(bx - berg.size * 0.4, by - berg.size * 0.5);
    ctx.lineTo(bx + berg.size * 0.5, by - berg.size * 0.4);
    ctx.lineTo(bx + berg.size, by);
    ctx.lineTo(bx + berg.size * 0.3, by + berg.size * 0.4);
    ctx.lineTo(bx - berg.size * 0.5, by + berg.size * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(bx - berg.size * 0.2, by - 2, berg.size * 0.4, 3);
    ctx.restore();
  });

  // Frothing White Water Spray against Basalt Rocks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  for (let sp = 15; sp < width; sp += 38) {
    const sprayY = riverY + riverH - 2 + Math.sin(tick * 0.09 + sp) * 2;
    ctx.fillRect(sp, sprayY, 16, 2.5);
  }

  // Blue Lagoon Steaming Geothermal Milky-Cyan Thermal Mineral Pools
  const lagPoolY = riverY + riverH;
  const lagPoolH = lagoonH - riverH;
  const lagGrad = ctx.createLinearGradient(0, lagPoolY, 0, lagPoolY + lagPoolH);
  lagGrad.addColorStop(0, '#0891b2');
  lagGrad.addColorStop(0.4, '#06b6d4');
  lagGrad.addColorStop(1, '#67e8f9');
  ctx.fillStyle = lagGrad;
  ctx.fillRect(0, lagPoolY, width, lagPoolH);

  // Active Erupting Strokkur Geysir (間歇泉定時劇烈噴發水柱與震波)
  const geysirX = 320;
  const geysirY = lagPoolY + 28;
  const isErupting = (tick % 100) < 32;
  const eruptProgress = ((tick % 100) / 32);

  ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
  ctx.beginPath();
  ctx.ellipse(geysirX, geysirY, 32, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (isErupting) {
    const colHeight = 75 * Math.sin(eruptProgress * Math.PI);
    const colWidth = 24 + Math.sin(tick * 0.3) * 6;
    ctx.save();
    const gColGrad = ctx.createLinearGradient(geysirX - colWidth / 2, geysirY, geysirX + colWidth / 2, geysirY - colHeight);
    gColGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gColGrad.addColorStop(0.5, 'rgba(103, 232, 249, 0.8)');
    gColGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gColGrad;
    ctx.fillRect(geysirX - colWidth / 2, geysirY - colHeight, colWidth, colHeight);

    ctx.strokeStyle = `rgba(103, 232, 249, ${1 - eruptProgress})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(geysirX, geysirY, 32 + eruptProgress * 28, 12 + eruptProgress * 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else {
    const domeR = 8 + Math.sin(tick * 0.15) * 2;
    ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
    ctx.beginPath();
    ctx.arc(geysirX, geysirY - 2, domeR, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('🌋 間歇泉 (Geysir)', geysirX - 42, geysirY + 22);

  // Billowing White Geothermal Steam Clouds (會飄動的地熱白蒸氣)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let sm = 0; sm < 9; sm++) {
    const smX = (sm * 120 + tick * 0.9) % width;
    const smY = lagPoolY + 12 + Math.sin(tick * 0.04 + sm) * 14;
    ctx.beginPath();
    ctx.arc(smX, smY, 18 + (sm % 3) * 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pure White Silica Mud Banks & Wooden Footbridges
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(140, lagPoolY + 18, 90, 14);
  ctx.fillRect(520, lagPoolY + 14, 120, 16);
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#0891b2';
  ctx.fillText('♨️ 藍湖天然白矽泥泉 (38°C)', 530, lagPoolY + 26);'''

if old_iceland_lagoon in code:
    code = code.replace(old_iceland_lagoon, new_iceland_lagoon, 1)
    print("Iceland lagoon & river upgraded successfully!")
else:
    print("Could not find old Iceland lagoon block, searching...")

# =========================================================================
# 3. Add activeRovingNpc state, bossShakeRef, and strikeSparksRef
# =========================================================================
target_states = "const [activeStoryNpc, setActiveStoryNpc] = useState<PrimaryStoryNpc | null>(null);"
new_states = """const [activeStoryNpc, setActiveStoryNpc] = useState<PrimaryStoryNpc | null>(null);
  const [activeRovingNpc, setActiveRovingNpc] = useState<RovingHistoricalNpc | null>(null);
  const bossShakeRef = useRef<number>(0);
  const strikeSparksRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[]>([]);"""

if target_states in code and "activeRovingNpc" not in code:
    code = code.replace(target_states, new_states, 1)
    print("Added activeRovingNpc and bossShakeRef states!")

# =========================================================================
# 4. Update startUndertaleBossBattle with Difficulty BGM and clean resets
# =========================================================================
old_start_battle = """  // Start Undertale Boss Battle with Difficulty Scaling & BGM Switching
  const startUndertaleBossBattle = (customDiff?: BattleDifficulty) => {
    const diff = customDiff || battleDifficulty;
    battleDifficultyRef.current = diff;
    const diffConfig = DIFFICULTY_CONFIGS[diff];
    const scaledMaxHp = Math.round(currentChapter.boss.maxHp * diffConfig.hpMult);

    setBattleBossHp(scaledMaxHp);
    setInBattle(true);
    setActiveTab('battle');
    setBattlePhase('menu');
    setBossSpeech(currentChapter.boss.taunts.start);
    bulletsRef.current = [];
    interactivePropsRef.current = [];
    bluetoothGlitchRef.current = false;
    isInvertedControlsRef.current = false;
    strikeDoneRef.current = false;
    strikeResultRef.current = null;
    playRetroSound('roar');
    rpgBgmEngine.startTrack('boss_clash');
    setCurrentBgmTrack('boss_clash');
  };"""

new_start_battle = """  // Start Undertale Boss Battle with Difficulty Scaling & BGM Switching (修復無法觸發BOSS戰：徹底重置狀態)
  const startUndertaleBossBattle = (customDiff?: BattleDifficulty) => {
    const diff = customDiff || battleDifficultyRef.current || battleDifficulty;
    battleDifficultyRef.current = diff;
    setBattleDifficulty(diff);
    const diffConfig = DIFFICULTY_CONFIGS[diff] || DIFFICULTY_CONFIGS['normal'];
    const scaledMaxHp = Math.round(currentChapter.boss.maxHp * diffConfig.hpMult);

    setBattleBossHp(scaledMaxHp);
    setInBattle(true);
    setActiveTab('battle');
    setBattlePhase('menu');
    setBossSpeech(currentChapter.boss.taunts.start);
    setDodgeTimer(diffConfig.dodgeDuration || 5.5);
    bulletsRef.current = [];
    interactivePropsRef.current = [];
    bluetoothGlitchRef.current = false;
    isInvertedControlsRef.current = false;
    strikeDoneRef.current = false;
    strikeResultRef.current = null;
    bossShakeRef.current = 0;
    bossHitFlashRef.current = 0;
    strikeSparksRef.current = [];
    soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
    playRetroSound('roar');

    // 依據難度選擇專屬緊張戰鬥 BGM
    if (diff === 'hard' || diff === 'lunatic') {
      rpgBgmEngine.startTrack('boss_ragnarok_lunatic');
      setCurrentBgmTrack('boss_ragnarok_lunatic');
    } else {
      rpgBgmEngine.startTrack('boss_clash');
      setCurrentBgmTrack('boss_clash');
    }
  };"""

if old_start_battle in code:
    code = code.replace(old_start_battle, new_start_battle, 1)
    print("startUndertaleBossBattle upgraded successfully!")

# =========================================================================
# 5. Update BGM synchronization for difficulty modes
# =========================================================================
old_bgm_sync = """    } else if (activeTab === 'battle') {
      const diffHpMult = DIFFICULTY_CONFIGS[battleDifficultyRef.current]?.hpMult || 1.0;
      if (battlePhase === 'victory') {
        rpgBgmEngine.startTrack('victory_fanfare');
        setCurrentBgmTrack('victory_fanfare');
      } else if (battleBossHp < currentChapter.boss.maxHp * diffHpMult * 0.5 && inBattle) {
        rpgBgmEngine.startTrack('boss_enrage_p2');
        setCurrentBgmTrack('boss_enrage_p2');
      } else if (inBattle) {
        rpgBgmEngine.startTrack('boss_clash');
        setCurrentBgmTrack('boss_clash');
      } else {
        rpgBgmEngine.startTrack('nordic_explore');
        setCurrentBgmTrack('nordic_explore');
      }
    }"""

new_bgm_sync = """    } else if (activeTab === 'battle') {
      const diffHpMult = DIFFICULTY_CONFIGS[battleDifficultyRef.current]?.hpMult || 1.0;
      const isHardOrLunatic = battleDifficultyRef.current === 'hard' || battleDifficultyRef.current === 'lunatic';

      if (battlePhase === 'victory') {
        rpgBgmEngine.startTrack('victory_fanfare');
        setCurrentBgmTrack('victory_fanfare');
      } else if (battleBossHp < currentChapter.boss.maxHp * diffHpMult * 0.5 && inBattle) {
        if (isHardOrLunatic) {
          rpgBgmEngine.startTrack('boss_ragnarok_lunatic');
          setCurrentBgmTrack('boss_ragnarok_lunatic');
        } else {
          rpgBgmEngine.startTrack('boss_enrage_p2');
          setCurrentBgmTrack('boss_enrage_p2');
        }
      } else if (inBattle) {
        if (isHardOrLunatic) {
          rpgBgmEngine.startTrack('boss_ragnarok_lunatic');
          setCurrentBgmTrack('boss_ragnarok_lunatic');
        } else {
          rpgBgmEngine.startTrack('boss_clash');
          setCurrentBgmTrack('boss_clash');
        }
      } else {
        rpgBgmEngine.startTrack('nordic_explore');
        setCurrentBgmTrack('nordic_explore');
      }
    }"""

if old_bgm_sync in code:
    code = code.replace(old_bgm_sync, new_bgm_sync, 1)
    print("BGM sync upgraded successfully!")

# =========================================================================
# 6. Update handleConfirmStrike with Boss Hit Shake & Sparks
# =========================================================================
old_strike_hit = """    strikeResultRef.current = { rating, damage: dmg, isCrit };
    slashAnimRef.current = { life: 1.0, damage: dmg, isCrit };
    bossHitFlashRef.current = 14;"""

new_strike_hit = """    strikeResultRef.current = { rating, damage: dmg, isCrit };
    slashAnimRef.current = { life: 1.0, damage: dmg, isCrit };
    bossHitFlashRef.current = 16;
    // BOSS 受傷劇烈抖動特效 (BOSS Shake Effect)
    bossShakeRef.current = isCrit ? 24 : 15;

    // 飛濺的打擊火花微粒 (Strike Sparks)
    const sparksCount = isCrit ? 22 : 12;
    for (let sp = 0; sp < sparksCount; sp++) {
      const spAng = Math.random() * Math.PI * 2;
      const spSpeed = (isCrit ? 4.5 : 3.0) + Math.random() * 4;
      strikeSparksRef.current.push({
        x: (battleCanvasRef.current ? battleCanvasRef.current.width / 2 : 430),
        y: 70,
        vx: Math.cos(spAng) * spSpeed,
        vy: Math.sin(spAng) * spSpeed,
        life: 1.0,
        color: isCrit ? (Math.random() > 0.5 ? '#fbbf24' : '#ef4444') : (Math.random() > 0.5 ? '#38bdf8' : '#ffffff'),
        size: isCrit ? 4 : 2.5,
      });
    }"""

if old_strike_hit in code:
    code = code.replace(old_strike_hit, new_strike_hit, 1)
    print("handleConfirmStrike shake and sparks added successfully!")

# =========================================================================
# 7. Update renderUndertaleBattle with boss shake offset, shockwave rings,
#    sparks, chromatic afterimages, and multi-tier bullets!
# =========================================================================
old_boss_render = """      // 1. Draw Boss Model (Centered Upper) & Phase 2 Enrage Aura
      const bossX = width / 2;
      const bossY = 70;
      const isBossHit = bossHitFlashRef.current > 0;
      const isPhase2 = battleBossHp < currentChapter.boss.maxHp * 0.5;"""

new_boss_render = """      // 1. Draw Boss Model (Centered Upper) & Phase 2 Enrage Aura (含 BOSS 受傷抖動特效)
      const bossBaseX = width / 2;
      const bossBaseY = 70;
      const isBossHit = bossHitFlashRef.current > 0;
      const isPhase2 = battleBossHp < currentChapter.boss.maxHp * 0.5;

      // BOSS 受傷抖動偏移計算 (Jitter Shake)
      let bossShakeX = 0;
      let bossShakeY = 0;
      if (bossShakeRef.current > 0) {
        bossShakeX = (Math.random() - 0.5) * bossShakeRef.current * 1.8;
        bossShakeY = (Math.random() - 0.5) * bossShakeRef.current * 1.8;
        bossShakeRef.current = Math.max(0, bossShakeRef.current - 0.85);
      }
      const bossX = bossBaseX + bossShakeX;
      const bossY = bossBaseY + bossShakeY;

      // BOSS 受擊擴散衝擊波光環 (Hit Distortion Shock Ring)
      if (bossShakeRef.current > 4) {
        ctx.save();
        ctx.strokeStyle = strikeResultRef.current?.isCrit ? '#fbbf24' : '#f43f5e';
        ctx.lineWidth = 3;
        ctx.shadowColor = strikeResultRef.current?.isCrit ? '#f59e0b' : '#e11d48';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(bossX, bossY, 38 + (24 - bossShakeRef.current) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 繪製打擊飛濺火花微粒 (Strike Hit Sparks)
      strikeSparksRef.current.forEach((spk) => {
        spk.x += spk.vx;
        spk.y += spk.vy;
        spk.life -= 0.05;
        ctx.save();
        ctx.globalAlpha = Math.max(0, spk.life);
        ctx.fillStyle = spk.color;
        ctx.fillRect(spk.x - spk.size / 2, spk.y - spk.size / 2, spk.size, spk.size);
        ctx.restore();
      });
      strikeSparksRef.current = strikeSparksRef.current.filter((s) => s.life > 0);"""

if old_boss_render in code:
    code = code.replace(old_boss_render, new_boss_render, 1)
    print("Boss shake render updated successfully!")

# Update soul trails to chromatic afterimage effect
old_soul_trails = """        // Record Soul Trail (殘影回饋)
        if (isMoving || bTick % 2 === 0) {
          soulTrailRef.current.push({ x: soul.x, y: soul.y, alpha: 0.65 });
        }

        // Render Soul Trails
        soulTrailRef.current.forEach((t) => {
          ctx.save();
          ctx.globalAlpha = t.alpha * 0.4;
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('❤️', t.x, t.y);
          ctx.restore();
          t.alpha -= 0.12;
        });
        soulTrailRef.current = soulTrailRef.current.filter((t) => t.alpha > 0.05);"""

new_soul_trails = """        // Record Soul Trail (玩家躲避彈幕時的『殘影效果』)
        if (isMoving || bTick % 2 === 0) {
          soulTrailRef.current.push({ x: soul.x, y: soul.y, alpha: 0.85 });
        }

        // Render Chromatic Aberration Soul Afterimages (霓虹色散殘影)
        soulTrailRef.current.forEach((t) => {
          ctx.save();
          // Cyan chromatic ghost offset
          ctx.globalAlpha = t.alpha * 0.35;
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#0891b2';
          ctx.shadowBlur = 8;
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('❤️', t.x - 2.5, t.y);

          // Magenta chromatic ghost offset
          ctx.fillStyle = '#ec4899';
          ctx.shadowColor = '#db2777';
          ctx.fillText('❤️', t.x + 2.5, t.y);

          // Core alpha-fading red heart
          ctx.globalAlpha = t.alpha * 0.55;
          ctx.fillStyle = isPhase2 ? '#fb7185' : '#ef4444';
          ctx.fillText('❤️', t.x, t.y);
          ctx.restore();
          t.alpha -= 0.08;
        });
        soulTrailRef.current = soulTrailRef.current.filter((t) => t.alpha > 0.05);"""

if old_soul_trails in code:
    code = code.replace(old_soul_trails, new_soul_trails, 1)
    print("Soul chromatic afterimage trails updated successfully!")

# Update bullet types with high visual layers
old_bullet_types = """          if (b.type === 'anchor') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);

            const anchorColor = b.isPhase2 ? '#10b981' : '#94a3b8';
            const ringColor = b.isPhase2 ? '#5eead4' : '#e2e8f0';

            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(0, -12, 4, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = anchorColor;
            ctx.fillRect(-2, -8, 4, 20);

            ctx.fillStyle = b.isPhase2 ? '#0d9488' : '#64748b';
            ctx.fillRect(-9, -4, 18, 3.5);

            ctx.strokeStyle = b.isPhase2 ? '#2dd4bf' : '#cbd5e1';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.arc(0, 8, 9, 0.2, Math.PI - 0.2);
            ctx.stroke();

            ctx.fillStyle = b.isPhase2 ? '#a7f3d0' : '#f8fafc';
            ctx.fillRect(-11, 5, 4, 5);
            ctx.fillRect(7, 5, 4, 5);
            ctx.restore();
          } else if (b.type === 'aurora_beam') {
            b.beamProgress = (b.beamProgress || 0) + 1;
            const beamW = b.width || 32;
            const isFiring = b.beamProgress > (b.isPhase2 ? 18 : 22);

            if (!isFiring) {
              ctx.strokeStyle = b.isPhase2 ? 'rgba(244, 63, 94, 0.9)' : 'rgba(239, 68, 68, 0.85)';
              ctx.lineWidth = b.isPhase2 ? 2.5 : 2;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(b.x, by);
              ctx.lineTo(b.x, by + bh);
              ctx.stroke();
              ctx.setLineDash([]);
            } else {
              const grad = ctx.createLinearGradient(b.x - beamW / 2, by, b.x + beamW / 2, by);
              if (b.isPhase2) {
                grad.addColorStop(0, 'rgba(225, 29, 72, 0.75)');
                grad.addColorStop(0.5, 'rgba(217, 70, 239, 0.95)');
                grad.addColorStop(1, 'rgba(139, 92, 246, 0.8)');
              } else {
                grad.addColorStop(0, 'rgba(16, 185, 129, 0.7)');
                grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.95)');
                grad.addColorStop(1, 'rgba(192, 132, 252, 0.7)');
              }
              ctx.fillStyle = grad;
              ctx.fillRect(b.x - beamW / 2, by, beamW, bh);

              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.fillRect(b.x - 3, by, 6, bh);
            }
          } else if (b.type === 'rune') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.font = 'bold 16px serif';
            ctx.shadowColor = b.isPhase2 ? '#f43f5e' : '#38bdf8';
            ctx.shadowBlur = b.isPhase2 ? 10 : 8;
            ctx.fillStyle = b.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || 'ᚠ', 0, 0);
            ctx.shadowBlur = 0;
            ctx.restore();
          } else if (b.type === 'note') {
            ctx.font = 'bold 16px sans-serif';
            ctx.shadowColor = b.isPhase2 ? '#818cf8' : '#fde047';
            ctx.shadowBlur = b.isPhase2 ? 8 : 4;
            ctx.fillStyle = b.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || '♪', b.x, b.y);
            ctx.shadowBlur = 0;
          } else if (b.type === 'axe') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.fillStyle = '#78350f';
            ctx.fillRect(-2, -10, 4, 20);
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(-5, -6, 6, -Math.PI / 2, Math.PI / 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(5, -6, 6, Math.PI / 2, -Math.PI / 2);
            ctx.fill();
            ctx.restore();
          } else if (b.type === 'cannonball') {
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = b.isPhase2 ? '#5eead4' : '#cbd5e1';
            ctx.lineWidth = 1.8;
            ctx.stroke();
          } else if (b.type === 'snowflake') {
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          } else {
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = b.isPhase2 ? '#ffffff' : '#fef08a';
            ctx.beginPath();
            ctx.arc(b.x - 2, b.y - 2, b.radius * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }"""

new_bullet_types = """          // 元素彈幕視覺層次（符文、錨、光束、砲彈、音符、戰斧、雪花、熔岩）
          if (b.type === 'anchor') {
            // ⚓ 巨型鐵錨：立體切面、金屬鏈環尾跡、海水氣泡
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);

            // 向上拉伸的金屬鏈環尾跡
            ctx.strokeStyle = b.isPhase2 ? 'rgba(45, 212, 191, 0.45)' : 'rgba(148, 163, 184, 0.4)';
            ctx.lineWidth = 2;
            for (let c = 1; c <= 3; c++) {
              ctx.strokeRect(-2, -14 - c * 7, 4, 5);
            }

            const anchorColor = b.isPhase2 ? '#10b981' : '#94a3b8';
            const ringColor = b.isPhase2 ? '#5eead4' : '#f8fafc';

            // 外層幽靈光暈
            ctx.strokeStyle = b.isPhase2 ? 'rgba(52, 211, 153, 0.5)' : 'rgba(56, 189, 248, 0.35)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 8, 12, 0, Math.PI);
            ctx.stroke();

            // 頂部金屬圓環
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.arc(0, -12, 5, 0, Math.PI * 2);
            ctx.stroke();

            // 主錨柱
            ctx.fillStyle = anchorColor;
            ctx.fillRect(-2.5, -8, 5, 22);

            // 橫梁
            ctx.fillStyle = b.isPhase2 ? '#0d9488' : '#64748b';
            ctx.fillRect(-11, -4, 22, 4);

            // 雙爪彎弧
            ctx.strokeStyle = b.isPhase2 ? '#2dd4bf' : '#e2e8f0';
            ctx.lineWidth = 3.6;
            ctx.beginPath();
            ctx.arc(0, 8, 11, 0.2, Math.PI - 0.2);
            ctx.stroke();

            // 左右錨尖三角
            ctx.fillStyle = ringColor;
            ctx.beginPath();
            ctx.moveTo(-13, 3);
            ctx.lineTo(-8, 9);
            ctx.lineTo(-13, 9);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(13, 3);
            ctx.lineTo(8, 9);
            ctx.lineTo(13, 9);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          } else if (b.type === 'aurora_beam') {
            // 🌌 極光光束：充電預警虛線 -> 3層複合高能極光激光
            b.beamProgress = (b.beamProgress || 0) + 1;
            const beamW = b.width || 32;
            const isFiring = b.beamProgress > (b.isPhase2 ? 18 : 22);

            if (!isFiring) {
              // 預警階段：警示激光束與能量粒子匯聚
              ctx.save();
              ctx.strokeStyle = b.isPhase2 ? 'rgba(244, 63, 94, 0.95)' : 'rgba(239, 68, 68, 0.9)';
              ctx.lineWidth = b.isPhase2 ? 3 : 2;
              ctx.setLineDash([6, 4]);
              ctx.beginPath();
              ctx.moveTo(b.x, by);
              ctx.lineTo(b.x, by + bh);
              ctx.stroke();

              // 警示兩側光帶
              ctx.fillStyle = b.isPhase2 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(239, 68, 68, 0.12)';
              ctx.fillRect(b.x - beamW / 2, by, beamW, bh);
              ctx.restore();
            } else {
              // 發射階段：3層立體激光
              ctx.save();
              // Tier 1: 寬幅電離極光光霧
              const gradAura = ctx.createLinearGradient(b.x - beamW * 0.8, by, b.x + beamW * 0.8, by);
              if (b.isPhase2) {
                gradAura.addColorStop(0, 'rgba(225, 29, 72, 0)');
                gradAura.addColorStop(0.5, 'rgba(217, 70, 239, 0.45)');
                gradAura.addColorStop(1, 'rgba(225, 29, 72, 0)');
              } else {
                gradAura.addColorStop(0, 'rgba(16, 185, 129, 0)');
                gradAura.addColorStop(0.5, 'rgba(6, 182, 212, 0.45)');
                gradAura.addColorStop(1, 'rgba(16, 185, 129, 0)');
              }
              ctx.fillStyle = gradAura;
              ctx.fillRect(b.x - beamW * 0.8, by, beamW * 1.6, bh);

              // Tier 2: 霓虹高能柱
              const grad = ctx.createLinearGradient(b.x - beamW / 2, by, b.x + beamW / 2, by);
              if (b.isPhase2) {
                grad.addColorStop(0, 'rgba(244, 63, 94, 0.85)');
                grad.addColorStop(0.5, 'rgba(251, 191, 36, 0.95)');
                grad.addColorStop(1, 'rgba(168, 85, 247, 0.85)');
              } else {
                grad.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
                grad.addColorStop(0.5, 'rgba(103, 232, 249, 0.95)');
                grad.addColorStop(1, 'rgba(59, 130, 246, 0.8)');
              }
              ctx.fillStyle = grad;
              ctx.fillRect(b.x - beamW / 2, by, beamW, bh);

              // Tier 3: 核心純白熾熱電漿射線
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = 12;
              ctx.fillRect(b.x - 3.5, by, 7, bh);
              ctx.restore();
            }
          } else if (b.type === 'rune') {
            // ᚠ 古代盧恩符文：旋轉雙層同心法陣光環、自體發光
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);

            // 外層同心光環
            ctx.strokeStyle = b.isPhase2 ? 'rgba(244, 63, 94, 0.7)' : 'rgba(56, 189, 248, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius + 4, 0, Math.PI * 2);
            ctx.stroke();

            // 內層符印金環
            ctx.strokeStyle = b.isPhase2 ? '#fbbf24' : '#67e8f9';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius + 1.5, 0, Math.PI * 2);
            ctx.stroke();

            // 符文銘刻主體
            ctx.font = 'bold 17px serif';
            ctx.shadowColor = b.isPhase2 ? '#f43f5e' : '#38bdf8';
            ctx.shadowBlur = b.isPhase2 ? 14 : 10;
            ctx.fillStyle = b.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || 'ᚠ', 0, 0);

            // 中心晶石微粒
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-1.5, -1.5, 3, 3);
            ctx.restore();
          } else if (b.type === 'note') {
            // 🎵 音符彈幕：同心擴散音波震波環、譜號輝光
            ctx.save();
            ctx.translate(b.x, b.y);
            // 音波震波環
            const waveR = b.radius + Math.sin(bTick * 0.25) * 5 + 3;
            ctx.strokeStyle = b.isPhase2 ? 'rgba(129, 140, 248, 0.5)' : 'rgba(250, 204, 21, 0.5)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(0, 0, waveR, 0, Math.PI * 2);
            ctx.stroke();

            ctx.font = 'bold 18px sans-serif';
            ctx.shadowColor = b.isPhase2 ? '#a855f7' : '#fde047';
            ctx.shadowBlur = b.isPhase2 ? 10 : 8;
            ctx.fillStyle = b.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || '♪', 0, 0);
            ctx.restore();
          } else if (b.type === 'axe') {
            // 🪓 狂戰士旋轉飛斧：雙月牙利刃、深紅風暴弧線、火星
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);

            // 旋風刀刃氣芒殘影
            ctx.strokeStyle = b.isPhase2 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(249, 115, 22, 0.5)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 1.5);
            ctx.stroke();

            // 木柄
            ctx.fillStyle = '#78350f';
            ctx.fillRect(-2, -12, 4, 24);

            // 雙刃月牙鋼斧
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(-7, -6, 7, -Math.PI / 2, Math.PI / 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(7, -6, 7, Math.PI / 2, -Math.PI / 2);
            ctx.fill();

            // 刃口銀白高光
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-12, -7, 2, 4);
            ctx.fillRect(10, -7, 2, 4);
            ctx.restore();
          } else if (b.type === 'cannonball') {
            // 💣 重型生鐵加農砲彈：球體立體高光、火藥尾煙
            ctx.save();
            // 後方煙幕與火星
            ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
            ctx.beginPath();
            ctx.arc(b.x - b.vx * 2, b.y - b.vy * 2, b.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();

            // 鐵球主體
            const ballGrad = ctx.createRadialGradient(b.x - 3, b.y - 3, 2, b.x, b.y, b.radius);
            ballGrad.addColorStop(0, '#94a3b8');
            ballGrad.addColorStop(0.4, b.color);
            ballGrad.addColorStop(1, '#0f172a');
            ctx.fillStyle = ballGrad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = b.isPhase2 ? '#2dd4bf' : '#cbd5e1';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'snowflake') {
            // ❄️ 極地六角冰晶雪花：刺針結晶、菱形冰芯
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.6;
            ctx.shadowColor = '#67e8f9';
            ctx.shadowBlur = 6;
            for (let arm = 0; arm < 6; arm++) {
              const ang = (arm / 6) * Math.PI * 2 + bTick * 0.05;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(Math.cos(ang) * b.radius, Math.sin(ang) * b.radius);
              ctx.stroke();
            }
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            // 🌋 穆斯貝爾海姆熔岩火球：熔融金核、翻滾日珥邊緣
            ctx.save();
            const magGrad = ctx.createRadialGradient(b.x - 2, b.y - 2, 2, b.x, b.y, b.radius + 3);
            magGrad.addColorStop(0, '#ffffff');
            magGrad.addColorStop(0.3, '#fef08a');
            magGrad.addColorStop(0.7, '#ea580c');
            magGrad.addColorStop(1, 'rgba(194, 65, 12, 0)');
            ctx.fillStyle = magGrad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius + 3, 0, Math.PI * 2);
            ctx.fill();

            // 核心熔融
            ctx.fillStyle = b.isPhase2 ? '#ffffff' : '#fbbf24';
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }"""

if old_bullet_types in code:
    code = code.replace(old_bullet_types, new_bullet_types, 1)
    print("Multi-tier elemental bullets updated successfully!")

# =========================================================================
# 8. Update renderWorldMap: Roving NPCs, Boss trigger radius, and Navigation Compass
# =========================================================================
old_world_map_npcs = """      // 3. Draw All Story Quest-Giver NPCs for the current chapter
      const currentChapterNpcs = PRIMARY_STORY_NPCS.filter((n) => n.chapterId === currentChapter.id);
      currentChapterNpcs.forEach((npc) => {
        const isNpcDone = playerState.claimedNpcRewards.includes(npc.id) || (npc.id === currentChapter.primaryStoryNpcId && isCurrentStoryLearned);
        drawPrimaryStoryNpc(ctx, npc, tick, isNpcDone, playerState.courage);

        // Near-player Interaction prompt badge
        const dNpc = Math.hypot(playerPosRef.current.x - npc.x, playerPosRef.current.y - npc.y);
        if (dNpc < 52) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(npc.x - 34, npc.y - 56, 68, 16);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(npc.x - 34, npc.y - 56, 68, 16);
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💬 [E] 對話', npc.x, npc.y - 45);
        }
      });"""

new_world_map_npcs = """      // 3. Draw All Story Quest-Giver NPCs for the current chapter
      const currentChapterNpcs = PRIMARY_STORY_NPCS.filter((n) => n.chapterId === currentChapter.id);
      currentChapterNpcs.forEach((npc) => {
        const isNpcDone = playerState.claimedNpcRewards.includes(npc.id) || (npc.id === currentChapter.primaryStoryNpcId && isCurrentStoryLearned);
        drawPrimaryStoryNpc(ctx, npc, tick, isNpcDone, playerState.courage);

        // Near-player Interaction prompt badge
        const dNpc = Math.hypot(playerPosRef.current.x - npc.x, playerPosRef.current.y - npc.y);
        if (dNpc < 52) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(npc.x - 34, npc.y - 56, 68, 16);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(npc.x - 34, npc.y - 56, 68, 16);
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💬 [E] 對話', npc.x, npc.y - 45);
        }
      });

      // 3.5 Update and Draw Roving Historical NPCs (斯德哥爾摩 & 冰島黃金圈 移動歷史 NPC)
      const chapterRovingNpcs = ROVING_HISTORICAL_NPCS.filter((n) => n.chapterId === currentChapter.id);
      chapterRovingNpcs.forEach((rNpc) => {
        // 移動巡邏物理計算 (Patrol Trajectory)
        rNpc.x += rNpc.dir * rNpc.speed;
        if (rNpc.x >= rNpc.maxX) {
          rNpc.x = rNpc.maxX;
          rNpc.dir = -1;
        } else if (rNpc.x <= rNpc.minX) {
          rNpc.x = rNpc.minX;
          rNpc.dir = 1;
        }

        drawRovingHistoricalNpc(ctx, rNpc, tick);

        // 玩家靠近提示與按鍵交互
        const dRov = Math.hypot(playerPosRef.current.x - rNpc.x, playerPosRef.current.y - rNpc.y);
        if (dRov < 56) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.fillRect(rNpc.x - 48, rNpc.y - 58, 96, 18);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.3;
          ctx.strokeRect(rNpc.x - 48, rNpc.y - 58, 96, 18);
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💬 [E] 歷史交流', rNpc.x, rNpc.y - 46);

          if (keysDownRef.current['e'] || keysDownRef.current['enter'] || keysDownRef.current[' ']) {
            if (!activeRovingNpc && !activeStoryNpc) {
              setActiveRovingNpc(rNpc);
              playRetroSound('blip');
            }
          }
        }
      });"""

if old_world_map_npcs in code:
    code = code.replace(old_world_map_npcs, new_world_map_npcs, 1)
    print("Roving NPCs on world map added successfully!")

# Update Boss trigger logic in renderWorldMap
old_boss_trigger = """      // Proximity & Interaction Prompt (修復無法觸發BOSS戰：允許重戰且按E/靠近均可進入)
      if (distToBoss < 75) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.fillRect(bossX - 65, bossY - 62, 130, 24);
        ctx.strokeStyle = isBossBeaten ? '#10b981' : '#f43f5e';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(bossX - 65, bossY - 62, 130, 24);
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.fillText(isBossBeaten ? '⚔️ [E] 再次討伐 / 切磋' : '⚔️ [E] 踏入決鬥場開戰', bossX, bossY - 46);

        if (distToBoss < 44 || keysDownRef.current['e'] || keysDownRef.current['enter'] || keysDownRef.current[' ']) {
          if (!inBattle) {
            startUndertaleBossBattle();
          }
        }
      }"""

new_boss_trigger = """      // Proximity & Interaction Prompt (修復無法觸發BOSS戰：擴大感應半徑至 85px，保證直接開戰)
      if (distToBoss < 88) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fillRect(bossX - 75, bossY - 68, 150, 26);
        ctx.strokeStyle = isBossBeaten ? '#10b981' : '#f43f5e';
        ctx.lineWidth = 2;
        ctx.strokeRect(bossX - 75, bossY - 68, 150, 26);
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.fillText(isBossBeaten ? '⚔️ [E] 再次討伐 / 切磋' : '⚔️ [E] 踏入決鬥場開戰', bossX, bossY - 51);

        if (distToBoss < 52 || keysDownRef.current['e'] || keysDownRef.current['enter'] || keysDownRef.current[' ']) {
          if (!inBattle) {
            startUndertaleBossBattle();
          }
        }
      }"""

if old_boss_trigger in code:
    code = code.replace(old_boss_trigger, new_boss_trigger, 1)
    print("Boss proximity trigger updated successfully!")

# Update handleCanvasClick to support roving NPCs and robust boss clicking
old_canvas_click = """    // Click on Boss Altar (修復無法觸發BOSS戰：點擊BOSS直接開戰)
    const bossX = canvas.width - 150;
    const bossY = canvas.height - 120;
    if (Math.hypot(clickX - bossX, clickY - bossY) < 56) {
      startUndertaleBossBattle();
      return;
    }"""

new_canvas_click = """    // Click on Roving Historical NPCs (斯德哥爾摩與冰島移動NPC)
    const currentChapterRoving = ROVING_HISTORICAL_NPCS.filter((n) => n.chapterId === currentChapter.id);
    for (const rNpc of currentChapterRoving) {
      if (Math.hypot(clickX - rNpc.x, clickY - rNpc.y) < 42) {
        setActiveRovingNpc(rNpc);
        playRetroSound('blip');
        return;
      }
    }

    // Click on Boss Altar (修復無法觸發BOSS戰：半徑75px內點擊BOSS直接開戰)
    const bossX = canvas.width - 150;
    const bossY = canvas.height - 120;
    if (Math.hypot(clickX - bossX, clickY - bossY) < 75) {
      startUndertaleBossBattle();
      return;
    }"""

if old_canvas_click in code:
    code = code.replace(old_canvas_click, new_canvas_click, 1)
    print("handleCanvasClick updated with roving NPCs and enlarged boss hit area!")

# Add Navigation Compass HUD overlay to World Map canvas
compass_hud_code = """      // 11.5 Top-Right Nav Compass HUD (地圖導航雷達與方位指示)
      const compassX = width - 110;
      const compassY = 32;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(compassX - 60, compassY - 14, 120, 28);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(compassX - 60, compassY - 14, 120, 28);
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      const dBossM = Math.round(Math.hypot(playerPosRef.current.x - (width - 150), playerPosRef.current.y - (height - 120)));
      ctx.fillText(`🧭 BOSS: ↘ ${dBossM}m`, compassX, compassY + 4);"""

if "drawPlayerFootprintTrails" in code and "Top-Right Nav Compass HUD" not in code:
    code = code.replace("drawPlayerFootprintTrails", compass_hud_code + "\n\n      drawPlayerFootprintTrails", 1)
    print("Added Nav Compass HUD to world map!")

# =========================================================================
# 9. Add Roving NPC Dialogue Modal to JSX
# =========================================================================
old_active_story_modal = "{activeStoryNpc && ("
roving_npc_modal_code = """        {/* Roving Historical NPC Dialogue Modal (移動歷史 NPC 專屬典故對話視窗) */}
        {activeRovingNpc && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in select-none">
            <div className="w-full max-w-lg bg-slate-900 border-2 border-cyan-500/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border-2 border-cyan-500 flex items-center justify-center text-2xl relative shadow-lg">
                    {activeRovingNpc.avatar}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-serif">{activeRovingNpc.name}</h4>
                    <span className="text-[11px] text-cyan-400 font-mono">{activeRovingNpc.title}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveRovingNpc(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Roving NPC Speech */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-200">
                <p className="font-serif text-sm text-cyan-200">
                  {activeRovingNpc.dialogue}
                </p>
              </div>

              {/* Historical Lore Trivia Box */}
              <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-800/60 text-xs leading-relaxed text-slate-300">
                <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">📜 歷史實地考據：</div>
                <p className="text-[11px] text-slate-300">{activeRovingNpc.triviaLore}</p>
              </div>

              {/* Actions & Rewards */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="text-[11px] font-mono text-amber-300 flex items-center gap-2">
                  <span>✨ 交流獎勵：+{activeRovingNpc.giftCourage} 勇氣 / +{activeRovingNpc.giftGold} G</span>
                </div>
                <button
                  onClick={() => {
                    playRetroSound('fanfare');
                    const rNpc = activeRovingNpc;
                    const isFirstTime = !playerState.claimedNpcRewards.includes(rNpc.id);
                    setPlayerState((prev) => {
                      const updated = {
                        ...prev,
                        courage: isFirstTime ? prev.courage + rNpc.giftCourage : prev.courage,
                        gold: isFirstTime ? prev.gold + rNpc.giftGold : prev.gold,
                        claimedNpcRewards: isFirstTime ? [...prev.claimedNpcRewards, rNpc.id] : prev.claimedNpcRewards,
                        activeBuff: rNpc.giftBuff || prev.activeBuff,
                      };
                      saveGame(updated);
                      return updated;
                    });
                    setActiveRovingNpc(null);
                    if (isFirstTime) {
                      setActiveEvent({
                        title: `✨ 歷史交流禮遇：${rNpc.name.split(' ')[0]}`,
                        description: `成功聆聽【${rNpc.name}】的歷史考據！\\n\\n獲得獎勵：\\n🔥 勇氣值 +${rNpc.giftCourage}\\n🪙 金幣 +${rNpc.giftGold} G\\n🌟 獲得歷史增益：【${rNpc.giftBuff}】！`,
                        icon: rNpc.avatar,
                      });
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  【銘記歷史考據並接受祝福】
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStoryNpc && ("""

if old_active_story_modal in code and "activeRovingNpc &&" not in code:
    code = code.replace(old_active_story_modal, roving_npc_modal_code, 1)
    print("Added Roving NPC modal to JSX successfully!")

# =========================================================================
# 10. Direct Battle trigger button in Chapter Checklist overlay
# =========================================================================
old_checklist_boss = """                      <span className={isCurrentBossBeaten ? 'text-emerald-300' : 'text-rose-300'}>
                        守護 BOSS：{currentChapter.boss.name} ({isCurrentBossBeaten ? '已討伐' : '未降伏'})
                      </span>"""

new_checklist_boss = """                      <span className={isCurrentBossBeaten ? 'text-emerald-300' : 'text-rose-300'}>
                        守護 BOSS：{currentChapter.boss.name} ({isCurrentBossBeaten ? '已討伐' : '未降伏'})
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startUndertaleBossBattle();
                        }}
                        className="ml-2 px-1.5 py-0.5 rounded bg-rose-950 hover:bg-rose-900 border border-rose-500 text-[10px] text-rose-300 font-bold cursor-pointer transition-colors"
                      >
                        ⚔️ 進入決戰
                      </button>"""

if old_checklist_boss in code:
    code = code.replace(old_checklist_boss, new_checklist_boss, 1)
    print("Added direct battle button to checklist overlay!")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("All RPG enhancements saved successfully!")
