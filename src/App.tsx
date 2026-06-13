import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Bot, Cookie, Rocket, CheckCircle2, ChevronRight, RefreshCw, 
  Terminal, Code2, Globe, Cpu, Trophy, Play, TerminalSquare, AlertTriangle, ArrowRight, ArrowDown, ArrowUp, ArrowLeft
} from 'lucide-react';

// --- AUDIO SYSTEM (Ambient Synth) ---
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.gainNode = null;
    this.isPlaying = false;
  }
  start() {
    if (this.isPlaying) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
      
      this.isPlaying = true;
    } catch (e) {
      console.log("Audio init failed", e);
    }
  }
  playSuccess() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}
const audio = new AudioEngine();

// --- CANVAS BACKGROUND ---
const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random()
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw cinematic gradient
      const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
      grad.addColorStop(0, '#0a0a1a');
      grad.addColorStop(1, '#020205');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += (Math.random() - 0.5) * 0.05;
        p.alpha = Math.max(0.1, Math.min(0.8, p.alpha));

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// --- REUSABLE COMPONENTS ---
const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = "primary", className = "" }) => {
  const base = "px-6 py-3 rounded-full font-bold tracking-widest uppercase transition-all duration-300 transform hover:scale-105 active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)]",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
    success: "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
  };
  return (
    <button onClick={() => { audio.playSuccess(); onClick(); }} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- SCENES ---

// Scene 0: Landing
const IntroScene = ({ onNext }) => {
  const [text, setText] = useState("");
  const fullText = "Before computers could think...\nHumans had to learn how to think clearly.\n\nCoding is not typing.\nCoding is thinking.";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center z-10 relative px-4">
      <h1 className="text-3xl md:text-5xl font-light text-white whitespace-pre-line leading-relaxed mb-12 h-48">
        {text}
        <span className="animate-pulse">_</span>
      </h1>
      {text.length >= fullText.length && (
        <div className="animate-fade-in-up mt-8">
          <Button onClick={onNext} className="text-lg px-8 py-4">BEGIN JOURNEY</Button>
        </div>
      )}
    </div>
  );
};

// Scene 1: Robot Sandwich
const RobotSandwichScene = ({ onNext }) => {
  const [stage, setStage] = useState(0);

  const dialogs = [
    { q: "Can this robot make a peanut butter sandwich?", btn: true },
    { text: "Robot: 'What is bread?'", sub: "Wait, what?" },
    { text: "Robot: 'Where is bread?'", sub: "It doesn't know where the kitchen is." },
    { text: "Robot: 'How do I open the jar?'", sub: "It doesn't know how to twist." },
    { text: "Computers are incredibly powerful.\nBut they are incredibly stupid.\nThey only follow EXACT instructions.", btnNext: true }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen z-10 relative px-4">
      <Bot size={100} className={`text-blue-400 mb-8 transition-all duration-500 ${stage > 0 ? 'animate-bounce' : ''}`} />
      
      <GlassCard className="max-w-2xl w-full text-center min-h-[300px] flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-4xl font-light text-white mb-4 whitespace-pre-line leading-tight">
          {dialogs[stage].q || dialogs[stage].text}
        </h2>
        {dialogs[stage].sub && <p className="text-gray-400 text-lg mb-8">{dialogs[stage].sub}</p>}
        
        {dialogs[stage].btn && (
          <div className="flex gap-4 mt-8">
            <Button onClick={() => setStage(1)}>YES</Button>
            <Button onClick={() => setStage(1)} variant="secondary">NO</Button>
          </div>
        )}
        
        {!dialogs[stage].btn && !dialogs[stage].btnNext && (
          <div className="mt-8">
            <Button onClick={() => setStage(s => s + 1)} variant="secondary">Explain More</Button>
          </div>
        )}

        {dialogs[stage].btnNext && (
          <div className="mt-8">
            <Button onClick={onNext}>I Understand</Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

// Reusable Grid World Engine
const GridWorld = ({ title, desc, gridSize = 5, startPos, endPos, obstacles = [], prefilledCode = "", initialDir = 0, onComplete }) => {
  // dir: 0=up, 1=right, 2=down, 3=left
  const [robot, setRobot] = useState({ ...startPos, dir: initialDir });
  const [code, setCode] = useState(prefilledCode);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [crashed, setCrashed] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setStatus("Executing...");
    setCrashed(false);
    setRobot({ ...startPos, dir: initialDir });
    
    // Slight delay to show reset
    await new Promise(r => setTimeout(r, 500));

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
      } else if (cmd.includes('jump')) {
         if (curr.dir === 0) next.y -= 2;
         if (curr.dir === 1) next.x += 2;
         if (curr.dir === 2) next.y += 2;
         if (curr.dir === 3) next.x -= 2;
      }

      // Check boundaries
      if (next.x < 0 || next.x >= gridSize || next.y < 0 || next.y >= gridSize) {
        setStatus("CRASH! Out of bounds.");
        setCrashed(true);
        setIsRunning(false);
        return;
      }

      // Check obstacles
      if (obstacles.some(o => o.x === next.x && o.y === next.y)) {
        setStatus("CRASH! Hit an obstacle.");
        setCrashed(true);
        setIsRunning(false);
        return;
      }

      curr = next;
      setRobot(curr);
      await new Promise(r => setTimeout(r, 600)); // Animation delay
    }

    if (curr.x === endPos.x && curr.y === endPos.y) {
      setStatus("MISSION ACCOMPLISHED!");
      setTimeout(onComplete, 2000);
    } else {
      setStatus("Mission Failed. Target not reached.");
      setIsRunning(false);
    }
  };

  const addCmd = (cmd) => {
    setCode(prev => prev + (prev.endsWith('\n') || prev === '' ? '' : '\n') + cmd + '\n');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto h-screen z-10 relative px-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400">{desc}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Editor */}
        <GlassCard className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4 text-gray-400 text-sm">
            <span>Terminal</span>
            <div className="flex gap-2">
              <button onClick={() => addCmd('move forward')} className="bg-white/10 px-2 py-1 rounded hover:bg-white/20 text-xs">Forward</button>
              <button onClick={() => addCmd('turn left')} className="bg-white/10 px-2 py-1 rounded hover:bg-white/20 text-xs">Left</button>
              <button onClick={() => addCmd('turn right')} className="bg-white/10 px-2 py-1 rounded hover:bg-white/20 text-xs">Right</button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isRunning}
            className="w-full h-64 bg-black/50 text-green-400 font-mono p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type instructions here..."
          />
          <div className="mt-4 flex justify-between items-center">
            <Button onClick={() => setCode('')} variant="secondary" className="px-4 py-2 text-sm">Clear</Button>
            <Button onClick={runCode} disabled={isRunning} className="px-8 py-2">
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </GlassCard>

        {/* Visualizer */}
        <GlassCard className="flex-1 flex flex-col items-center justify-center bg-black/40">
          <div className="relative" style={{ width: gridSize * 50, height: gridSize * 50 }}>
            {/* Grid Lines */}
            {Array.from({ length: gridSize }).map((_, y) => (
              Array.from({ length: gridSize }).map((_, x) => (
                <div key={`${x}-${y}`} className="absolute border border-white/10"
                     style={{ left: x * 50, top: y * 50, width: 50, height: 50 }} />
              ))
            ))}
            
            {/* Obstacles */}
            {obstacles.map((o, i) => (
              <div key={`obs-${i}`} className="absolute bg-red-500/50 flex items-center justify-center rounded-md"
                   style={{ left: o.x * 50 + 2, top: o.y * 50 + 2, width: 46, height: 46 }}>
                <AlertTriangle size={24} className="text-red-300" />
              </div>
            ))}

            {/* End Pos */}
            <div className="absolute flex items-center justify-center animate-pulse"
                 style={{ left: endPos.x * 50, top: endPos.y * 50, width: 50, height: 50 }}>
              <Trophy className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            </div>

            {/* Robot */}
            <div className={`absolute flex items-center justify-center transition-all duration-500 ${crashed ? 'animate-shake' : ''}`}
                 style={{ 
                   left: robot.x * 50, top: robot.y * 50, width: 50, height: 50,
                   transform: `rotate(${robot.dir * 90}deg)`
                 }}>
              <Rocket className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
            </div>
          </div>
          <div className={`mt-6 font-mono text-lg ${status.includes('ACCOMPLISHED') ? 'text-green-400' : status.includes('CRASH') ? 'text-red-400' : 'text-blue-400'}`}>
            {status || "Awaiting sequence..."}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// Scene 4: Sort Algorithm (Make Tea)
const AlgorithmSortScene = ({ onNext }) => {
  const [steps, setSteps] = useState([
    { id: 1, text: "Drink tea", order: 5 },
    { id: 2, text: "Pour water into cup", order: 3 },
    { id: 3, text: "Boil water", order: 1 },
    { id: 4, text: "Put teabag in cup", order: 2 },
    { id: 5, text: "Wait 3 minutes", order: 4 },
  ]);
  const [success, setSuccess] = useState(false);

  const moveUp = (index) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setSteps(newSteps);
    checkSuccess(newSteps);
  };

  const moveDown = (index) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setSteps(newSteps);
    checkSuccess(newSteps);
  };

  const checkSuccess = (currentSteps) => {
    const isSorted = currentSteps.every((step, index) => step.order === index + 1);
    if (isSorted) {
      setSuccess(true);
      audio.playSuccess();
    } else {
      setSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen z-10 relative px-4 w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2">Algorithm Lab</h2>
      <p className="text-gray-400 mb-8 text-center">Algorithms are just sequences of steps.<br/>Arrange these steps in the correct order to make tea.</p>

      <GlassCard className="w-full">
        <div className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${success ? 'bg-green-900/30 border-green-500/50' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center gap-4">
                <span className="text-blue-400 font-mono font-bold w-6">{index + 1}.</span>
                <span className="text-white text-lg">{step.text}</span>
              </div>
              {!success && (
                <div className="flex gap-2">
                  <button onClick={() => moveUp(index)} disabled={index === 0} className="p-2 hover:bg-white/10 rounded disabled:opacity-30"><ArrowUp size={18} className="text-gray-300"/></button>
                  <button onClick={() => moveDown(index)} disabled={index === steps.length - 1} className="p-2 hover:bg-white/10 rounded disabled:opacity-30"><ArrowDown size={18} className="text-gray-300"/></button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {success && (
          <div className="mt-8 flex flex-col items-center animate-fade-in-up">
            <div className="flex items-center gap-2 text-green-400 text-xl font-bold mb-4">
              <CheckCircle2 /> Perfect Algorithm!
            </div>
            <Button onClick={onNext}>Next Sequence</Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

// Scene 5: Human vs Computer Visual
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
      if (numbers[i] === target) {
        clearInterval(interval);
        setTimeout(onNext, 3000);
      }
      i++;
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen z-10 relative w-full px-4">
      <h2 className="text-3xl md:text-5xl font-light text-white mb-12 text-center">How Computers Search</h2>
      
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-5xl">
        {/* Human Brain */}
        <GlassCard className="flex-1 flex flex-col items-center p-8">
          <h3 className="text-2xl text-blue-300 mb-6 font-bold tracking-widest">HUMAN</h3>
          <p className="text-gray-400 text-center mb-8 h-12">You instantly spot the highest number (99) by looking at the whole picture.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {numbers.map((n, i) => (
              <div key={i} className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-xl ${n === target ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.8)] scale-110' : 'bg-white/10 text-gray-400'}`}>
                {n}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Computer Brain */}
        <GlassCard className="flex-1 flex flex-col items-center p-8">
          <h3 className="text-2xl text-purple-300 mb-6 font-bold tracking-widest">COMPUTER</h3>
          <p className="text-gray-400 text-center mb-8 h-12">Computers must check one by one. They are blind to the "whole picture".</p>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {numbers.map((n, i) => (
              <div key={i} className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-xl transition-all duration-300 
                ${i === computerIndex && n === target ? 'bg-green-500 text-white scale-110 shadow-[0_0_20px_rgba(34,197,94,0.8)]' 
                : i === computerIndex ? 'bg-purple-600 text-white scale-105' 
                : 'bg-white/10 text-gray-500'}`}>
                {n}
              </div>
            ))}
          </div>
          {!started ? (
            <Button onClick={startComputer} variant="secondary">Run Search Algorithm</Button>
          ) : (
            <div className="h-12 flex items-center font-mono text-purple-300">
              {computerIndex >= 0 ? `Checking index ${computerIndex}... Is ${numbers[computerIndex]} == 99? ${numbers[computerIndex] === target ? 'YES!' : 'NO'}` : ''}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

// Scene 7: Python Terminal (Hello World & Input)
const TerminalScene = ({ onNext, setUserData }) => {
  const [lines, setLines] = useState([{ type: 'output', text: 'Python 3.10.4 initialized.' }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0); // 0: print, 1: variable/input
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [lines]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setLines(prev => [...prev, { type: 'input', text: `>>> ${cmd}` }]);
      setInput('');

      if (step === 0) {
        if (cmd === 'print("Hello World")' || cmd === "print('Hello World')") {
          setTimeout(() => {
            setLines(prev => [...prev, { type: 'output', text: 'Hello World' }]);
            setStep(1);
            audio.playSuccess();
          }, 300);
        } else {
          setTimeout(() => {
            setLines(prev => [...prev, { type: 'error', text: 'SyntaxError: Try exact spelling: print("Hello World")' }]);
          }, 300);
        }
      } else if (step === 1) {
        if (cmd.startsWith('name = "') || cmd.startsWith("name = '")) {
          const nameMatch = cmd.match(/name = ["'](.*)["']/);
          if (nameMatch) {
            const n = nameMatch[1];
            setUserData(prev => ({ ...prev, name: n }));
            setTimeout(() => {
              setLines(prev => [...prev, { type: 'output', text: `Variable 'name' stored in memory.` }]);
              setStep(2);
            }, 300);
          }
        } else {
            setTimeout(() => {
              setLines(prev => [...prev, { type: 'error', text: 'Try creating a variable: name = "YourName"' }]);
            }, 300);
        }
      } else if (step === 2) {
          if (cmd === 'print(name)') {
            setTimeout(() => {
              setLines(prev => [...prev, { type: 'output', text: 'Welcome to the matrix.' }]);
              audio.playSuccess();
              setTimeout(onNext, 2000);
            }, 300);
          } else {
             setTimeout(() => {
              setLines(prev => [...prev, { type: 'error', text: 'Try printing the variable: print(name)' }]);
            }, 300);
          }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen z-10 relative px-4 w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-light text-white mb-2">Write Real Code</h2>
        <p className="text-gray-400">
          {step === 0 && "Type: print(\"Hello World\")"}
          {step === 1 && "Create a memory box. Type: name = \"YourName\""}
          {step === 2 && "Let's use that memory. Type: print(name)"}
        </p>
      </div>

      <GlassCard className="w-full bg-[#0d1117] border-gray-800 p-0 overflow-hidden font-mono text-sm md:text-base">
        <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-gray-500 text-xs">main.py</span>
        </div>
        <div className="p-6 h-[400px] overflow-y-auto flex flex-col">
          {lines.map((l, i) => (
            <div key={i} className={`mb-2 ${l.type === 'input' ? 'text-gray-300' : l.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
              {l.text}
            </div>
          ))}
          <div className="flex items-center text-gray-300 mt-2">
            <span className="mr-2 text-blue-400">{">>>"}</span>
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="bg-transparent outline-none flex-1 font-mono text-gray-300"
              spellCheck="false"
              autoComplete="off"
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// Scene: Powers
const PowersScene = ({ onNext }) => {
  const powers = [
    { icon: <Globe size={40}/>, title: "Build the Web", desc: "Create interactive worlds." },
    { icon: <Cpu size={40}/>, title: "Create AI", desc: "Teach machines to think." },
    { icon: <Code2 size={40}/>, title: "Hack Logic", desc: "Solve complex puzzles instantly." }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen z-10 relative px-4 w-full">
      <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-16">
        What Will You Build?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
        {powers.map((p, i) => (
          <GlassCard key={i} className="flex flex-col items-center text-center p-10 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
              {p.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{p.title}</h3>
            <p className="text-gray-400">{p.desc}</p>
          </GlassCard>
        ))}
      </div>
      <Button onClick={onNext} className="px-12 py-4 text-xl">PROVE YOUR SKILLS</Button>
    </div>
  );
}

// Scene: Final Checklist
const OutroScene = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen z-10 relative px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-light text-white mb-12">Journey Complete</h1>
      
      <GlassCard className="max-w-2xl w-full mb-12 text-left bg-black/60">
        <h3 className="text-2xl text-blue-400 mb-6 border-b border-white/10 pb-4">Today you learned:</h3>
        <ul className="space-y-4 text-lg text-gray-300">
          <li className="flex items-center gap-4 animate-fade-in-up" style={{animationDelay: '100ms'}}>
            <CheckCircle2 className="text-green-500" /> Computers need exact instructions
          </li>
          <li className="flex items-center gap-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
            <CheckCircle2 className="text-green-500" /> Algorithms are just step-by-step logic
          </li>
          <li className="flex items-center gap-4 animate-fade-in-up" style={{animationDelay: '500ms'}}>
            <CheckCircle2 className="text-green-500" /> Debugging is finding and fixing errors
          </li>
          <li className="flex items-center gap-4 animate-fade-in-up" style={{animationDelay: '700ms'}}>
            <CheckCircle2 className="text-green-500" /> Your first lines of Python code
          </li>
        </ul>
      </GlassCard>

      <div className="animate-fade-in-up" style={{animationDelay: '1500ms'}}>
        <p className="text-2xl text-white font-light mb-8 italic">The future belongs to builders.</p>
        <Button onClick={() => window.location.reload()} variant="primary" className="text-xl px-10 py-4 shadow-[0_0_40px_rgba(79,70,229,0.6)]">
          START PYTHON COURSE
        </Button>
      </div>
    </div>
  )
}

// --- MAIN APP CONTROLLER ---
export default function App() {
  const [scene, setScene] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [userData, setUserData] = useState({ name: 'Coder' });

  const nextScene = () => {
    setTransitioning(true);
    setTimeout(() => {
      setScene(s => s + 1);
      setTransitioning(false);
    }, 600); // Wait for fade out
  };

  const handleBegin = () => {
    audio.start();
    nextScene();
  }

  // Scene definitions
  const renderScene = () => {
    switch (scene) {
      case 0: return <IntroScene onNext={handleBegin} />;
      case 1: return <RobotSandwichScene onNext={nextScene} />;
      case 2: return <GridWorld 
                        title="Your First Algorithm" 
                        desc="Write commands to guide the rover to the data crystal."
                        gridSize={5} 
                        startPos={{x: 0, y: 4}} 
                        endPos={{x: 4, y: 0}} 
                        onComplete={nextScene} 
                      />;
      case 3: return <AlgorithmSortScene onNext={nextScene} />;
      case 4: return <HumanVsComputerScene onNext={nextScene} />;
      case 5: return <GridWorld 
                        title="Debugging" 
                        desc="The code has a bug. It will crash into the asteroid. Fix it!"
                        gridSize={5} 
                        startPos={{x: 0, y: 2}} 
                        endPos={{x: 4, y: 2}} 
                        obstacles={[{x: 2, y: 2}]}
                        initialDir={1}
                        prefilledCode="move forward\nmove forward\nmove forward\nmove forward" // This will hit the obstacle
                        onComplete={nextScene} 
                      />;
      case 6: return <TerminalScene onNext={nextScene} setUserData={setUserData} />;
      case 7: return <PowersScene onNext={nextScene} />;
      case 8: return <GridWorld 
                        title="Boss Battle" 
                        desc="Navigate the maze. Write the complete sequence."
                        gridSize={6} 
                        startPos={{x: 0, y: 5}} 
                        endPos={{x: 5, y: 0}} 
                        obstacles={[{x: 1, y: 5}, {x: 1, y: 4}, {x: 3, y: 3}, {x: 3, y: 2}, {x: 3, y: 1}, {x: 4, y: 3}]}
                        initialDir={1}
                        onComplete={nextScene} 
                      />;
      case 9: return <OutroScene />;
      default: return null;
    }
  };

  // Add styles dynamically for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0) scale(1.1); }
        25% { transform: translateX(-5px) scale(1.1); }
        75% { transform: translateX(5px) scale(1.1); }
      }
      .animate-shake {
        animation: shake 0.3s ease-in-out 2;
      }
      .scene-transition {
        transition: opacity 0.6s ease-in-out;
      }
      .opacity-0 { opacity: 0; }
      .opacity-100 { opacity: 1; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-[#050510] text-slate-100 font-sans overflow-hidden selection:bg-blue-500/30">
      <Starfield />
      
      {/* Progress Bar */}
      {scene > 0 && scene < 9 && (
        <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
            style={{ width: `${(scene / 8) * 100}%` }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className={`scene-transition ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        {renderScene()}
      </main>
    </div>
  );
}