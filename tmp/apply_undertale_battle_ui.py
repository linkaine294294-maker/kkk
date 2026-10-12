import re

with open('src/components/PolarExpressReindeerRpgModal.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the 3 buttons block with Undertale 4-Action grid + Item menu & Epic Chant triggers
old_action_grid = '''                      /* Nordic Landmark Danmaku Narrative & Relic Resonance Seals (Replaces old Fight/Act/Item/Mercy buttons) */
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        <button
                          onClick={() => handleUndertaleAction('fight')}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 disabled:opacity-40 border border-amber-500/40 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center gap-3"
                        >
                          <span className="text-2xl">⚡</span>
                          <div>
                            <div className="text-xs font-bold text-amber-300 font-serif">盧恩破擊共鳴</div>
                            <p className="text-[10px] text-slate-400 mt-0.5">凝聚極地決心 · 觸發盧恩斬擊震盪</p>
                          </div>
                        </button>

                        <button
                          onClick={() => handleUndertaleAction('act_talk')}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 disabled:opacity-40 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all cursor-pointer flex items-center gap-3"
                        >
                          <span className="text-2xl">📜</span>
                          <div>
                            <div className="text-xs font-bold text-cyan-300 font-serif">北歐地標史詩詠唱</div>
                            <p className="text-[10px] text-slate-400 mt-0.5">引動地標傳說共鳴 · 緩和彈幕狂瀾</p>
                          </div>
                        </button>

                        <button
                          onClick={() => handleUndertaleAction('item')}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 disabled:opacity-40 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all cursor-pointer flex items-center gap-3"
                        >
                          <span className="text-2xl">🍲</span>
                          <div>
                            <div className="text-xs font-bold text-emerald-300 font-serif">{currentChapter.michelinBuff.name}</div>
                            <p className="text-[10px] text-slate-400 mt-0.5">汲取星級料理暖流 · 修復靈魂容器</p>
                          </div>
                        </button>
                      </div>'''

new_action_grid = '''                      /* Undertale Iconic 4-Action Grid: FIGHT, ACT (史詩詠唱), ITEM (商店料理), MERCY (仁慈寬恕) */
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {/* 1. FIGHT */}
                        <button
                          onClick={() => handleUndertaleAction('fight')}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className="p-2.5 rounded-xl bg-slate-950 hover:bg-amber-950/40 disabled:opacity-40 border-2 border-amber-500/70 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-lg group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">⚔️</span>
                          <div>
                            <div className="text-xs font-bold text-amber-300 font-mono tracking-wider">【FIGHT 破擊】</div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">盧恩精準斬擊</p>
                          </div>
                        </button>

                        {/* 2. ACT 史詩詠唱 (透過與 BOSS 溝通，選對選項有機會直接通關！) */}
                        <button
                          onClick={() => {
                            setIsEpicChantMenuOpen(true);
                            setEpicChantRoundIdx(0);
                            setEpicChantFeedback(null);
                            playRetroSound('blip');
                          }}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 disabled:opacity-40 border-2 border-cyan-500/70 hover:border-cyan-400 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-lg group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">📜</span>
                          <div>
                            <div className="text-xs font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-1">
                              <span>【ACT 詠唱】</span>
                              <span className="text-[8.5px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50">和解通關</span>
                            </div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">靈魂哲思共鳴溝通</p>
                          </div>
                        </button>

                        {/* 3. ITEM 商店食物 (右下：必須在商店購買食物才能使用！) */}
                        <button
                          onClick={() => {
                            setIsItemMenuOpen(true);
                            playRetroSound('blip');
                          }}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className={`p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950/40 disabled:opacity-40 border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-lg group relative ${
                            (playerState.inventory || []).filter((i) => i.count > 0).length === 0
                              ? 'border-emerald-600/40 border-dashed hover:border-emerald-500'
                              : 'border-emerald-500/80 hover:border-emerald-400'
                          }`}
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">🍲</span>
                          <div>
                            <div className="text-xs font-bold text-emerald-300 font-mono tracking-wider flex items-center gap-1">
                              <span>【ITEM 食物】</span>
                              <span className="text-[8.5px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-mono">
                                {(playerState.inventory || []).filter((i) => i.count > 0).reduce((sum, i) => sum + i.count, 0)} 份
                              </span>
                            </div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">
                              {(playerState.inventory || []).filter((i) => i.count > 0).length === 0
                                ? '需商店購買料理'
                                : '享用料理修復生命'}
                            </p>
                          </div>
                        </button>

                        {/* 4. MERCY 仁慈寬恕 */}
                        <button
                          onClick={() => handleUndertaleAction('mercy')}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className="p-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 disabled:opacity-40 border-2 border-rose-500/70 hover:border-rose-400 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-lg group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">🕊️</span>
                          <div>
                            <div className="text-xs font-bold text-rose-300 font-mono tracking-wider">【MERCY 寬恕】</div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">放下兵刃和平交涉</p>
                          </div>
                        </button>
                      </div>'''

if old_action_grid in code:
    code = code.replace(old_action_grid, new_action_grid, 1)
    print('Replaced battle action grid')
else:
    print('Warning: old_action_grid not matched exactly')

# Now let's add the modals for:
# 1) activeBuildingModal (進入城鎮特色建築)
# 2) isItemMenuOpen (戰鬥中商店食物背包選單)
# 3) isEpicChantMenuOpen (史詩詠唱·靈魂對話溝通選單)
modal_insert_marker = '{/* Interactive Nordic Regional Shop Modal (北歐特色商店系統) */}'
new_modals = '''{/* Interactive Nordic Regional Building Modal (城鎮特色互動建築系統) */}
        {activeBuildingModal && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
            <div className="w-full max-w-lg bg-slate-900 border-2 border-cyan-500/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              {/* Corner runes */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              {/* Building Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border-2 border-cyan-500 flex items-center justify-center text-2xl shadow-lg">
                    {activeBuildingModal.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
                      <span>{activeBuildingModal.name}</span>
                    </h4>
                    <span className="text-[11px] text-cyan-300 font-mono">
                      {activeBuildingModal.subtitle}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveBuildingModal(null);
                    setBuildingToast(null);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Atmosphere / Greeting */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 leading-relaxed font-serif">
                <p className="text-amber-200/90 font-medium">{activeBuildingModal.greeting}</p>
                <p className="text-slate-400 text-[11px] mt-2 leading-normal">{activeBuildingModal.description}</p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    playRetroSound('fanfare');
                    if (activeBuildingModal.rewardType === 'full_heal') {
                      setPlayerState((p) => ({ ...p, hp: p.maxHp, mp: p.maxMp }));
                    } else if (activeBuildingModal.rewardType === 'attack_boost') {
                      setPlayerState((p) => ({ ...p, attackPower: p.attackPower + 15 }));
                    } else if (activeBuildingModal.rewardType === 'courage_lore') {
                      setPlayerState((p) => ({
                        ...p,
                        courage: p.courage + 15,
                        learnedStories: Array.from(new Set([...p.learnedStories, currentChapter.id])),
                      }));
                    } else if (activeBuildingModal.rewardType === 'valkyrie_shield') {
                      aegisChargesRef.current = (aegisChargesRef.current || 0) + 1;
                    }
                    setBuildingToast(activeBuildingModal.rewardLabel);
                    setTimeout(() => setBuildingToast(null), 3500);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{activeBuildingModal.actionButtonText}</span>
                  <span className="text-amber-300">({activeBuildingModal.rewardLabel})</span>
                </button>
              </div>

              {buildingToast && (
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-xs text-emerald-300 font-mono text-center animate-in fade-in">
                  {buildingToast}
                </div>
              )}
            </div>
          </div>
        )}

        {/* In-Battle Food Inventory Modal (右下食物：必須在商店購買才能在戰鬥中使用！) */}
        {isItemMenuOpen && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
            <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-xl shadow-lg">
                    🍲
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
                      <span>戰鬥料理食物背包 (ITEM)</span>
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ※ 僅可使用在城鎮商店購買的北歐料理美食
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsItemMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List or Empty Prompt */}
              {(() => {
                const availableFoods = (playerState.inventory || []).filter((i) => i.count > 0);
                if (availableFoods.length === 0) {
                  return (
                    <div className="p-5 rounded-xl bg-slate-950/90 border border-amber-500/40 text-center space-y-3">
                      <div className="text-3xl">🧺</div>
                      <div className="text-sm font-bold text-amber-300 font-serif">背包中沒有任何料理食物！</div>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                        戰鬥食物必須先在各國【城鎮商店】向店主購買（例如：丹麥新港香料熱紅酒、芬蘭傳統肉桂捲、拉普蘭野生蔓越莓果醬等），方可在 BOSS 戰中使用修復靈魂！
                      </p>
                      <button
                        onClick={() => setIsItemMenuOpen(false)}
                        className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        我知道了，返回戰鬥
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {availableFoods.map((food) => (
                      <div
                        key={food.id}
                        className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/60 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{food.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>{food.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono">
                                剩餘: {food.count} 份
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">{food.description}</p>
                            <span className="text-[10px] text-cyan-300 font-mono">{food.effectLabel}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playRetroSound('heal');
                            // Deduct 1 food
                            setPlayerState((p) => {
                              const updatedInv = (p.inventory || []).map((it) =>
                                it.id === food.id ? { ...it, count: it.count - 1 } : it
                              ).filter((it) => it.count > 0);
                              const healHp = food.healAmount || 75;
                              return {
                                ...p,
                                hp: Math.min(p.maxHp, p.hp + healHp),
                                inventory: updatedInv,
                                activeBuff: food.name,
                              };
                            });
                            setBossSpeech(`「……聞到了【${food.name}】的極地濃郁香氣！你的生命容器已全面修復！」`);
                            setIsItemMenuOpen(false);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all cursor-pointer shrink-0 shadow-lg"
                        >
                          享用料理
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Epic Chant Dialogue Communication Modal (史詩詠唱·靈魂溝通共鳴 · 選對選項可直接和平通關！) */}
        {isEpicChantMenuOpen && (() => {
          const bossKey = currentChapter.boss.bossType;
          const chantConfig = BOSS_EPIC_CHANT_DATA[bossKey] || BOSS_EPIC_CHANT_DATA.harald_bluetooth;
          const curRound = chantConfig.rounds[epicChantRoundIdx] || chantConfig.rounds[0];

          return (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
              <div className="w-full max-w-xl bg-slate-900 border-2 border-cyan-400/90 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
                {/* Runic Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-300 pointer-events-none" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-300 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-300 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-2xl shadow-lg">
                      {chantConfig.bossAvatar}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
                        <span>【史詩詠唱 · 靈魂溝通】</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                          階段 {epicChantRoundIdx + 1} / {chantConfig.rounds.length}
                        </span>
                      </h4>
                      <span className="text-[11px] text-cyan-300 font-mono">
                        {chantConfig.bossName} · {chantConfig.bossTitle}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEpicChantMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Boss Philosophical Dilemma Speech */}
                <div className="p-4 rounded-xl bg-slate-950/95 border border-cyan-500/40 space-y-2">
                  <div className="text-[11px] text-cyan-400 font-mono flex items-center justify-between">
                    <span>👑 BOSS 靈魂之聲：</span>
                    <span className="text-[10px] text-slate-400">請審慎理解其歷史與內心執念</span>
                  </div>
                  <p className="text-sm font-serif text-amber-200/95 leading-relaxed font-medium">
                    {curRound.prompt}
                  </p>
                </div>

                {/* Intermediate Feedback Banner if player just answered */}
                {epicChantFeedback ? (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-3 ${
                    epicChantFeedback.isCorrect
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                  }`}>
                    <div className="font-bold flex items-center gap-2 text-sm">
                      <span>{epicChantFeedback.isCorrect ? '✨ 靈魂共鳴撼動心靈！' : '💢 BOSS 勃然大怒！'}</span>
                    </div>
                    <p className="font-serif italic text-white/90">
                      {epicChantFeedback.quote}
                    </p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          if (epicChantFeedback.isCorrect) {
                            // Advance to next round or direct win
                            if (epicChantRoundIdx < chantConfig.rounds.length - 1) {
                              setEpicChantRoundIdx((prev) => prev + 1);
                              setEpicChantFeedback(null);
                            } else {
                              // Direct PACIFIST CLEAR!
                              playRetroSound('fanfare');
                              setBossSpeech(chantConfig.pacifistClearSpeech);
                              setIsEpicChantMenuOpen(false);
                              setBattlePhase('victory');
                              setPlayerState((p) => ({
                                ...p,
                                gold: p.gold + 180,
                                courage: p.courage + 25,
                                clearedBosses: Array.from(new Set([...p.clearedBosses, currentChapter.boss.id])),
                                learnedStories: Array.from(new Set([...p.learnedStories, currentChapter.id])),
                              }));
                            }
                          } else {
                            // Wrong choice -> Enraged dodge phase!
                            setIsEpicChantMenuOpen(false);
                            setDodgeTimer(6.0);
                            soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
                            bulletsRef.current = [];
                            setBossSpeech('「無知凡人！感受狂暴彈幕的怒火！」');
                            setBattlePhase('dodge');
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg ${
                          epicChantFeedback.isCorrect
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        {epicChantFeedback.isCorrect
                          ? epicChantRoundIdx < chantConfig.rounds.length - 1
                            ? '🌟 繼續深層共鳴 →'
                            : '🕊️ 達成和平和解通關！'
                          : '⚡ 迎戰狂暴彈幕'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Choices list */
                  <div className="space-y-2">
                    <div className="text-[11px] text-slate-400 font-mono">
                      請選擇史詩回應選項（選對深層同理選項可直接通關）：
                    </div>
                    {curRound.choices.map((choice, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => {
                          if (choice.isCorrect) {
                            playRetroSound('magic');
                            setEpicChantFeedback({ quote: choice.reaction, isCorrect: true });
                          } else {
                            playRetroSound('hit');
                            setEpicChantFeedback({ quote: choice.reaction, isCorrect: false });
                          }
                        }}
                        className="w-full p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-cyan-400/80 hover:bg-slate-800/80 text-left transition-all cursor-pointer group flex items-start gap-2.5"
                      >
                        <span className="text-cyan-400 font-mono font-bold text-xs mt-0.5 group-hover:scale-125 transition-transform">
                          {cIdx + 1}.
                        </span>
                        <span className="text-xs text-slate-200 group-hover:text-white leading-relaxed font-serif">
                          {choice.text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        '''

if modal_insert_marker in code:
    code = code.replace(modal_insert_marker, new_modals + '\n        ' + modal_insert_marker, 1)
    print('Inserted interactive modals into JSX')
else:
    print('Warning: modal_insert_marker not matched')

with open('src/components/PolarExpressReindeerRpgModal.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Done applying Undertale battle UI updates')
