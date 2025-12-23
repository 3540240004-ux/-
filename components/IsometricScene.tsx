
import React, { useEffect, useState, useRef } from 'react';
import { GameStage } from '../types';

interface BirdParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  speed: number;
  status: 'flying' | 'dying' | 'saved';
  offset: number;
  deathTimer?: number;
}

interface IsometricSceneProps {
  stage: GameStage;
  isBirdView: boolean;
  isCrisis?: boolean;
  isSolved: boolean;
  onBirdDeath: () => void;
  onBirdSaved: () => void;
}

const IsometricScene: React.FC<IsometricSceneProps> = ({ stage, isBirdView, isCrisis, isSolved, onBirdDeath, onBirdSaved }) => {
  const [birds, setBirds] = useState<BirdParticle[]>([]);
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);
  const idCounter = useRef(0);

  const spawnBird = () => {
    // 鸟类从左侧飞入，轨迹调整为经过左下角核心区 (x: 25-45, y: 55-75)
    const newBird: BirdParticle = {
      id: idCounter.current++,
      x: -15, 
      y: 10 + Math.random() * 40, 
      z: 100 + Math.random() * 80,
      speed: 0.18 + Math.random() * 0.22,
      status: 'flying',
      offset: Math.random() * 10
    };
    setBirds(prev => [...prev.slice(-30), newBird]);
  };

  const update = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      let deathsCount = 0;
      let savedCount = 0;

      setBirds(prevBirds => {
        const nextBirds: BirdParticle[] = [];
        
        prevBirds.forEach(bird => {
          if (bird.status === 'dying') {
            const timer = (bird.deathTimer || 0) + 1;
            if (timer < 15) {
               nextBirds.push({ ...bird, deathTimer: timer });
            } else {
              const nextZ = bird.z - 10; 
              if (nextZ > -100) { 
                nextBirds.push({ ...bird, z: nextZ, deathTimer: timer });
              }
            }
            return;
          }

          // 向右下方飞行，经过左下建筑群
          let nextX = bird.x + bird.speed;
          let nextY = bird.y + (bird.speed * 0.55); 
          let nextZ = bird.z;
          let status: BirdParticle['status'] = bird.status;

          // 核心碰撞逻辑：对应左下角建筑群位置 (中心约在 38, 68)
          const targetX = 38;
          const targetY = 68;

          if (!isSolved) {
            if (stage === GameStage.MORNING) {
              // 玻璃碰撞区域
              if (nextX > targetX - 6 && nextX < targetX + 6 && nextY > targetY - 6 && nextY < targetY + 12 && nextZ < 180) {
                status = 'dying';
                deathsCount++;
              }
            } else if (stage === GameStage.NOON) {
              // 光源陷阱
              const dx = targetX - nextX;
              const dy = targetY - nextY;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 18) {
                nextX += dx * 0.07;
                nextY += dy * 0.07;
                if (dist < 3) {
                  status = 'dying';
                  deathsCount++;
                }
              }
            } else if (stage === GameStage.NIGHT) {
              // 电网区域
              if (Math.abs(nextZ - 145) < 12 && nextX > targetX - 20 && nextX < targetX + 30 && nextY > targetY - 20 && nextY < targetY + 30) {
                status = 'dying';
                deathsCount++;
              }
            }
          }

          if (nextX > 130 || nextY > 130) {
            savedCount++;
          } else {
            nextBirds.push({ ...bird, x: nextX, y: nextY, z: nextZ, status });
          }
        });

        return nextBirds;
      });

      for (let i = 0; i < deathsCount; i++) onBirdDeath();
      for (let i = 0; i < savedCount; i++) onBirdSaved();
    }

    const spawnRate = stage === GameStage.START ? 0 : 0.075;
    if (Math.random() < spawnRate) spawnBird();
    
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [stage, isSolved, onBirdDeath, onBirdSaved]);

  const getStageStyles = () => {
    switch(stage) {
      case GameStage.MORNING: return 'bg-sky-100';
      case GameStage.NOON: return isSolved ? 'bg-slate-900' : 'bg-slate-950';
      case GameStage.NIGHT: return 'bg-emerald-50';
      default: return 'bg-slate-100';
    }
  };

  const birdViewClass = stage === GameStage.NOON ? 'bird-view-night' : 'bird-view-morning';

  return (
    <div className={`w-full h-full relative overflow-hidden transition-colors duration-1000 ${getStageStyles()} ${isBirdView ? birdViewClass : ''}`}>
      
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_200px_rgba(0,0,0,0.05)]"></div>

      {/* Isometric Grid Container: 调整为居左下对齐 */}
      <div className="absolute inset-0 isometric-container flex items-end justify-start p-0 overflow-visible">
        <div className="isometric-grid w-[1200px] h-[1200px] relative -translate-x-1/4 translate-y-1/4 scale-110 md:scale-125">
          
          <div className="absolute inset-0 bg-slate-400/5 rounded-full blur-[150px] scale-150"></div>

          {/* Morning: CBD大楼 - 放置于 38%, 68% 区域 */}
          {stage === GameStage.MORNING && (
             <>
               <div 
                 className={`absolute top-[68%] left-[38%] -translate-x-1/2 -translate-y-1/2 w-80 h-80 transition-all duration-700 ${isSolved ? 'bg-blue-50/70' : 'bg-blue-400/50'} shadow-2xl border-2 border-white/30 backdrop-blur-[2px]`}
                 style={{ transform: 'translate(-50%, -50%) translateZ(150px)' }}
               >
                 <div className="w-full h-full flex flex-col gap-2 p-4 relative">
                   {isSolved && (
                     <div className="absolute inset-0 grid grid-cols-8 grid-rows-10 gap-3 p-4">
                       {[...Array(80)].map((_, i) => (
                         <div key={i} className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                       ))}
                     </div>
                   )}
                   {[...Array(10)].map((_, i) => (
                     <div key={i} className="h-6 bg-white/5 flex gap-2">
                       {[...Array(6)].map((_, j) => <div key={j} className="flex-1 bg-white/5"></div>)}
                     </div>
                   ))}
                 </div>
               </div>
               <div className="absolute top-[78%] left-[28%] w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
             </>
          )}

          {/* Noon: 光源陷阱 - 放置于 38%, 68% 区域 */}
          {stage === GameStage.NOON && (
             <>
                <div 
                 className={`absolute top-[68%] left-[38%] -translate-x-1/2 -translate-y-1/2 w-72 h-72 transition-colors duration-1000 ${isSolved ? 'bg-slate-950' : 'bg-slate-900'} border border-slate-800 shadow-2xl`}
                 style={{ transform: 'translate(-50%, -50%) translateZ(120px)' }}
               >
                 {!isSolved && (
                   <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-20 h-[500px] bg-yellow-200/40 blur-[70px] animate-pulse"></div>
                 )}
                 <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-3 p-6">
                   {[...Array(9)].map((_, i) => (
                     <div key={i} className={`rounded-lg ${isSolved ? 'bg-yellow-600/10' : 'bg-yellow-300/40 animate-pulse'}`} style={{ animationDelay: `${i * 150}ms` }}></div>
                   ))}
                 </div>
               </div>
             </>
          )}

          {/* Night: 高压网架 - 放置于 38%, 68% 区域 */}
          {stage === GameStage.NIGHT && (
            <>
              <div className="absolute top-[68%] left-[38%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                <div className="absolute top-1/2 left-0 w-8 h-80 bg-slate-800/40" style={{ transform: 'rotateX(-90deg)' }}></div>
                <div className="absolute top-1/2 right-0 w-8 h-80 bg-slate-800/40" style={{ transform: 'rotateX(-90deg)' }}></div>
                
                {[145, 160].map(z => (
                  <div key={z} className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-700/50 flex justify-around items-center" style={{ transform: `translateZ(${z}px)` }}>
                    {isSolved && [...Array(14)].map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-orange-500/90 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.7)] animate-pulse" style={{ animationDelay: `${i * 120}ms` }}></div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Birds Simulation */}
          {birds.map(bird => {
            const isDying = bird.status === 'dying';
            const isMorningImpact = isDying && stage === GameStage.MORNING && (bird.deathTimer || 0) < 15;

            return (
              <div 
                key={bird.id}
                className="absolute w-6 h-6 pointer-events-none"
                style={{
                  left: `${bird.x}%`,
                  top: `${bird.y}%`,
                  transform: `translateZ(${bird.z}px)`,
                  zIndex: isDying ? 400 : 200
                }}
              >
                {isMorningImpact && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-32 h-32 bg-white/50 rounded-full blur-2xl animate-ping" />
                    <div className="absolute w-20 h-1.5 bg-white/70 rotate-45 rounded-full" />
                    <div className="absolute w-20 h-1.5 bg-white/70 -rotate-45 rounded-full" />
                  </div>
                )}
                
                {isDying && (
                  <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 scale-[3] bg-red-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                )}
                
                <div className={`${isDying ? 'animate-bird-die' : 'animate-bounce'} text-slate-900/90`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-xl filter blur-[0.2px]">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isCrisis && (
        <div className="absolute inset-0 death-flash-overlay pointer-events-none z-[100]"></div>
      )}
    </div>
  );
};

export default IsometricScene;
