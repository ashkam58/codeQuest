import React from 'react';
import { DoodleCard, DoodleButton, Sticker } from '../ui/DoodleUI';
import { CheckCircle2, Code2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const Outro: React.FC = () => {
  const { xp, unlockedBadges, setLevel } = useGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 text-center animate-bounce-in pt-24">
      <Sticker emoji="A+" color="bg-lime-300 text-5xl font-chunky" className="top-24 left-10 md:top-32 md:left-40 w-24 h-24" />
      <Sticker emoji="🎉" color="bg-yellow-300" className="top-32 right-10 md:top-32 md:right-40" />
      <Sticker icon={Code2} color="bg-pink-300" className="bottom-32 left-20 hidden md:flex" />
      
      <h1 className="text-6xl md:text-8xl font-chunky text-slate-800 mb-8 transform -rotate-2">
        <span className="highlighter-yellow px-4">YOU DID IT!</span> 🎓
      </h1>
      
      <DoodleCard className="max-w-3xl w-full mb-12 bg-white" rotation="1">
        <h3 className="text-4xl font-chunky text-slate-800 mb-6">Adventure Summary</h3>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8 bg-sky-50 p-6 rounded-3xl border-4 border-slate-800">
           <div className="text-center">
             <div className="text-5xl font-chunky text-sky-600 mb-2">{xp}</div>
             <div className="font-hand text-xl text-slate-500">Total XP Earned</div>
           </div>
           <div className="w-1 md:w-4 h-12 md:h-1 bg-slate-300 rounded"></div>
           <div className="text-center">
             <div className="text-5xl font-chunky text-pink-600 mb-2">{unlockedBadges.length}</div>
             <div className="font-hand text-xl text-slate-500">Badges Unlocked</div>
           </div>
        </div>

        <h3 className="text-3xl font-chunky text-slate-800 mb-6 border-b-4 border-slate-200 pb-4 text-left">Your Coding Roadmap:</h3>
        <ul className="space-y-4 font-hand text-2xl text-slate-700 text-left">
          <li className="flex items-center gap-4 text-slate-400">
            <span className="bg-slate-200 rounded-full p-1 border-2 border-slate-400"><CheckCircle2 className="text-slate-500" /></span> 
            <strike>What is Coding?</strike> (Complete!)
          </li>
          <li className="flex items-center gap-4 text-slate-400">
            <span className="bg-slate-200 rounded-full p-1 border-2 border-slate-400"><CheckCircle2 className="text-slate-500" /></span> 
            <strike>Logic & Algorithms</strike> (Complete!)
          </li>
          <li className="flex items-center gap-4 font-bold text-sky-600 transform scale-105 origin-left">
            <span className="bg-sky-200 rounded-full p-1 border-2 border-sky-600 animate-pulse"><CheckCircle2 className="text-sky-600" /></span> 
            NEXT: Web Development (HTML/CSS)
          </li>
          <li className="flex items-center gap-4 pl-12 opacity-70">
            <span>➡️ Then: JavaScript & Interactivity</span>
          </li>
          <li className="flex items-center gap-4 pl-12 opacity-70">
            <span>➡️ Finally: Python & AI</span>
          </li>
        </ul>
      </DoodleCard>

      <div className="animate-bounce-in flex flex-col md:flex-row gap-4" style={{animationDelay: '0.5s'}}>
        <DoodleButton onClick={() => setLevel(0)} color="bg-purple-300 text-slate-800" className="text-2xl px-12 py-6">
          Return Home 🏠
        </DoodleButton>
        <DoodleButton onClick={() => window.location.reload()} color="bg-blue-500 text-white" className="text-2xl px-12 py-6">
          Start HTML Course 🚀
        </DoodleButton>
      </div>
    </div>
  );
}
