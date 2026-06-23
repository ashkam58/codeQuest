import React, { useState } from 'react';
import { DoodleCard, DoodleButton, Sticker, audio } from '../ui/DoodleUI';
import { Code, Eye } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const Level8: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { unlockBadge } = useGame();
  
  const [htmlCode, setHtmlCode] = useState(
`<div style="background: #e0f2fe; padding: 20px; border-radius: 10px; text-align: center;">
  <h1 style="color: #0369a1;">Hello World!</h1>
  <p>My name is [Your Name]</p>
  <p>I like playing [Your Game]</p>
</div>`
  );

  const handleComplete = () => {
    unlockBadge('website_creator');
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 w-full max-w-6xl mx-auto animate-bounce-in pt-24">
      
      <div className="text-center mb-8 relative z-10">
        <span className="inline-block px-4 py-1 bg-blue-300 border-2 border-slate-800 rounded-full font-chunky text-slate-800 mb-4 transform -rotate-2 shadow-[2px_2px_0_#1e293b]">
          WEB DEVELOPER LAB 🌐
        </span>
        <h2 className="text-4xl md:text-5xl font-chunky text-slate-800 mb-4">Build Your Profile</h2>
        <p className="font-hand text-2xl text-slate-600 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 inline-block shadow-sm">
          Edit the HTML code on the left to change what appears on the right!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full z-10">
        {/* Editor Area */}
        <DoodleCard className="flex-1 bg-slate-800 p-0 overflow-hidden" rotation="-1">
          <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b-2 border-slate-700">
            <Code size={20} className="text-slate-400" />
            <span className="font-mono text-slate-400 text-sm">index.html</span>
          </div>
          <textarea
            value={htmlCode}
            onChange={(e) => { setHtmlCode(e.target.value); }}
            className="w-full h-80 bg-slate-800 text-green-400 font-mono p-4 focus:outline-none resize-none"
            spellCheck={false}
          />
        </DoodleCard>

        {/* Live Preview */}
        <DoodleCard className="flex-1 bg-white p-0 overflow-hidden border-8 border-slate-800" rotation="1">
          <div className="bg-slate-200 px-4 py-2 flex items-center gap-2 border-b-4 border-slate-800">
            <Eye size={20} className="text-slate-600" />
            <span className="font-chunky text-slate-600 text-sm">Live Browser Preview</span>
          </div>
          <div 
            className="w-full h-80 p-4 overflow-auto font-sans"
            dangerouslySetInnerHTML={{ __html: htmlCode }}
          />
        </DoodleCard>
      </div>

      <div className="mt-8 text-center animate-bounce-in">
        <p className="font-hand text-xl text-slate-600 mb-4">Did you change the Name and Game? Awesome!</p>
        <DoodleButton onClick={() => { audio.playSuccess(); handleComplete(); }} color="bg-pink-400 text-white">
          I'm a Web Developer! ➡️
        </DoodleButton>
      </div>

    </div>
  );
};
