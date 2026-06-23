import React from 'react';

// --- AUDIO SYSTEM (Success sounds only) ---
class AudioEngine {
  ctx: AudioContext | null = null;

  playSuccess() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
      if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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

  playError() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) { console.log(e); }
  }
}

export const audio = new AudioEngine();

export const DoodleCard: React.FC<{ children: React.ReactNode, className?: string, rotation?: string | number }> = ({ children, className = "", rotation = "0" }) => (
  <div 
    className={`bg-white border-4 border-slate-800 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#1e293b] relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_#1e293b] ${className}`}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    {children}
  </div>
);

export const DoodleButton: React.FC<{ onClick?: () => void, children: React.ReactNode, color?: string, className?: string, disabled?: boolean }> = ({ onClick, children, color = "bg-yellow-300", className = "", disabled = false }) => (
  <button 
    onClick={() => { 
      if (!disabled) {
        audio.playPop(); 
        if (onClick) onClick(); 
      }
    }} 
    disabled={disabled}
    className={`font-chunky text-xl uppercase tracking-wider px-8 py-4 border-4 border-slate-800 rounded-2xl shadow-[4px_4px_0_#1e293b] active:shadow-[0_0_0_#1e293b] active:translate-y-1 active:translate-x-1 transition-all ${color} ${className} ${disabled ? 'opacity-50 cursor-not-allowed shadow-[0_0_0_#1e293b] translate-y-1 translate-x-1' : ''}`}
  >
    {children}
  </button>
);

export const Sticker: React.FC<{ icon?: React.ElementType, emoji?: string, color?: string, className?: string, style?: React.CSSProperties }> = ({ icon: Icon, emoji, color = "bg-white", className = "", style = {} }) => (
  <div className={`absolute w-16 h-16 rounded-full border-4 border-slate-800 shadow-[4px_4px_0_#1e293b] flex items-center justify-center text-3xl animate-float z-10 ${color} ${className}`} style={style}>
    {Icon ? <Icon size={28} className="text-slate-800" strokeWidth={3} /> : emoji}
  </div>
);
