import React, { useState } from 'react';
import { ArrowUp, Star } from 'lucide-react';
import { DoodleCard, DoodleButton, audio } from '../ui/DoodleUI';

interface GridWorldProps {
  title: string;
  desc: string;
  gridSize?: number;
  startPos: { x: number, y: number };
  endPos: { x: number, y: number };
  obstacles?: { x: number, y: number }[];
  prefilledCode?: string;
  initialDir?: number;
  onComplete: () => void;
  isBugged?: boolean;
}

export const GridWorld: React.FC<GridWorldProps> = ({ 
  title, desc, gridSize = 5, startPos, endPos, 
  obstacles = [], prefilledCode = "", initialDir = 0, 
  onComplete, isBugged = false 
}) => {
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
        setCrashed(true); audio.playError(); setIsRunning(false); return;
      }

      if (obstacles.some(o => o.x === next.x && o.y === next.y)) {
        setStatus("💥 CRASH! Hit a wall.");
        setCrashed(true); audio.playError(); setIsRunning(false); return;
      }

      curr = next;
      setRobot(curr);
      audio.playPop();
      await new Promise(r => setTimeout(r, 500));
    }

    if (curr.x === endPos.x && curr.y === endPos.y) {
      setStatus("🎉 MISSION ACCOMPLISHED!");
      audio.playSuccess();
      setTimeout(() => {
        setIsRunning(false);
        onComplete();
      }, 2000);
    } else {
      setStatus("🤔 Mission Failed. Target not reached.");
      audio.playError();
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 w-full max-w-6xl mx-auto animate-bounce-in pt-24">
      <div className="text-center mb-8 relative z-10">
        <span className="inline-block px-4 py-1 bg-yellow-300 border-2 border-slate-800 rounded-full font-chunky text-slate-800 mb-4 transform -rotate-2 shadow-[2px_2px_0_#1e293b]">
          {isBugged ? "DEBUGGING LAB 🐞" : "ALGORITHM BUILDER 🛠️"}
        </span>
        <h2 className="text-4xl md:text-5xl font-chunky text-slate-800 mb-4">{title}</h2>
        <p className="font-hand text-2xl text-slate-600 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 inline-block shadow-sm">{desc}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full z-10 items-center justify-center">
        {/* Editor (Sticky Note Style) */}
        <div className="flex-1 w-full max-w-md bg-yellow-200 border-4 border-slate-800 p-6 rounded-br-3xl rounded-tl-2xl shadow-[8px_8px_0_#1e293b] relative transform -rotate-1">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-400/50 -mt-8 rotate-2"></div>
          
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
            <button 
              onClick={() => { setCode(''); setRobot({ ...startPos, dir: initialDir }); setStatus(''); setCrashed(false); setIsRunning(false); }} 
              className="font-chunky text-slate-600 underline hover:text-slate-900"
            >
              Clear
            </button>
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
          <div className="mt-6 text-center h-12">
            {status && (
              <span className={`inline-block font-chunky px-4 py-2 rounded-xl border-2 border-slate-800 ${status.includes('ACCOMPLISHED') ? 'bg-green-300' : status.includes('CRASH') ? 'bg-red-300' : 'bg-white'}`}>
                {status}
              </span>
            )}
          </div>
        </DoodleCard>
      </div>
    </div>
  );
};
