import React, { useState } from 'react';
import { DoodleCard, DoodleButton, Sticker, audio } from '../ui/DoodleUI';
import { Bot, CheckCircle2 } from 'lucide-react';

export const Level1: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Activity State
  const [commands, setCommands] = useState([
    { id: '1', text: 'Turn left' },
    { id: '2', text: 'Jump' },
    { id: '3', text: 'Walk forward' }
  ]);
  const [targetOrder] = useState(['Walk forward', 'Turn left', 'Jump']);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    audio.playPop();
    setTimeout(() => {
      setStage(1);
      audio.playSuccess();
    }, 500);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isSuccess) return;
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isSuccess) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    if (isSuccess) return;
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    
    const newCmds = [...commands];
    const draggedItem = newCmds[draggedIdx];
    newCmds.splice(draggedIdx, 1);
    newCmds.splice(index, 0, draggedItem);
    
    setCommands(newCmds);
    setDraggedIdx(null);
    audio.playPop();

    // Check if sorted
    if (newCmds.map(c => c.text).join(',') === targetOrder.join(',')) {
      setIsSuccess(true);
      audio.playSuccess();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 animate-bounce-in pt-24 w-full max-w-4xl mx-auto">
      
      {stage === 0 && (
        <>
          <div className="mb-8 animate-float">
            <div className="w-32 h-32 bg-sky-300 rounded-3xl border-4 border-slate-800 flex items-center justify-center shadow-[6px_6px_0_#1e293b]">
              <Bot size={64} className="text-slate-800" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-6 -right-16 bg-white border-4 border-slate-800 rounded-3xl p-4 font-hand text-xl shadow-[4px_4px_0_#1e293b]">
              Welcome, future coder! 👋
            </div>
          </div>

          <DoodleCard className="w-full text-center" rotation="1">
            <h2 className="text-4xl md:text-5xl font-chunky text-slate-800 mb-8 leading-tight">
              What do you think <span className="text-pink-500 underline decoration-8 underline-offset-4">coding</span> is?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A. Talking to computers', 'B. Drawing pictures', 'C. Playing games', 'D. Watching YouTube'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`p-4 border-4 border-slate-800 rounded-2xl font-chunky text-2xl text-left shadow-[2px_2px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all ${selectedOption === opt ? 'bg-yellow-300' : 'bg-white hover:bg-slate-50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </DoodleCard>
        </>
      )}

      {stage === 1 && (
        <DoodleCard className="w-full text-center bg-pink-50" rotation="-1">
          <h2 className="text-4xl font-chunky text-slate-800 mb-6">Coding is giving instructions! 📜</h2>
          <p className="font-hand text-2xl text-slate-600 mb-8">
            Computers don't know what to do unless we tell them EXACTLY what to do. Let's guide the robot to the treasure chest!
          </p>

          <div className="bg-white p-6 border-4 border-slate-800 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex flex-col gap-3 flex-1 w-full">
               <h3 className="font-chunky text-xl text-slate-500 mb-2">Drag to order (Target: Walk, Left, Jump):</h3>
               {commands.map((cmd, index) => (
                 <div
                   key={cmd.id}
                   draggable={!isSuccess}
                   onDragStart={(e) => handleDragStart(e, index)}
                   onDragOver={handleDragOver}
                   onDrop={(e) => handleDrop(e, index)}
                   className={`p-4 border-4 border-slate-800 rounded-xl font-chunky text-xl bg-white cursor-grab active:cursor-grabbing shadow-[2px_2px_0_#1e293b] transition-all
                   ${draggedIdx === index ? 'opacity-50' : ''} ${isSuccess ? 'bg-green-100 border-green-500 shadow-none cursor-default text-green-800' : ''}`}
                 >
                   {cmd.text}
                 </div>
               ))}
             </div>

             <div className="flex-1 flex flex-col items-center">
               <div className="text-6xl mb-4 relative">
                 🤖 {isSuccess ? '➡️' : '❓'} 🪙
                 {isSuccess && <Sticker icon={CheckCircle2} color="bg-green-300" className="-top-8 -right-8 w-12 h-12" />}
               </div>
               <div className="font-hand text-xl text-slate-500">
                 {isSuccess ? 'Treasure Found!' : 'Awaiting Instructions...'}
               </div>
             </div>
          </div>

          {isSuccess && (
            <div className="animate-bounce-in">
              <DoodleButton onClick={onComplete} color="bg-blue-400 text-white">
                Next Level ➡️
              </DoodleButton>
            </div>
          )}
        </DoodleCard>
      )}

    </div>
  );
};
