import React, { useState, useRef, useEffect } from 'react';
import { DoodleCard, DoodleButton, audio } from '../ui/DoodleUI';
import { useGame } from '../../context/GameContext';

export const Level9: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { unlockBadge } = useGame();
  const [lines, setLines] = useState([{ type: 'output', text: 'Ready to write real code? ✨' }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, [lines]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setLines(prev => [...prev, { type: 'input', text: `> ${cmd}` }]);
      setInput('');
      audio.playPop();

      if (step === 0) {
        if (cmd === 'print("Hello World")' || cmd === "print('Hello World')") {
          setTimeout(() => {
            setLines(prev => [...prev, { type: 'output', text: 'Hello World 👋' }]);
            setStep(1); audio.playSuccess();
          }, 400);
        } else {
          setTimeout(() => {
            setLines(prev => [...prev, { type: 'error', text: 'Oops! Type exactly: print("Hello World")' }]);
            audio.playError();
          }, 400);
        }
      } else if (step === 1) {
        if (cmd.startsWith('name = "') || cmd.startsWith("name = '")) {
          setTimeout(() => {
            setLines(prev => [...prev, { type: 'output', text: `Variable 'name' saved! 📦` }]);
            setStep(2); audio.playSuccess();
          }, 400);
        } else {
          setTimeout(() => {
            setLines(prev => [...prev, { type: 'error', text: 'Try: name = "YourName"' }]);
            audio.playError();
          }, 400);
        }
      } else if (step === 2) {
          if (cmd === 'print(name)') {
            setTimeout(() => {
              setLines(prev => [...prev, { type: 'output', text: 'You are now a Python Programmer! 🐍🎓' }]);
              audio.playSuccess(); 
              unlockBadge('python_explorer');
            }, 400);
          } else {
             setTimeout(() => {
               setLines(prev => [...prev, { type: 'error', text: 'Try: print(name)' }]);
               audio.playError();
             }, 400);
          }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 w-full max-w-4xl mx-auto animate-bounce-in pt-24">
      <div className="text-center mb-8 relative z-10">
        <span className="inline-block px-4 py-1 bg-yellow-300 border-2 border-slate-800 rounded-full font-chunky text-slate-800 mb-4 transform -rotate-2 shadow-[2px_2px_0_#1e293b]">
          PYTHON LAB 🐍
        </span>
        <h2 className="text-4xl md:text-5xl font-chunky text-slate-800 mb-4">Talk to the Computer</h2>
        <div className="font-hand text-2xl text-slate-600 bg-white px-6 py-2 rounded-2xl border-4 border-slate-800 inline-block transform rotate-1 shadow-[4px_4px_0_#1e293b]">
          {step === 0 && "Task 1: Type print(\"Hello World\")"}
          {step === 1 && "Task 2: Make a variable! Type name = \"YourName\""}
          {step === 2 && "Task 3: Print it! Type print(name)"}
          {step > 2 && "Awesome job!"}
        </div>
      </div>

      {/* Cute Laptop UI */}
      <div className="w-full max-w-2xl bg-white border-8 border-slate-800 rounded-3xl p-2 shadow-[12px_12px_0_#1e293b] relative z-10">
        <div className="bg-slate-100 border-4 border-slate-800 rounded-2xl overflow-hidden font-mono text-lg">
          {/* Top Bar */}
          <div className="bg-slate-800 px-4 py-3 border-b-4 border-slate-800 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-slate-800 bg-red-400"></div>
            <div className="w-4 h-4 rounded-full border-2 border-slate-800 bg-yellow-400"></div>
            <div className="w-4 h-4 rounded-full border-2 border-slate-800 bg-green-400"></div>
            <span className="ml-4 text-white font-chunky tracking-widest text-sm">MAIN.PY</span>
          </div>
          {/* Editor Area */}
          <div className="p-6 h-[350px] overflow-y-auto flex flex-col bg-slate-900 text-slate-100">
            {lines.map((l, i) => (
              <div key={i} className={`mb-3 font-bold ${l.type === 'input' ? 'text-slate-400' : l.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                {l.text}
              </div>
            ))}
            {step <= 2 && (
              <div className="flex items-center mt-2 font-bold">
                <span className="mr-2 text-pink-400 animate-pulse">{">"}</span>
                <input 
                  ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand}
                  className="bg-transparent outline-none flex-1 text-white" spellCheck="false" autoComplete="off"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {step > 2 && (
        <div className="mt-8 animate-bounce-in z-10">
          <DoodleButton onClick={onComplete} color="bg-blue-400 text-white">
            Next Level ➡️
          </DoodleButton>
        </div>
      )}
    </div>
  );
};
