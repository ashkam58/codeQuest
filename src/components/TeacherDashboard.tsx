import React from 'react';
import { useGame } from '../context/GameContext';
import { DoodleCard, DoodleButton } from './ui/DoodleUI';
import { Users, Clock, Award, CheckCircle2 } from 'lucide-react';

export const TeacherDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { xp, level, unlockedBadges, quizScores } = useGame();

  // Mock data for other students
  const mockStudents = [
    { name: "Alice", progress: 80, xp: 1200, status: 'Active' },
    { name: "Bob", progress: 45, xp: 600, status: 'Needs Help' },
    { name: "Charlie", progress: 100, xp: 1800, status: 'Completed' },
  ];

  // Current student progress
  const currentProgress = Math.min(100, (level / 10) * 100);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-chunky text-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl">Educator Dashboard 📊</h1>
          <DoodleButton onClick={onExit} color="bg-red-400 text-white" className="px-4 py-2 text-sm">
            Exit Teacher Mode
          </DoodleButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DoodleCard className="bg-white" rotation="-1">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-sky-100 rounded-2xl"><Users size={32} className="text-sky-600"/></div>
              <div>
                <div className="text-sm text-slate-500 font-hand">Total Students</div>
                <div className="text-3xl">24</div>
              </div>
            </div>
          </DoodleCard>
          <DoodleCard className="bg-white" rotation="1">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-2xl"><CheckCircle2 size={32} className="text-green-600"/></div>
              <div>
                <div className="text-sm text-slate-500 font-hand">Avg Completion</div>
                <div className="text-3xl">65%</div>
              </div>
            </div>
          </DoodleCard>
          <DoodleCard className="bg-white" rotation="-1">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-yellow-100 rounded-2xl"><Award size={32} className="text-yellow-600"/></div>
              <div>
                <div className="text-sm text-slate-500 font-hand">Badges Earned</div>
                <div className="text-3xl">142</div>
              </div>
            </div>
          </DoodleCard>
          <DoodleCard className="bg-white" rotation="1">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-100 rounded-2xl"><Clock size={32} className="text-purple-600"/></div>
              <div>
                <div className="text-sm text-slate-500 font-hand">Avg Time</div>
                <div className="text-3xl">45m</div>
              </div>
            </div>
          </DoodleCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DoodleCard className="bg-white">
              <h2 className="text-2xl mb-6 border-b-2 border-slate-100 pb-4">Live Student View (You)</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="font-hand text-xl">Current Level: {level}</span>
                <span className="bg-yellow-200 px-3 py-1 rounded-xl text-sm border-2 border-slate-800">{xp} XP</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full border-2 border-slate-300 overflow-hidden mb-2">
                <div className="h-full bg-green-400" style={{ width: `${currentProgress}%` }}></div>
              </div>
              <div className="text-right text-sm text-slate-500">{currentProgress}% Complete</div>
              
              <h3 className="text-xl mt-6 mb-4">Quiz Scores</h3>
              <div className="space-y-2">
                {Object.entries(quizScores).length === 0 && <p className="text-slate-500 font-hand">No quizzes completed yet.</p>}
                {Object.entries(quizScores).map(([lvl, score]) => (
                  <div key={lvl} className="flex justify-between p-2 bg-slate-50 rounded-lg border-2 border-slate-200">
                    <span>Level {lvl} Knowledge Check</span>
                    <span className="font-bold text-sky-600">{score} Points</span>
                  </div>
                ))}
              </div>
            </DoodleCard>

            <DoodleCard className="bg-white">
              <h2 className="text-2xl mb-6 border-b-2 border-slate-100 pb-4">Class Roster</h2>
              <div className="space-y-4">
                {mockStudents.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-pink-200 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold">
                        {s.name[0]}
                      </div>
                      <div>
                        <div className="font-bold">{s.name}</div>
                        <div className="text-sm text-slate-500">{s.xp} XP</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-sm px-2 py-1 rounded-full border-2 border-slate-800 mb-2 ${s.status === 'Needs Help' ? 'bg-red-200' : s.status === 'Completed' ? 'bg-green-200' : 'bg-sky-200'}`}>
                        {s.status}
                      </span>
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-400">
                        <div className="h-full bg-slate-800" style={{ width: `${s.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DoodleCard>
          </div>

          <div className="space-y-6">
             <DoodleCard className="bg-white bg-opacity-50">
               <h2 className="text-2xl mb-4">Quick Actions</h2>
               <div className="space-y-3 flex flex-col">
                 <button className="p-3 bg-white border-2 border-slate-800 rounded-xl text-left hover:bg-slate-50">📥 Export Report (CSV)</button>
                 <button className="p-3 bg-white border-2 border-slate-800 rounded-xl text-left hover:bg-slate-50">💬 Message Class</button>
                 <button className="p-3 bg-white border-2 border-slate-800 rounded-xl text-left hover:bg-slate-50">⚙️ Curriculum Settings</button>
               </div>
             </DoodleCard>
          </div>
        </div>
      </div>
    </div>
  );
};
