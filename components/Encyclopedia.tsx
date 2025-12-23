
import React from 'react';
import { BIRDS } from '../constants';
import { Bird } from '../types';

interface EncyclopediaProps {
  unlockedBirds: string[];
  onClose: () => void;
}

const Encyclopedia: React.FC<EncyclopediaProps> = ({ unlockedBirds, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-teal-50">
          <h2 className="text-2xl font-bold text-teal-800">候鸟图鉴</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(BIRDS).map((bird) => {
            const isUnlocked = unlockedBirds.includes(bird.id);
            return (
              <div 
                key={bird.id}
                className={`rounded-2xl border-2 transition-all duration-300 p-4 ${
                  isUnlocked ? 'border-teal-200 bg-white shadow-sm' : 'border-slate-100 bg-slate-50 grayscale opacity-60'
                }`}
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 mb-4 relative">
                  {isUnlocked ? (
                    <img src={bird.image} alt={bird.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                  {isUnlocked && (
                    <span className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold text-white ${
                      bird.rarity === 'Endangered' ? 'bg-red-500' : bird.rarity === 'Rare' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {bird.rarity === 'Endangered' ? '极危' : bird.rarity === 'Rare' ? '珍稀' : '常见'}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{isUnlocked ? bird.name : '???'}</h3>
                <p className="text-xs text-slate-500 italic mb-2">{isUnlocked ? bird.scientificName : 'Unknown'}</p>
                {isUnlocked ? (
                  <p className="text-sm text-slate-600 leading-relaxed">{bird.description}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">拯救该物种后解锁详细信息</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Encyclopedia;
