
import React, { useState, useEffect, useCallback } from 'react';
import { GameStage, GameState, LevelData } from './types';
import { INITIAL_STATE, LEVELS, BIRDS } from './constants';
import GameHUD from './components/GameHUD';
import IsometricScene from './components/IsometricScene';
import Encyclopedia from './components/Encyclopedia';
import { getBirdFact } from './services/gemini';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({ ...INITIAL_STATE, isSolved: false });
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null);
  const [birdFact, setBirdFact] = useState<string>("");
  const [isCrisis, setIsCrisis] = useState(false);
  const [isDeathFlash, setIsDeathFlash] = useState(false);

  const currentLevel = LEVELS[gameState.stage] as LevelData | undefined;

  useEffect(() => {
    if (gameState.stage !== GameStage.START && gameState.stage !== GameStage.SUMMARY) {
      const birdNames = Object.values(BIRDS).map(b => b.name);
      const randomBird = birdNames[Math.floor(Math.random() * birdNames.length)];
      getBirdFact(randomBird).then(setBirdFact);
    }
    setGameState(prev => ({ ...prev, isSolved: false }));
  }, [gameState.stage]);

  const handleChoice = (choiceId: string) => {
    if (!currentLevel) return;
    const choice = currentLevel.choices.find(c => c.id === choiceId);
    if (!choice) return;

    if (gameState.budget < choice.cost) {
      alert("资金不足，请选择更经济的方案。");
      return;
    }

    const isCorrect = choice.isCorrect;
    const birdsArray = Object.keys(BIRDS);
    const newUnlocked = [...gameState.unlockedBirds];
    const newBird = birdsArray[gameState.stage === GameStage.MORNING ? 1 : gameState.stage === GameStage.NOON ? 2 : 0];
    if (isCorrect && !newUnlocked.includes(newBird)) {
      newUnlocked.push(newBird);
    }

    setGameState(prev => ({
      ...prev,
      budget: prev.budget - choice.cost,
      satisfaction: Math.max(0, Math.min(100, prev.satisfaction + choice.satisfactionChange)),
      unlockedBirds: newUnlocked,
      isSolved: isCorrect
    }));

    setCurrentFeedback(choice.feedback);
    if (!isCorrect) {
      setIsCrisis(true);
      setTimeout(() => setIsCrisis(false), 2000);
    }
  };

  const onBirdDeath = useCallback(() => {
    setGameState(prev => ({ ...prev, birdDeaths: prev.birdDeaths + 1 }));
    setIsDeathFlash(true);
    setTimeout(() => setIsDeathFlash(false), 150);
  }, []);

  const onBirdSaved = useCallback(() => {
    setGameState(prev => ({ ...prev, birdSaved: prev.birdSaved + 1 }));
  }, []);

  const nextStage = () => {
    setCurrentFeedback(null);
    const stages = [GameStage.START, GameStage.MORNING, GameStage.NOON, GameStage.NIGHT, GameStage.SUMMARY];
    const currentIndex = stages.indexOf(gameState.stage);
    if (currentIndex < stages.length - 1) {
      setGameState(prev => ({ ...prev, stage: stages[currentIndex + 1] }));
    }
  };

  const resetGame = () => {
    setGameState({ ...INITIAL_STATE, isSolved: false });
    setCurrentFeedback(null);
  };

  const toggleBirdView = () => {
    setGameState(prev => ({ ...prev, isBirdView: !prev.isBirdView }));
  };

  const totalBirds = gameState.birdSaved + gameState.birdDeaths;
  const survivalRate = totalBirds > 0 ? (gameState.birdSaved / totalBirds) * 100 : 100;

  if (gameState.stage === GameStage.START) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-teal-50 p-6 text-center">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-teal-800 tracking-tight">城市生态规划师</h1>
            <p className="text-2xl text-teal-600 font-medium">候鸟迁徙守护行动</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl space-y-4 text-slate-600 leading-relaxed text-left">
            <p>每年，数以亿计的候鸟在迁徙征途中穿过我们的城市。</p>
            <p>作为城市规划师，你需要通过改造设施，将它们从<span className="font-bold text-teal-700">玻璃幻境、光污染和空中乱绳</span>中拯救出来。</p>
            <p className="text-sm italic text-slate-400">注意：你的决策会实时影响飞行中的候鸟！</p>
          </div>
          <button onClick={nextStage} className="px-12 py-5 bg-teal-600 text-white text-xl font-bold rounded-full hover:bg-teal-700 transition-all hover:scale-105 shadow-lg shadow-teal-200">开启守护行动</button>
        </div>
      </div>
    );
  }

  if (gameState.stage === GameStage.SUMMARY) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-blue-50 p-6 text-center">
        <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl p-12 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-teal-500"></div>
          <h2 className="text-4xl font-black text-slate-800">行动评估报告</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-green-50 p-6 rounded-3xl">
                <span className="block text-sm text-green-600 font-bold mb-1">成功拯救候鸟</span>
                <span className="text-4xl font-black text-green-700">{gameState.birdSaved}</span>
             </div>
             <div className="bg-red-50 p-6 rounded-3xl">
                <span className="block text-sm text-red-600 font-bold mb-1">坠亡记录</span>
                <span className="text-4xl font-black text-red-700">{gameState.birdDeaths}</span>
             </div>
          </div>
          <div className="text-left p-6 bg-slate-50 rounded-3xl text-slate-700 space-y-4">
             <p>本市今年的候鸟生存状态为：<span className="font-bold">{gameState.birdDeaths > gameState.birdSaved ? '严峻' : '良好'}</span>。</p>
             <p className="text-sm italic text-slate-500">真实的改变始于每一个窗台贴纸和每一盏被熄灭的非必要景观灯。明年见。</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={resetGame} className="px-8 py-4 border-2 border-teal-600 text-teal-600 font-bold rounded-2xl">重返规划</button>
            <button onClick={() => setShowEncyclopedia(true)} className="px-8 py-4 bg-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-teal-100">查看图鉴</button>
          </div>
        </div>
        {showEncyclopedia && <Encyclopedia unlockedBirds={gameState.unlockedBirds} onClose={() => setShowEncyclopedia(false)} />}
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative select-none">
      <GameHUD budget={gameState.budget} satisfaction={gameState.satisfaction} birdSaved={gameState.birdSaved} birdDeaths={gameState.birdDeaths} />
      
      <IsometricScene 
        stage={gameState.stage} 
        isBirdView={gameState.isBirdView} 
        isCrisis={isCrisis || isDeathFlash} 
        isSolved={gameState.isSolved}
        onBirdDeath={onBirdDeath}
        onBirdSaved={onBirdSaved}
      />

      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-40 w-full max-w-[95vw] md:max-w-[480px]">
        
        {birdFact && (
          <div className="bg-amber-50/95 backdrop-blur-md border border-amber-200 p-3 rounded-2xl text-[11px] text-amber-900 flex gap-2 items-center shadow-lg animate-bounce-short self-end">
            <span className="bg-amber-200 px-2 py-0.5 rounded-full font-black whitespace-nowrap text-[9px]">AI科普</span>
            <p className="flex-1 italic font-medium text-right">{birdFact}</p>
          </div>
        )}

        <div className="glass-morphism rounded-[32px] shadow-2xl overflow-hidden flex flex-col w-full border border-white/40">
          
          <div className="flex-1 p-6 min-w-0 flex flex-col justify-center bg-white/40">
            <div className="mb-4">
              <h3 className="text-[10px] font-black text-teal-600 uppercase mb-0.5 tracking-widest">当前挑战: {currentLevel?.name}</h3>
              <p className="text-sm text-slate-700 font-bold leading-tight">{currentLevel?.scenario}</p>
            </div>

            {!currentFeedback ? (
              <div className="space-y-2.5">
                {currentLevel?.choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white/80 hover:border-teal-400 hover:bg-white text-left transition-all hover:shadow-md group flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700 text-xs group-hover:text-teal-700">{choice.title}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-lg text-slate-500 tracking-tighter">${choice.cost}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">{choice.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className={`p-4 rounded-2xl shadow-inner ${gameState.isSolved ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                  <p className="text-xs font-bold leading-relaxed">{currentFeedback}</p>
                </div>
                <button onClick={nextStage} className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl text-sm flex items-center justify-center gap-2">
                  <span>前进到下一阶段</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50/60 border-t border-slate-200/50">
             <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">区域保护效率</span>
                <span className="text-[10px] font-black text-teal-600">{Math.round(survivalRate)}%</span>
             </div>
             <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-teal-500 transition-all duration-700 ease-out"
                   style={{ width: `${survivalRate}%` }}
                ></div>
             </div>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button onClick={toggleBirdView} className={`flex-1 py-4 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-2 border-2 ${gameState.isBirdView ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/90 backdrop-blur-md text-indigo-600 border-indigo-100 hover:bg-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <span className="text-sm">{gameState.isBirdView ? '常态' : '鸟类视角'}</span>
          </button>
          <button onClick={() => setShowEncyclopedia(true)} className="w-16 h-16 bg-white/90 backdrop-blur-md text-teal-600 rounded-2xl shadow-xl flex items-center justify-center border-2 border-teal-50 hover:bg-white transition-all group relative shrink-0">
            <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            {gameState.unlockedBirds.length > 0 && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {gameState.unlockedBirds.length}
              </div>
            )}
          </button>
        </div>
      </div>

      {showEncyclopedia && <Encyclopedia unlockedBirds={gameState.unlockedBirds} onClose={() => setShowEncyclopedia(false)} />}
    </div>
  );
};

export default App;
