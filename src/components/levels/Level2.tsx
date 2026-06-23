import React, { useState } from 'react';
import { DoodleCard, DoodleButton, Sticker, audio } from '../ui/DoodleUI';
import { Bot, AlertTriangle, ArrowRight } from 'lucide-react';

export const Level2: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  const dialogs = [
    { text: "Can this robot make a peanut butter sandwich?", btn: true, emoji: "🥪" },
    { text: "Robot: 'What is bread?'", sub: "Wait, what?", emoji: "🍞❓" },
    { text: "Robot: 'Where is bread?'", sub: "It doesn't know where the kitchen is!", emoji: "🗺️" },
    { text: "Robot: 'How do I open the jar?'", sub: "It doesn't know how to twist!", emoji: "🥜" },
    { text: "Computers are incredibly powerful.\nBut they are incredibly literal.", btnNext: true, emoji: "🤯" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 animate-bounce-in pt-24">
      
      {stage < dialogs.length ? (
        <>
          <div className={`relative mb-8 transition-transform duration-500 ${stage > 0 ? 'animate-bounce' : ''}`}>
            <div className="w-32 h-32 bg-sky-300 rounded-3xl border-4 border-slate-800 flex items-center justify-center shadow-[6px_6px_0_#1e293b]">
              <Bot size={64} className="text-slate-800" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-6 -right-6 text-4xl bg-white rounded-full border-4 border-slate-800 p-2 shadow-[4px_4px_0_#1e293b]">
              {dialogs[stage].emoji}
            </div>
          </div>
          
          <DoodleCard className="max-w-2xl w-full text-center" rotation="1">
            <h2 className="text-3xl md:text-5xl font-chunky text-slate-800 mb-4 whitespace-pre-line leading-tight">
              {dialogs[stage].text}
            </h2>
            {dialogs[stage].sub && (
              <p className="font-hand text-2xl text-pink-500 font-bold mb-8">{dialogs[stage].sub}</p>
            )}
            
            {dialogs[stage].btn && (
              <div className="flex justify-center gap-6 mt-8">
                <DoodleButton onClick={() => setStage(1)} color="bg-green-400">YES!</DoodleButton>
                <DoodleButton onClick={() => setStage(1)} color="bg-red-400">NOPE</DoodleButton>
              </div>
            )}
            
            {!dialogs[stage].btn && !dialogs[stage].btnNext && (
              <div className="mt-8">
                <DoodleButton onClick={() => setStage(s => s + 1)} color="bg-yellow-300">Tell Me More ➡️</DoodleButton>
              </div>
            )}

            {dialogs[stage].btnNext && (
              <div className="mt-8">
                <DoodleButton onClick={() => setStage(s => s + 1)} color="bg-pink-400 text-white">Let's Fix It! 🛠️</DoodleButton>
              </div>
            )}
          </DoodleCard>
        </>
      ) : (
        <DoodleCard className="max-w-3xl w-full text-center" rotation="-1">
          <Sticker icon={AlertTriangle} color="bg-yellow-300" className="-top-8 -left-8" />
          <h2 className="text-4xl font-chunky text-slate-800 mb-6">Rewrite the Instruction</h2>
          <p className="font-hand text-2xl text-slate-600 mb-8">
            Instead of saying "Make me a sandwich", how should we break it down so the literal computer understands?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
             <button onClick={() => audio.playError()} className="p-6 border-4 border-slate-800 rounded-2xl bg-white hover:bg-red-50 transition-colors shadow-[2px_2px_0_#1e293b] active:translate-y-1 active:shadow-none group">
               <span className="font-chunky text-xl block mb-2 text-slate-800 group-hover:text-red-600">A. "Make it fast"</span>
               <span className="font-hand text-slate-500">Too vague.</span>
             </button>
             <button onClick={() => { audio.playSuccess(); setTimeout(onComplete, 1000); }} className="p-6 border-4 border-slate-800 rounded-2xl bg-white hover:bg-green-50 transition-colors shadow-[2px_2px_0_#1e293b] active:translate-y-1 active:shadow-none group">
               <span className="font-chunky text-xl block mb-2 text-slate-800 group-hover:text-green-600">B. 1. Find bread. 2. Open jar...</span>
               <span className="font-hand text-slate-500">Perfect step-by-step!</span>
             </button>
          </div>
        </DoodleCard>
      )}

    </div>
  );
};
