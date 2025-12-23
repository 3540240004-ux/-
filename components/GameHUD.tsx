
import React from 'react';

interface GameHUDProps {
  budget: number;
  satisfaction: number;
  birdSaved: number;
  birdDeaths: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ budget, satisfaction, birdSaved, birdDeaths }) => {
  return (
    <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
      <div className="flex gap-4">
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg flex flex-col min-w-[120px]">
          <span className="text-xs text-slate-500 font-bold">可用预算</span>
          <span className="text-xl font-bold text-green-600">${budget}</span>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg flex flex-col min-w-[120px]">
          <span className="text-xs text-slate-500 font-bold">市民满意度</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">{satisfaction}%</span>
            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${satisfaction > 50 ? 'bg-blue-500' : 'bg-red-500'}`} 
                style={{ width: `${satisfaction}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg flex flex-col min-w-[120px] border-l-4 border-green-500">
          <span className="text-xs text-slate-500 font-bold">已拯救候鸟</span>
          <span className="text-xl font-bold text-green-700">{birdSaved}</span>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg flex flex-col min-w-[120px] border-l-4 border-red-500">
          <span className="text-xs text-slate-500 font-bold">坠亡记录</span>
          <span className="text-xl font-bold text-red-600">{birdDeaths}</span>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
