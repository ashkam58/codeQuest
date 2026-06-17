import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Rocket, CheckCircle2, TerminalSquare, AlertTriangle, ArrowUp, ArrowDown, 
  Sparkles, Brain, Code2, Cpu, Globe, ArrowRight, Lightbulb, Star
} from 'lucide-react';

// --- INJECT FONTS AND GLOBAL STYLES ---
const injectStyles = () => {
  if (document.getElementById('codequest-styles')) return;
  const style = document.createElement('style');
  style.id = 'codequest-styles';
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Kalam:wght@400;700&display=swap');

    body {
      background-color: #f8fafc;
      background-image: radial-gradient(#cbd5e1 2px, transparent 2px);
      background-size: 30px 30px;
    }
    
    .font-chunky { font-family: 'Fredoka', sans-serif; }
    .font-hand { font-family: 'Kalam', cursive; }

    .highlighter-yellow {
      background: linear-gradient(180deg, rgba(255,255,255,0) 50%, #fde047 50%);
    }
    .highlighter-pink {
      background: linear-gradient(180deg, rgba(255,255,255,0) 50%, #f9a8d4 50%);
    }

    /* Bouncy Animations */
    @keyframes bounce-in {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(-2deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }

    @keyframes shake-cute {
      0%, 100% { transform: translateX(0) rotate(0deg); }
      25% { transform: translateX(-4px) rotate(-3deg); }
      75% { transform: translateX(4px) rotate(3deg); }
    }
    .animate-shake-cute { animation: shake-cute 0.4s ease-in-out 2; }
    
    /* Scene transitions */
    .scene-transition { transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out; }
    .scene-out { opacity: 0; transform: scale(0.95); }
    .scene-in { opacity: 1; transform: scale(1); }
  `;
  document.head.appendChild(style);
};

// --- AUDIO SYSTEM (Success sounds only) ---
class AudioEngine {
  constructor() {
    this.ctx = null;
  }
  playSuccess() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) { console.log(e); }
  }
  playPop() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) { console.log(e); }
  }
}
const audio = new AudioEngine();

// --- REUSABLE COMPONENTS (Doodle/Pixar Style) ---
const DoodleCard = ({ children, className = "", rotation = "0" }) => (
  <div 
    className={`bg-white border-4 border-slate-800 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#1e293b] relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_#1e293b] ${className}`}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    {children}
  </div>
);

const DoodleButton = ({ onClick, children, color = "bg-yellow-300", className = "" }) => (
  <button 
    onClick={() => { audio.playPop(); onClick(); }} 
    className={`font-chunky text-xl uppercase tracking-wider px-8 py-4 border-4 border-slate-800 rounded-2xl shadow-[4px_4px_0_#1e293b] active:shadow-[0_0_0_#1e293b] active:translate-y-1 active:translate-x-1 transition-all ${color} ${className}`}
  >
    {children}
  </button>
);

const Sticker = ({ icon: Icon, emoji, color, className="" }) => (
  <div className={`absolute w-16 h-16 rounded-full border-4 border-slate-800 shadow-[4px_4px_0_#1e293b] flex items-center justify-center text-3xl animate-float ${color} ${className}`}>
    {Icon ? <Icon size={28} className="text-slate-800" strokeWidth={3} /> : emoji}
  </div>
);

// --- SCENES ---

// Scene 0: Landing
const IntroScene = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 animate-bounce-in">
      <Sticker emoji="🚀" color="bg-pink-400" className="-top-4 -left-4 md:top-20 md:left-20" />
      <Sticker emoji="💡" color="bg-yellow-300" className="top-20 right-4 md:top-20 md:right-32" style={{animationDelay: "1s"}} />
      <Sticker icon={Brain} color="bg-sky-400" className="bottom-20 left-10 md:bottom-32 md:left-40" style={{animationDelay: "0.5s"}} />
      
      <DoodleCard className="max-w-3xl w-full text-center my-8 z-10" rotation="-1">
        <div className="inline-block px-4 py-1 bg-lime-300 border-2 border-slate-800 rounded-full font-chunky text-slate-800 mb-6 transform -rotate-2">
          MODULE 1: THE BASICS
        </div>
        
        <h1 className="text-5xl md:text-7xl font-chunky text-slate-800 mb-8 leading-tight">
          What is <span className="text-pink-500 underline decoration-8 underline-offset-4">Coding?</span>
        </h1>
        
        <div className="font-hand text-2xl md:text-3xl text-slate-600 mb-12 space-y-4">
          <p>Before computers could think...</p>
          <p>Humans had to learn how to <span className="highlighter-yellow px-2 font-bold text-slate-800">think clearly.</span></p>
          <p className="text-blue-600 font-bold mt-8">Coding is NOT typing.</p>
          <p className="text-pink-500 font-bold">Coding is THINKING! 🧠✨</p>
        </div>

        <DoodleButton onClick={onNext} color="bg-blue-400 text-white">
          Start Journey! 🚀
        </DoodleButton>
      </DoodleCard>
    </div>
  );
};

// Scene 1: Robot Sandwich
const RobotSandwichScene = ({ onNext }) => {
  const [stage, setStage] = useState(0);

  const dialogs = [
    { text: "Can this robot make a peanut butter sandwich?", btn: true, emoji: "🥪" },
    { text: "Robot: 'What is bread?'", sub: "Wait, what?", emoji: "🍞❓" },
    { text: "Robot: 'Where is bread?'", sub: "It doesn't know where the kitchen is!", emoji: "🗺️" },
    { text: "Robot: 'How do I open the jar?'", sub: "It doesn't know how to twist!", emoji: "🥜" },
    { text: "Computers are incredibly powerful.\nBut they are incredibly stupid.\nThey only follow EXACT instructions.", btnNext: true, emoji: "🤯" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 animate-bounce-in">
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
            <DoodleButton onClick={onNext} color="bg-pink-400 text-white">I Got It! ✨</DoodleButton>
          </div>
        )}
      </DoodleCard>
    </div>
  );
};

// Reusable Grid World Engine (Doodle Version)
const GridWorld = ({ title, desc, gridSize = 5, startPos, endPos, obstacles = [], prefilledCode = "", initialDir = 0, onComplete, isBugged = false }) => {
  const [robot, setRobot] = useState({ ...startPos, dir: initialDir });
  const [code, setCode] = useState(prefilledCode);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [crashed, setCrashed] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setStatus("Executing steps...");
    setCrashed(false);
    setRobot({ ...startPos, dir: initialDir });
    
    await new Promise(r => setTimeout(r, 400));

    const lines = code.toLowerCase().split('\n').map(l => l.trim()).filter(l => l);
    let curr = { ...startPos, dir: initialDir };

    for (let i = 0; i < lines.length; i++) {
      const cmd = lines[i];
      let next = { ...curr };

      if (cmd.includes('forward')) {
        if (curr.dir === 0) next.y -= 1;
        if (curr.dir === 1) next.x += 1;
        if (curr.dir === 2) next.y += 1;
        if (curr.dir === 3) next.x -= 1;
      } else if (cmd.includes('left')) {
        next.dir = (curr.dir + 3) % 4;
      } else if (cmd.includes('right')) {
        next.dir = (curr.dir + 1) % 4;
      }

      if (next.x < 0 || next.x >= gridSize || next.y < 0 || next.y >= gridSize) {
        setStatus("💥 CRASH! Out of bounds.");
        setCrashed(true); setIsRunning(false); return;
      }

      if (obstacles.some(o => o.x === next.x && o.y === next.y)) {
        setStatus("💥 CRASH! Hit a wall.");
        setCrashed(true); setIsRunning(false); return;
      }

      curr = next;
      setRobot(curr);
      audio.playPop();
      await new Promise(r => setTimeout(r, 500));
    }

    if (curr.x === endPos.x && curr.y === endPos.y) {
      setStatus("🎉 MISSION ACCOMPLISHED!");
      audio.playSuccess();
      setTimeout(onComplete, 2000);
    } else {
      setStatus("🤔 Mission Failed. Target not reached.");
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 w-full max-w-6xl mx-auto animate-bounce-in">
      <div className="text-center mb-8 relative z-10">
        <span className="inline-block px-4 py-1 bg-yellow-300 border-2 border-slate-800 rounded-full font-chunky text-slate-800 mb-4 transform -rotate-2">
          {isBugged ? "DEBUGGING LAB 🐞" : "ALGORITHM BUILDER 🛠️"}
        </span>
        <h2 className="text-4xl md:text-5xl font-chunky text-slate-800 mb-4">{title}</h2>
        <p className="font-hand text-2xl text-slate-600 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 inline-block">{desc}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full z-10 items-center justify-center">
        {/* Editor (Sticky Note Style) */}
        <div className="flex-1 w-full max-w-md bg-yellow-200 border-4 border-slate-800 p-6 rounded-br-3xl rounded-tl-2xl shadow-[8px_8px_0_#1e293b] relative transform -rotate-1">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-400/50 -mt-8 rotate-2"></div> {/* Tape */}
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-chunky text-xl text-slate-800">📝 Commands:</span>
            <div className="flex gap-2">
              <button onClick={() => setCode(p => p + 'move forward\n')} className="bg-white border-2 border-slate-800 rounded px-2 py-1 font-chunky text-sm hover:bg-sky-200 active:translate-y-1 transition-all">⬆️ Fwd</button>
              <button onClick={() => setCode(p => p + 'turn left\n')} className="bg-white border-2 border-slate-800 rounded px-2 py-1 font-chunky text-sm hover:bg-sky-200 active:translate-y-1 transition-all">⬅️ Lft</button>
              <button onClick={() => setCode(p => p + 'turn right\n')} className="bg-white border-2 border-slate-800 rounded px-2 py-1 font-chunky text-sm hover:bg-sky-200 active:translate-y-1 transition-all">➡️ Rgt</button>
            </div>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isRunning}
            className="w-full h-64 bg-transparent border-none font-hand text-3xl text-slate-800 leading-relaxed focus:ring-0 resize-none placeholder-slate-400"
            style={{ 
              backgroundSize: '100% 2.5rem',
              backgroundImage: 'linear-gradient(transparent 2.4rem, #94a3b8 2.4rem, #94a3b8 2.5rem, transparent 2.5rem)',
              lineHeight: '2.5rem'
            }}
            placeholder="Write steps here..."
          />
          
          <div className="mt-6 flex justify-between items-center">
            <button onClick={() => { setCode(''); setRobot({ ...startPos, dir: initialDir }); setStatus(''); setCrashed(false); setIsRunning(false); }} className="font-chunky text-slate-600 underline">Clear</button>
            <DoodleButton onClick={runCode} disabled={isRunning} color={isRunning ? "bg-slate-300" : "bg-green-400"} className="px-6 py-2 text-lg">
              {isRunning ? 'Running...' : 'RUN CODE 🚀'}
            </DoodleButton>
          </div>
        </div>

        {/* Visualizer (Graph Paper Style) */}
        <DoodleCard className="flex-none p-4 md:p-8 bg-sky-50" rotation="1">
          <div className="relative border-4 border-slate-800 bg-white rounded-xl overflow-hidden shadow-inner" style={{ width: gridSize * 60, height: gridSize * 60 }}>
            {/* Grid */}
            {Array.from({ length: gridSize }).map((_, y) => (
              Array.from({ length: gridSize }).map((_, x) => (
                <div key={`${x}-${y}`} className="absolute border border-sky-100"
                     style={{ left: x * 60, top: y * 60, width: 60, height: 60 }} />
              ))
            ))}
            
            {/* Obstacles */}
            {obstacles.map((o, i) => (
              <div key={`obs-${i}`} className="absolute flex items-center justify-center text-4xl"
                   style={{ left: o.x * 60, top: o.y * 60, width: 60, height: 60 }}>
                🧱
              </div>
            ))}

            {/* Target */}
            <div className="absolute flex items-center justify-center text-4xl animate-bounce"
                 style={{ left: endPos.x * 60, top: endPos.y * 60, width: 60, height: 60 }}>
              ⭐
            </div>

            {/* Robot */}
            <div className={`absolute flex items-center justify-center transition-all duration-400 ${crashed ? 'animate-shake-cute' : ''}`}
                 style={{ 
                   left: robot.x * 60, top: robot.y * 60, width: 60, height: 60,
                   transform: `rotate(${robot.dir * 90}deg)`
                 }}>
              <div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg relative">
                <ArrowUp size={28} className="text-white" />
                {crashed && <span className="absolute -top-4 -right-4 text-2xl">💥</span>}
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className={`inline-block font-chunky px-4 py-2 rounded-xl border-2 border-slate-800 ${status.includes('ACCOMPLISHED') ? 'bg-green-300' : status.includes('CRASH') ? 'bg-red-300' : 'bg-white'}`}>
              {status || "Awaiting your code..."}
            </span>
          </div>
        </DoodleCard>
      </div>
    </div>
  );
};

// Scene 4: Sort Algorithm
const AlgorithmSortScene = ({ onNext }) => {
  const [steps, setSteps] = useState([
    { id: 1, text: "Drink tea ☕", order: 5 },
    { id: 2, text: "Pour water in cup 💧", order: 3 },
    { id: 3, text: "Boil water 🔥", order: 1 },
    { id: 4, text: "Put teabag in cup 🍵", order: 2 },
    { id: 5, text: "Wait 3 mins ⏳", order: 4 },
  ]);
  const [success, setSuccess] = useState(false);

  const moveUp = (index) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setSteps(newSteps); checkSuccess(newSteps); audio.playPop();
  };

  const moveDown = (index) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setSteps(newSteps); checkSuccess(newSteps); audio.playPop();
  };

  const checkSuccess = (currentSteps) => {
    if (currentSteps.every((step, index) => step.order === index + 1)) {
      setSuccess(true); audio.playSuccess();
    } else setSuccess(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 w-full max-w-3xl mx-auto animate-bounce-in">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-chunky text-slate-800 mb-4"><span className="highlighter-yellow px-2">Algorithm Lab</span> 🧪</h2>
        <p className="font-hand text-2xl text-slate-600">Algorithms are just sequences of steps.<br/>Sort these to make tea!</p>
      </div>

      <div className="w-full flex flex-col gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className={`flex items-center justify-between p-4 bg-white border-4 rounded-2xl shadow-[4px_4px_0_#1e293b] transition-all duration-300
            ${success ? 'border-green-500 bg-green-50 scale-[1.02]' : 'border-slate-800 hover:-translate-y-1 hover:shadow-[6px_6px_0_#1e293b]'}`}>
            <div className="flex items-center gap-4">
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
          <p className="font-chunky text-3xl text-green-600 mb-6 bg-green-100 border-4 border-green-500 px-6 py-3 rounded-2xl inline-flex items-center gap-2">
            <CheckCircle2 size={32} /> Perfect Algorithm!
          </p>
          <br/>
          <DoodleButton onClick={onNext} color="bg-blue-400 text-white">Next Sequence ➡️</DoodleButton>
        </div>
      )}
    </div>
  );
};

// Scene 5: Human vs Computer
const HumanVsComputerScene = ({ onNext }) => {
  const numbers = [12, 45, 7, 89, 23, 99, 4, 56];
  const target = 99;
  const [computerIndex, setComputerIndex] = useState(-1);
  const [started, setStarted] = useState(false);

  const startComputer = () => {
    setStarted(true);
    let i = 0;
    const interval = setInterval(() => {
      setComputerIndex(i);
      audio.playPop();
      if (numbers[i] === target) {
        clearInterval(interval);
        audio.playSuccess();
        setTimeout(onNext, 3000);
      }
      i++;
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative w-full px-4 py-12 animate-bounce-in">
      <h2 className="text-5xl font-chunky text-slate-800 mb-12 text-center underline decoration-wavy decoration-pink-500 decoration-4 underline-offset-8">
        How Computers Search 🔍
      </h2>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Human Brain */}
        <DoodleCard className="flex-1 flex flex-col items-center bg-pink-50" rotation="-1">
          <div className="w-20 h-20 bg-pink-300 border-4 border-slate-800 rounded-full flex items-center justify-center shadow-[4px_4px_0_#1e293b] mb-4">
            <Brain size={40} className="text-slate-800" />
          </div>
          <h3 className="text-3xl font-chunky text-slate-800 mb-4">HUMAN</h3>
          <p className="font-hand text-xl text-slate-600 text-center mb-8 h-16">You instantly spot the highest number (99) by looking at the whole picture.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {numbers.map((n, i) => (
              <div key={i} className={`w-16 h-16 flex items-center justify-center rounded-2xl border-4 border-slate-800 font-chunky text-2xl shadow-[2px_2px_0_#1e293b]
                ${n === target ? 'bg-pink-400 text-white scale-110 rotate-3 shadow-[6px_6px_0_#1e293b]' : 'bg-white text-slate-700'}`}>
                {n}
              </div>
            ))}
          </div>
        </DoodleCard>

        {/* Computer Brain */}
        <DoodleCard className="flex-1 flex flex-col items-center bg-sky-50" rotation="1">
          <div className="w-20 h-20 bg-sky-300 border-4 border-slate-800 rounded-full flex items-center justify-center shadow-[4px_4px_0_#1e293b] mb-4">
            <Cpu size={40} className="text-slate-800" />
          </div>
          <h3 className="text-3xl font-chunky text-slate-800 mb-4">COMPUTER</h3>
          <p className="font-hand text-xl text-slate-600 text-center mb-8 h-16">Computers must check one by one. They can't see the "whole picture".</p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {numbers.map((n, i) => (
              <div key={i} className={`w-16 h-16 flex items-center justify-center rounded-2xl border-4 border-slate-800 font-chunky text-2xl shadow-[2px_2px_0_#1e293b] transition-all duration-300
                ${i === computerIndex && n === target ? 'bg-green-400 text-white scale-110 shadow-[6px_6px_0_#1e293b]' 
                : i === computerIndex ? 'bg-sky-400 text-white scale-105' 
                : 'bg-white text-slate-300 border-slate-300'}`}>
                {n}
              </div>
            ))}
          </div>
          {!started ? (
            <DoodleButton onClick={startComputer} color="bg-yellow-300">Run Scan 🤖</DoodleButton>
          ) : (
            <div className="h-12 flex items-center justify-center font-chunky text-lg text-slate-800 bg-white border-2 border-slate-800 rounded-xl px-4 w-full">
              {computerIndex >= 0 ? `Is ${numbers[computerIndex]} == 99? ${numbers[computerIndex] === target ? 'YES! 🎉' : 'NO ❌'}` : ''}
            </div>
          )}
        </DoodleCard>
      </div>
    </div>
  );
};

// Scene 7: Python Terminal 
const TerminalScene = ({ onNext }) => {
  const [lines, setLines] = useState([{ type: 'output', text: 'Ready to write real code? ✨' }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, [lines]);

  const handleCommand = (e) => {
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
          setTimeout(() => setLines(prev => [...prev, { type: 'error', text: 'Oops! Type exactly: print("Hello World")' }]), 400);
        }
      } else if (step === 1) {
        if (cmd.startsWith('name = "') || cmd.startsWith("name = '")) {
          setTimeout(() => {
            setLines(prev => [...prev, { type: 'output', text: `Variable 'name' saved! 📦` }]);
            setStep(2); audio.playSuccess();
          }, 400);
        } else {
          setTimeout(() => setLines(prev => [...prev, { type: 'error', text: 'Try: name = "YourName"' }]), 400);
        }
      } else if (step === 2) {
          if (cmd === 'print(name)') {
            setTimeout(() => {
              setLines(prev => [...prev, { type: 'output', text: 'You are now a Programmer! 🎓🎉' }]);
              audio.playSuccess(); setTimeout(onNext, 2500);
            }, 400);
          } else {
             setTimeout(() => setLines(prev => [...prev, { type: 'error', text: 'Try: print(name)' }]), 400);
          }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 w-full max-w-4xl mx-auto animate-bounce-in">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-chunky text-slate-800 mb-4">Write Real Code! 💻</h2>
        <div className="font-hand text-2xl text-slate-600 bg-yellow-200 px-6 py-2 rounded-2xl border-4 border-slate-800 inline-block transform rotate-1 shadow-[4px_4px_0_#1e293b]">
          {step === 0 && "Task 1: Type print(\"Hello World\")"}
          {step === 1 && "Task 2: Make a variable! Type name = \"YourName\""}
          {step === 2 && "Task 3: Print it! Type print(name)"}
        </div>
      </div>

      {/* Cute Laptop UI */}
      <div className="w-full max-w-2xl bg-white border-8 border-slate-800 rounded-3xl p-2 shadow-[12px_12px_0_#1e293b]">
        <div className="bg-slate-100 border-4 border-slate-800 rounded-2xl overflow-hidden font-mono text-lg">
          {/* Top Bar */}
          <div className="bg-slate-800 px-4 py-3 border-b-4 border-slate-800 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-slate-800 bg-red-400"></div>
            <div className="w-4 h-4 rounded-full border-2 border-slate-800 bg-yellow-400"></div>
            <div className="w-4 h-4 rounded-full border-2 border-slate-800 bg-green-400"></div>
            <span className="ml-4 text-white font-chunky tracking-widest text-sm">MY_FIRST_CODE.PY</span>
          </div>
          {/* Editor Area */}
          <div className="p-6 h-[350px] overflow-y-auto flex flex-col bg-slate-50 text-slate-800">
            {lines.map((l, i) => (
              <div key={i} className={`mb-3 font-bold ${l.type === 'input' ? 'text-slate-500' : l.type === 'error' ? 'text-red-500' : 'text-blue-600'}`}>
                {l.text}
              </div>
            ))}
            <div className="flex items-center mt-2 font-bold">
              <span className="mr-2 text-pink-500 animate-pulse">{">"}</span>
              <input 
                ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand}
                className="bg-transparent outline-none flex-1 text-slate-800" spellCheck="false" autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Scene: Powers
const PowersScene = ({ onNext }) => {
  const powers = [
    { icon: <Globe size={48}/>, title: "Build the Web", desc: "Create interactive worlds.", color: "bg-sky-200" },
    { icon: <Cpu size={48}/>, title: "Create AI", desc: "Teach machines to think.", color: "bg-pink-200" },
    { icon: <Code2 size={48}/>, title: "Hack Logic", desc: "Solve puzzles instantly.", color: "bg-lime-200" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 w-full animate-bounce-in">
      <h2 className="text-5xl md:text-6xl font-chunky text-slate-800 mb-16 text-center">
        With coding, you can... 🌟
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
        {powers.map((p, i) => (
          <DoodleCard key={i} className={`flex flex-col items-center text-center ${p.color}`} rotation={i === 1 ? "2" : "-2"}>
            <div className="bg-white border-4 border-slate-800 p-4 rounded-full mb-6 shadow-[4px_4px_0_#1e293b]">
              {p.icon}
            </div>
            <h3 className="text-3xl font-chunky text-slate-800 mb-4">{p.title}</h3>
            <p className="font-hand text-xl text-slate-700">{p.desc}</p>
          </DoodleCard>
        ))}
      </div>
      <DoodleButton onClick={onNext} color="bg-yellow-300 text-slate-800" className="px-12 py-4 text-2xl">
        FINAL CHALLENGE ⚔️
      </DoodleButton>
    </div>
  );
}

// Scene: Outro
const OutroScene = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 text-center animate-bounce-in">
      <Sticker emoji="A+" color="bg-lime-300 text-5xl font-chunky" className="top-10 left-10 md:top-20 md:left-40 w-24 h-24" />
      <Sticker emoji="🎉" color="bg-yellow-300" className="top-20 right-10 md:top-20 md:right-40" />
      
      <h1 className="text-6xl md:text-8xl font-chunky text-slate-800 mb-8 transform -rotate-2">
        <span className="highlighter-yellow px-4">YOU DID IT!</span> 🎓
      </h1>
      
      <DoodleCard className="max-w-2xl w-full mb-12 text-left bg-white" rotation="1">
        <h3 className="text-3xl font-chunky text-pink-500 mb-6 border-b-4 border-slate-200 pb-4">Study Notes:</h3>
        <ul className="space-y-6 font-hand text-2xl text-slate-700">
          <li className="flex items-center gap-4">
            <span className="bg-green-100 rounded-full p-1 border-2 border-slate-800"><CheckCircle2 className="text-green-600" /></span> 
            Computers need exact instructions
          </li>
          <li className="flex items-center gap-4">
            <span className="bg-green-100 rounded-full p-1 border-2 border-slate-800"><CheckCircle2 className="text-green-600" /></span> 
            Algorithms are step-by-step logic
          </li>
          <li className="flex items-center gap-4">
            <span className="bg-green-100 rounded-full p-1 border-2 border-slate-800"><CheckCircle2 className="text-green-600" /></span> 
            Debugging is fixing errors (squashing bugs 🐛)
          </li>
        </ul>
      </DoodleCard>

      <div className="animate-bounce-in" style={{animationDelay: '0.5s'}}>
        <DoodleButton onClick={() => window.location.reload()} color="bg-blue-500 text-white" className="text-2xl px-12 py-6">
          START PYTHON COURSE 🐍
        </DoodleButton>
      </div>
    </div>
  )
}

// --- MAIN APP CONTROLLER ---
export default function App() {
  const [scene, setScene] = useState(0);
  const [transitionState, setTransitionState] = useState('in');

  useEffect(() => { injectStyles(); }, []);

  const nextScene = () => {
    setTransitionState('out');
    setTimeout(() => {
      setScene(s => s + 1);
      setTransitionState('in');
      window.scrollTo(0,0);
    }, 400); 
  };

  const renderScene = () => {
    switch (scene) {
      case 0: return <IntroScene onNext={nextScene} />;
      case 1: return <RobotSandwichScene onNext={nextScene} />;
      case 2: return <GridWorld 
                        title="Your First Algorithm" 
                        desc="Write commands to guide the rover to the star!"
                        gridSize={5} 
                        startPos={{x: 0, y: 4}} endPos={{x: 4, y: 0}} 
                        onComplete={nextScene} 
                      />;
      case 3: return <AlgorithmSortScene onNext={nextScene} />;
      case 4: return <HumanVsComputerScene onNext={nextScene} />;
      case 5: return <GridWorld 
                        title="Find the Bug!" 
                        desc="The code crashes into the wall. Fix it to reach the star!"
                        gridSize={5} 
                        startPos={{x: 0, y: 2}} endPos={{x: 4, y: 2}} 
                        obstacles={[{x: 2, y: 2}]} initialDir={1}
                        prefilledCode="move forward\nmove forward\nmove forward\nmove forward" 
                        onComplete={nextScene} isBugged={true}
                      />;
      case 6: return <TerminalScene onNext={nextScene} />;
      case 7: return <PowersScene onNext={nextScene} />;
      case 8: return <GridWorld 
                        title="Boss Battle!" 
                        desc="Navigate the maze. Write the complete sequence."
                        gridSize={6} 
                        startPos={{x: 0, y: 5}} endPos={{x: 5, y: 0}} 
                        obstacles={[{x: 1, y: 5}, {x: 1, y: 4}, {x: 3, y: 3}, {x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 3}]}
                        initialDir={1}
                        onComplete={nextScene} 
                      />;
      case 9: return <OutroScene />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-900 overflow-hidden font-chunky">
      
      {/* Doodle Progress Bar */}
      {scene > 0 && scene < 9 && (
        <div className="fixed top-0 left-0 w-full h-4 bg-white border-b-4 border-slate-800 z-50 overflow-hidden">
          <div 
            className="h-full bg-pink-400 transition-all duration-1000 ease-out flex items-center justify-end pr-1"
            style={{ width: `${(scene / 8) * 100}%` }}
          >
             <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      <main className={`scene-transition ${transitionState === 'out' ? 'scene-out' : 'scene-in'}`}>
        {renderScene()}
      </main>
    </div>
  );
}