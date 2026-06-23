import React, { useState } from 'react';
import { DoodleCard, DoodleButton, Sticker, audio } from '../ui/DoodleUI';
import { Bot, ArrowUp, ArrowDown } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const Level10: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { unlockBadge } = useGame();
  
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [guess, setGuess] = useState(50);
  const [steps, setSteps] = useState(0);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    setGuess(Math.floor((min + max) / 2));
    audio.playPop();
  };

  const handleHigher = () => {
    const newMin = guess + 1;
    setMin(newMin);
    const newGuess = Math.floor((newMin + max) / 2);
    setGuess(newGuess);
    setSteps(s => s + 1);
    audio.playPop();
  };

  const handleLower = () => {
    const newMax = guess - 1;
    setMax(newMax);
    const newGuess = Math.floor((min + newMax) / 2);
    setGuess(newGuess);
    setSteps(s => s + 1);
    audio.playPop();
  };

  const handleCorrect = () => {
    setWon(true);
    audio.playSuccess();
    unlockBadge('future_dev');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 w-full max-w-4xl mx-auto animate-bounce-in pt-24">
      <div className="text-center mb-8 relative z-10">
        <span className="inline-block px-4 py-1 bg-purple-300 border-2 border-slate-800 rounded-full font-chunky text-slate-800 mb-4 transform -rotate-2 shadow-[2px_2px_0_#1e293b]">
          AI LOGIC LAB 🧠
        </span>
        <h2 className="text-4xl md:text-5xl font-chunky text-slate-800 mb-4">Teach AI to Guess</h2>
        <p className="font-hand text-2xl text-slate-600 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 inline-block shadow-sm">
          Think of a number between 1 and 100. Guide the AI using Higher/Lower hints!
        </p>
      </div>

      <DoodleCard className="w-full max-w-2xl text-center" rotation="1">
        <div className="w-32 h-32 mx-auto bg-purple-300 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-[6px_6px_0_#1e293b] mb-8 relative">
          <Bot size={64} className="text-slate-800" />
          {won && <Sticker emoji="🎉" className="-top-4 -right-4 w-12 h-12" />}
        </div>

        {!started ? (
          <div className="animate-bounce-in">
             <h3 className="text-3xl font-chunky text-slate-800 mb-8">Got a number in your head?</h3>
             <DoodleButton onClick={start} color="bg-green-400">Yes, I'm Ready!</DoodleButton>
          </div>
        ) : !won ? (
          <div className="animate-bounce-in">
             <h3 className="text-4xl font-chunky text-slate-800 mb-8">
               Is your number <span className="text-purple-600 text-6xl">{guess}</span>?
             </h3>
             <div className="flex flex-wrap justify-center gap-4">
               <DoodleButton onClick={handleHigher} color="bg-sky-300 flex items-center gap-2">
                 <ArrowUp /> Higher
               </DoodleButton>
               <DoodleButton onClick={handleLower} color="bg-pink-300 flex items-center gap-2">
                 <ArrowDown /> Lower
               </DoodleButton>
             </div>
             <div className="mt-8">
               <DoodleButton onClick={handleCorrect} color="bg-green-400">
                 Yes, That's It!
               </DoodleButton>
             </div>
             <p className="font-hand text-slate-500 mt-6">Guessed in {steps} steps using Binary Search!</p>
          </div>
        ) : (
          <div className="animate-bounce-in">
             <h3 className="text-4xl font-chunky text-slate-800 mb-6">Woohoo! I found it! 🤖</h3>
             <p className="font-hand text-2xl text-slate-600 mb-8 bg-yellow-100 p-4 rounded-xl border-2 border-yellow-400">
               By giving me hints, you helped my algorithm cut the options in half every time. That's exactly how smart programs learn!
             </p>
             <DoodleButton onClick={onComplete} color="bg-blue-400 text-white">
               Finish the Journey 🏁
             </DoodleButton>
          </div>
        )}
      </DoodleCard>
    </div>
  );
};
