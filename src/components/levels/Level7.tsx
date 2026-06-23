import React, { useState } from 'react';
import { DoodleCard, DoodleButton, Sticker, audio } from '../ui/DoodleUI';
import { UserCircle, Gamepad2, Bot, Calculator as CalcIcon, Film } from 'lucide-react';

export const Level7: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<string>('profile');

  const tabs = [
    { id: 'profile', icon: UserCircle, label: 'Website', color: 'bg-blue-300' },
    { id: 'game', icon: Gamepad2, label: 'Game', color: 'bg-green-300' },
    { id: 'ai', icon: Bot, label: 'AI', color: 'bg-purple-300' },
    { id: 'app', icon: CalcIcon, label: 'App', color: 'bg-yellow-300' },
    { id: 'anim', icon: Film, label: 'Animation', color: 'bg-pink-300' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 animate-bounce-in pt-24 w-full max-w-5xl mx-auto">
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-chunky text-slate-800 mb-4">What Can You Build? 🚀</h2>
        <p className="font-hand text-2xl text-slate-600">
          Coding lets you create anything you can imagine! Check out these examples.
        </p>
      </div>

      <DoodleCard className="w-full bg-slate-50 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Tabs */}
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:w-1/3 border-b-4 md:border-b-0 md:border-r-4 border-slate-200 pr-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); audio.playPop(); }}
              className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all whitespace-nowrap md:whitespace-normal
              ${activeTab === tab.id ? `${tab.color} border-slate-800 shadow-[4px_4px_0_#1e293b] translate-x-2` : 'bg-white border-slate-300 hover:border-slate-400'}`}
            >
              <tab.icon size={24} className={activeTab === tab.id ? 'text-slate-800' : 'text-slate-500'} />
              <span className={`font-chunky text-lg ${activeTab === tab.id ? 'text-slate-800' : 'text-slate-500'}`}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:w-2/3 flex flex-col items-center justify-center min-h-[300px]">
          
          {activeTab === 'profile' && (
            <div className="animate-bounce-in text-center w-full">
              <div className="bg-white border-4 border-slate-800 p-6 rounded-3xl shadow-[4px_4px_0_#1e293b] inline-block">
                <div className="w-24 h-24 bg-blue-100 rounded-full border-4 border-slate-800 mx-auto flex items-center justify-center mb-4">
                  <UserCircle size={48} className="text-blue-500" />
                </div>
                <h3 className="font-chunky text-2xl text-slate-800 mb-2">Alex Coder</h3>
                <p className="font-hand text-slate-600 bg-slate-100 p-2 rounded-lg">I love building websites!</p>
              </div>
              <p className="font-hand text-xl text-slate-500 mt-6">Web Developers build sites like this using HTML, CSS, and JS!</p>
            </div>
          )}

          {activeTab === 'game' && (
            <div className="animate-bounce-in text-center w-full">
              <div className="bg-slate-800 text-green-400 font-mono p-6 rounded-3xl border-4 border-slate-800 shadow-[4px_4px_0_#1e293b] inline-block">
                <div className="text-xl mb-4">I'm thinking of a number...</div>
                <div className="flex gap-2 justify-center">
                  <button className="px-4 py-2 bg-slate-700 rounded border border-green-400 hover:bg-slate-600 transition-colors">1</button>
                  <button className="px-4 py-2 bg-slate-700 rounded border border-green-400 hover:bg-slate-600 transition-colors">2</button>
                  <button className="px-4 py-2 bg-slate-700 rounded border border-green-400 hover:bg-slate-600 transition-colors">3</button>
                </div>
              </div>
              <p className="font-hand text-xl text-slate-500 mt-6">Game Developers use code to create logic, scoring, and fun mechanics.</p>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="animate-bounce-in text-center w-full flex flex-col items-center">
              <div className="bg-white border-4 border-slate-800 p-4 rounded-3xl w-full max-w-sm shadow-[4px_4px_0_#1e293b]">
                <div className="flex items-start gap-2 mb-4">
                  <Bot size={24} className="text-purple-500 mt-1" />
                  <div className="bg-purple-100 p-3 rounded-2xl rounded-tl-none font-hand text-left">Hello! I'm an AI. How can I help you learn today?</div>
                </div>
                <div className="flex items-start gap-2 flex-row-reverse mb-4">
                  <UserCircle size={24} className="text-blue-500 mt-1" />
                  <div className="bg-blue-100 p-3 rounded-2xl rounded-tr-none font-hand text-left">Can you tell me a coding joke?</div>
                </div>
              </div>
              <p className="font-hand text-xl text-slate-500 mt-6">Machine Learning Engineers teach programs to chat and think!</p>
            </div>
          )}

          {activeTab === 'app' && (
            <div className="animate-bounce-in text-center w-full">
               <div className="bg-yellow-100 border-4 border-slate-800 p-6 rounded-3xl w-48 mx-auto shadow-[4px_4px_0_#1e293b]">
                 <div className="bg-white text-right p-2 font-mono text-2xl border-2 border-slate-800 mb-4 rounded">42</div>
                 <div className="grid grid-cols-3 gap-2">
                   {[7,8,9,4,5,6,1,2,3,0,'.','='].map(n => (
                     <div key={n} className="bg-white border-2 border-slate-800 p-2 text-center rounded font-chunky">{n}</div>
                   ))}
                 </div>
               </div>
               <p className="font-hand text-xl text-slate-500 mt-6">App Developers build useful tools for our phones.</p>
            </div>
          )}

          {activeTab === 'anim' && (
            <div className="animate-bounce-in text-center w-full">
               <div className="bg-white border-4 border-slate-800 p-8 rounded-3xl mx-auto shadow-[4px_4px_0_#1e293b] inline-block">
                 <div className="animate-shake-cute inline-block text-6xl">👾</div>
               </div>
               <p className="font-hand text-xl text-slate-500 mt-6">Creative Coders use math to bring art and animation to life.</p>
            </div>
          )}

        </div>
      </DoodleCard>

      <div className="mt-12">
        <DoodleButton onClick={onComplete} color="bg-blue-400 text-white">
          I'm Ready to Build! 🛠️
        </DoodleButton>
      </div>
    </div>
  );
};
