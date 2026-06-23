import React, { useState } from 'react';
import { DoodleCard, DoodleButton, Sticker, audio } from '../ui/DoodleUI';
import { Video, Map as MapIcon, Gamepad2, ShoppingCart, MessageSquare, Watch } from 'lucide-react';

export const Level6: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visited, setVisited] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<{id: string, text: string} | null>(null);

  const mapItems = [
    { id: 'youtube', icon: Video, label: 'Video App', color: 'bg-red-400', text: 'Algorithms recommend videos you might like based on what you watched before!' },
    { id: 'maps', icon: MapIcon, label: 'Maps', color: 'bg-green-400', text: 'Code calculates the shortest route to your destination in milliseconds.' },
    { id: 'games', icon: Gamepad2, label: 'Games', color: 'bg-purple-400', text: 'Physics engines use math and code to make characters jump and fall realistically.' },
    { id: 'shop', icon: ShoppingCart, label: 'Shopping', color: 'bg-yellow-400', text: 'Databases securely store your cart and process payments across the globe.' },
    { id: 'chat', icon: MessageSquare, label: 'Chatbots', color: 'bg-sky-400', text: 'AI processes language to understand your questions and generate human-like answers.' },
    { id: 'watch', icon: Watch, label: 'Smartwatch', color: 'bg-pink-400', text: 'Sensors track your movement, and code translates that into steps and heart rate.' }
  ];

  const handleItemClick = (item: any) => {
    setActiveItem(item);
    audio.playPop();
    if (!visited.includes(item.id)) {
      setVisited(prev => [...prev, item.id]);
    }
  };

  const allVisited = visited.length === mapItems.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 animate-bounce-in pt-24 w-full max-w-5xl mx-auto">
      
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-chunky text-slate-800 mb-4">Coding is <span className="text-sky-500 underline decoration-8 underline-offset-4">Everywhere!</span> 🌍</h2>
        <p className="font-hand text-2xl text-slate-600">
          Click the locations to see how code powers our world. Explore them all!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Interactive Map */}
        <DoodleCard className="bg-sky-50 relative min-h-[400px] flex items-center justify-center overflow-hidden border-8 border-slate-800">
           {/* Decorative Map Elements */}
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
           
           <div className="relative w-full h-full p-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
              {mapItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`flex flex-col items-center justify-center p-4 rounded-3xl border-4 transition-all shadow-[4px_4px_0_#1e293b] active:translate-y-1 active:shadow-none hover:-translate-y-1
                  ${visited.includes(item.id) ? 'border-slate-300 bg-white' : `border-slate-800 ${item.color}`}
                  ${activeItem?.id === item.id ? 'ring-4 ring-pink-400 scale-105' : ''}`}
                >
                  <item.icon size={48} className={visited.includes(item.id) ? 'text-slate-400' : 'text-slate-800'} />
                  <span className={`font-chunky mt-2 ${visited.includes(item.id) ? 'text-slate-400' : 'text-slate-800'}`}>{item.label}</span>
                </button>
              ))}
           </div>
        </DoodleCard>

        {/* Info Panel */}
        <DoodleCard className="bg-white flex flex-col justify-center min-h-[400px]" rotation="1">
          {activeItem ? (
            <div className="animate-bounce-in text-center">
              <div className={`w-24 h-24 mx-auto rounded-full border-4 border-slate-800 flex items-center justify-center mb-6 shadow-[4px_4px_0_#1e293b] ${mapItems.find(i => i.id === activeItem.id)?.color}`}>
                 {React.createElement(mapItems.find(i => i.id === activeItem.id)!.icon, { size: 48, className: "text-slate-800" })}
              </div>
              <h3 className="text-3xl font-chunky text-slate-800 mb-4">{activeItem.id.toUpperCase()}</h3>
              <p className="font-hand text-2xl text-slate-600 bg-yellow-100 border-2 border-yellow-400 p-6 rounded-2xl">
                {activeItem.text}
              </p>
            </div>
          ) : (
            <div className="text-center opacity-50 font-hand text-2xl text-slate-500">
              Click a location on the map to investigate! 🔍
            </div>
          )}

          {allVisited && (
            <div className="mt-8 text-center animate-bounce-in">
              <p className="font-chunky text-xl text-green-600 mb-4">Area fully explored! 🌟</p>
              <DoodleButton onClick={() => { audio.playSuccess(); onComplete(); }} color="bg-blue-400 text-white">
                Next Level ➡️
              </DoodleButton>
            </div>
          )}
        </DoodleCard>
      </div>

    </div>
  );
};
