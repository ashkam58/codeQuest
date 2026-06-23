import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BADGE_REGISTRY } from '../../types';
import { Star, Medal, X, Home } from 'lucide-react';
import { audio } from './DoodleUI';

export const ProgressBar: React.FC = () => {
  const { xp, level, unlockedBadges, setLevel } = useGame();
  const [showBadges, setShowBadges] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        {/* Top Bar Background */}
        <div className="w-full h-16 bg-white/90 backdrop-blur-sm border-b-4 border-slate-800 flex items-center justify-between px-4 md:px-8 pointer-events-auto shadow-[0_4px_0_#1e293b]">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { audio.playPop(); setLevel(0); }}
              className="bg-purple-300 border-2 border-slate-800 rounded-xl px-3 py-1 flex items-center justify-center font-chunky shadow-[2px_2px_0_#1e293b] hover:-translate-y-0.5 transition-transform active:translate-y-0.5 active:shadow-none"
              title="Return to Home"
            >
              <Home size={20} className="text-slate-800" />
            </button>

            <div className="bg-yellow-300 border-2 border-slate-800 rounded-xl px-4 py-1 flex items-center gap-2 font-chunky shadow-[2px_2px_0_#1e293b]">
              <Star size={20} className="text-slate-800 fill-slate-800" />
              <span className="text-xl">{xp} XP</span>
            </div>
            <div className="hidden md:block font-hand text-xl font-bold text-slate-700">
              Level {level}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { audio.playPop(); setShowBadges(true); }}
              className="bg-sky-300 border-2 border-slate-800 rounded-xl px-4 py-1 flex items-center gap-2 font-chunky shadow-[2px_2px_0_#1e293b] hover:-translate-y-0.5 transition-transform active:translate-y-0.5 active:shadow-none"
            >
              <Medal size={20} className="text-slate-800" />
              <span className="text-xl">{unlockedBadges.length} Badges</span>
            </button>
          </div>
        </div>

        {/* Level Progress Line */}
        <div className="w-full h-2 bg-slate-200">
          <div 
            className="h-full bg-pink-400 transition-all duration-1000 ease-out flex items-center justify-end pr-1"
            style={{ width: `${Math.min(100, (level / 10) * 100)}%` }}
          >
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Badges Modal */}
      {showBadges && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-[12px_12px_0_#1e293b] animate-bounce-in relative">
            <button 
              onClick={() => { audio.playPop(); setShowBadges(false); }}
              className="absolute top-4 right-4 bg-red-400 border-2 border-slate-800 rounded-full p-2 hover:scale-110 transition-transform active:scale-95 shadow-[2px_2px_0_#1e293b]"
            >
              <X size={24} className="text-white" strokeWidth={3} />
            </button>

            <h2 className="text-4xl font-chunky text-slate-800 mb-8 text-center">
              Your Achievement Gallery 🏆
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.values(BADGE_REGISTRY).map(badge => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                  <div key={badge.id} className={`border-4 rounded-2xl p-4 flex flex-col items-center text-center transition-all ${isUnlocked ? 'border-slate-800 bg-sky-50 shadow-[4px_4px_0_#1e293b]' : 'border-slate-300 bg-slate-100 opacity-60'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-2 ${isUnlocked ? 'bg-white border-2 border-slate-800' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <div className="font-chunky text-lg text-slate-800">{badge.name}</div>
                    <div className="font-hand text-sm text-slate-600 mt-1">{isUnlocked ? badge.description : 'Locked'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
