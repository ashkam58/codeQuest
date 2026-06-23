import React, { useState } from 'react';
import { DoodleCard, DoodleButton, Sticker, audio } from '../ui/DoodleUI';
import { AlertTriangle, CheckCircle2, Bug } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const Level5: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { unlockBadge } = useGame();
  const [stage, setStage] = useState(0);
  const [selectedError, setSelectedError] = useState<number | null>(null);

  const steps = [
    { id: 1, text: "1. Pick up toothbrush 🪥" },
    { id: 2, text: "2. Brush teeth 😬" },
    { id: 3, text: "3. Put toothpaste on brush 🧴" }
  ];

  const handleSelect = (id: number) => {
    setSelectedError(id);
    if (id === 2 || id === 3) {
      audio.playSuccess();
      setStage(1);
    } else {
      audio.playError();
    }
  };

  const handleComplete = () => {
    unlockBadge('bug_hunter');
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 animate-bounce-in pt-24 w-full max-w-4xl mx-auto">
      
      <div className="text-center mb-8 relative z-10">
        <span className="inline-block px-4 py-1 bg-red-300 border-2 border-slate-800 rounded-full font-chunky text-slate-800 mb-4 transform -rotate-2 shadow-[2px_2px_0_#1e293b]">
          BUG IDENTIFICATION 🐛
        </span>
        <h2 className="text-4xl md:text-5xl font-chunky text-slate-800 mb-4">Find the Bug!</h2>
        <p className="font-hand text-2xl text-slate-600 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 inline-block shadow-sm">
          A "bug" is a mistake in instructions. Can you spot what went wrong?
        </p>
      </div>

      <DoodleCard className="w-full max-w-2xl text-center bg-white" rotation="1">
        <Sticker icon={Bug} color="bg-pink-300" className="-top-8 -right-8 w-16 h-16" />
        
        <div className="flex flex-col gap-4 mb-8">
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => handleSelect(step.id)}
              disabled={stage === 1}
              className={`p-6 border-4 border-slate-800 rounded-2xl font-chunky text-2xl text-left transition-all shadow-[4px_4px_0_#1e293b] active:translate-y-1 active:shadow-none
              ${stage === 1 && (step.id === 2 || step.id === 3) ? 'bg-green-200 border-green-600 shadow-none' : 
                selectedError === step.id && stage === 0 ? 'bg-red-200 animate-shake-cute' : 'bg-slate-50 hover:bg-sky-50'}`}
            >
              {step.text}
              {stage === 1 && (step.id === 2 || step.id === 3) && <CheckCircle2 className="inline float-right text-green-700" />}
              {selectedError === step.id && stage === 0 && step.id === 1 && <AlertTriangle className="inline float-right text-red-500" />}
            </button>
          ))}
        </div>

        {stage === 1 && (
          <div className="animate-bounce-in">
            <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-xl font-hand text-xl text-slate-800 mb-8">
              Great job! You can't brush your teeth before putting toothpaste on the brush! 
            </div>
            <DoodleButton onClick={handleComplete} color="bg-blue-400 text-white">
              Next Level ➡️
            </DoodleButton>
          </div>
        )}
      </DoodleCard>

    </div>
  );
};
