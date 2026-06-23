import React, { useState } from 'react';
import { DoodleCard, DoodleButton, Sticker, audio } from '../ui/DoodleUI';
import { CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const Level3: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { unlockBadge } = useGame();
  const [steps, setSteps] = useState([
    { id: 1, text: "Eat the sandwich 😋", order: 5 },
    { id: 2, text: "Spread peanut butter 🥜", order: 2 },
    { id: 3, text: "Take two slices of bread 🍞", order: 1 },
    { id: 4, text: "Spread jelly 🍓", order: 3 },
    { id: 5, text: "Put slices together 🥪", order: 4 },
  ]);
  const [success, setSuccess] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setSteps(newSteps); checkSuccess(newSteps); audio.playPop();
  };

  const moveDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setSteps(newSteps); checkSuccess(newSteps); audio.playPop();
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (success) return;
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (success) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    if (success) return;
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const newSteps = [...steps];
    const draggedItem = newSteps[draggedIdx];
    newSteps.splice(draggedIdx, 1);
    newSteps.splice(index, 0, draggedItem);
    setSteps(newSteps);
    setDraggedIdx(null);
    checkSuccess(newSteps);
    audio.playPop();
  };

  const checkSuccess = (currentSteps: typeof steps) => {
    if (currentSteps.every((step, index) => step.order === index + 1)) {
      setSuccess(true); 
      audio.playSuccess();
      unlockBadge('first_algorithm');
    } else {
      setSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 w-full max-w-3xl mx-auto animate-bounce-in pt-24">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-chunky text-slate-800 mb-4">What is an <span className="highlighter-yellow px-2">Algorithm?</span> 🧪</h2>
        <p className="font-hand text-2xl text-slate-600">
          An algorithm is simply a step-by-step plan to solve a problem.<br/>
          Drag & drop or use arrows to create a Sandwich Algorithm!
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            draggable={!success}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex items-center justify-between p-4 bg-white border-4 rounded-2xl shadow-[4px_4px_0_#1e293b] transition-all duration-300 ${!success ? 'cursor-grab active:cursor-grabbing' : ''}
            ${success ? 'border-green-500 bg-green-50 scale-[1.02]' : 'border-slate-800 hover:-translate-y-1 hover:shadow-[6px_6px_0_#1e293b]'}
            ${draggedIdx === index ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-4 pointer-events-none">
              <div className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-chunky text-xl">
                {index + 1}
              </div>
              <span className="font-hand text-2xl font-bold text-slate-800">{step.text}</span>
            </div>
            {!success && (
              <div className="flex gap-2">
                <button onClick={() => moveUp(index)} disabled={index === 0} className="w-10 h-10 bg-pink-100 border-2 border-slate-800 rounded-lg flex items-center justify-center active:bg-pink-300 disabled:opacity-30 disabled:active:bg-pink-100 transition-colors"><ArrowUp className="text-slate-800"/></button>
                <button onClick={() => moveDown(index)} disabled={index === steps.length - 1} className="w-10 h-10 bg-sky-100 border-2 border-slate-800 rounded-lg flex items-center justify-center active:bg-sky-300 disabled:opacity-30 disabled:active:bg-sky-100 transition-colors"><ArrowDown className="text-slate-800"/></button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {success && (
        <div className="mt-12 animate-bounce-in text-center">
          <p className="font-chunky text-3xl text-green-600 mb-6 bg-green-100 border-4 border-green-500 px-6 py-3 rounded-2xl inline-flex items-center gap-2 shadow-[2px_2px_0_#22c55e]">
            <CheckCircle2 size={32} /> Perfect Algorithm!
          </p>
          <br/>
          <DoodleButton onClick={onComplete} color="bg-blue-400 text-white">Next Sequence ➡️</DoodleButton>
        </div>
      )}
    </div>
  );
};
