import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ProgressBar } from './components/ui/ProgressBar';
import { KnowledgeCheck } from './components/knowledge-check/KnowledgeCheck';
import { TeacherDashboard } from './components/TeacherDashboard';
import { DoodleButton } from './components/ui/DoodleUI';

// Levels
import { Level1 } from './components/levels/Level1';
import { Level2 } from './components/levels/Level2';
import { Level3 } from './components/levels/Level3';
import { Level4 } from './components/levels/Level4';
import { Level5 } from './components/levels/Level5';
import { Level6 } from './components/levels/Level6';
import { Level7 } from './components/levels/Level7';
import { Level8 } from './components/levels/Level8';
import { Level9 } from './components/levels/Level9';
import { Level10 } from './components/levels/Level10';
import { Outro } from './components/levels/Outro';
import type { KnowledgeCheckConfig } from './types';

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
      margin: 0;
      font-family: 'Fredoka', sans-serif;
    }
    
    .font-chunky { font-family: 'Fredoka', sans-serif; }
    .font-hand { font-family: 'Kalam', cursive; }

    .highlighter-yellow {
      background: linear-gradient(180deg, rgba(255,255,255,0) 50%, #fde047 50%);
    }

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
    
    .scene-transition { transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out; }
    .scene-out { opacity: 0; transform: scale(0.95); }
    .scene-in { opacity: 1; transform: scale(1); }
  `;
  document.head.appendChild(style);
};

// Quizzes Configuration
const QUIZZES: Record<number, KnowledgeCheckConfig> = {
  1: {
    levelId: 1, title: "Level 1 Check",
    questions: [{ id: 'q1', type: 'multiple-choice', question: "What is coding?", options: ["Playing games", "Giving instructions to computers", "Fixing hardware"], correctAnswer: "Giving instructions to computers", explanation: "Coding is how we talk to computers by giving them precise step-by-step instructions." }]
  },
  3: {
    levelId: 3, title: "Level 3 Check",
    questions: [{ id: 'q2', type: 'multiple-choice', question: "What is an algorithm?", options: ["A robot", "A step-by-step plan", "A bug in the code"], correctAnswer: "A step-by-step plan", explanation: "Algorithms are just step-by-step plans used to solve problems or complete tasks." }]
  },
  5: {
    levelId: 5, title: "Level 5 Check",
    questions: [{ id: 'q3', type: 'multiple-choice', question: "What is a 'bug' in coding?", options: ["An insect inside the computer", "A mistake in the instructions", "A fast program"], correctAnswer: "A mistake in the instructions", explanation: "When a program doesn't work as expected, we call the mistake a bug!" }]
  },
  8: {
    levelId: 8, title: "Level 8 Check",
    questions: [{ id: 'q4', type: 'multiple-choice', question: "What do web developers build?", options: ["Websites using HTML and CSS", "Robots", "Physical buildings"], correctAnswer: "Websites using HTML and CSS" }]
  }
};

const GameController: React.FC = () => {
  const { level, setLevel, addXP } = useGame();
  const [transitionState, setTransitionState] = useState('in');
  const [showQuiz, setShowQuiz] = useState(false);
  const [teacherMode, setTeacherMode] = useState(false);

  useEffect(() => { injectStyles(); }, []);

  const handleLevelComplete = () => {
    addXP(100);
    // Determine if next step is a quiz or next level
    if (QUIZZES[level]) {
      setTransitionState('out');
      setTimeout(() => {
        setShowQuiz(true);
        setTransitionState('in');
        window.scrollTo(0,0);
      }, 400);
    } else {
      goToNextLevel();
    }
  };

  const handleQuizComplete = () => {
    goToNextLevel();
  };

  const goToNextLevel = () => {
    setTransitionState('out');
    setTimeout(() => {
      setShowQuiz(false);
      setLevel(level + 1);
      setTransitionState('in');
      window.scrollTo(0,0);
    }, 400);
  };

  if (teacherMode) {
    return <TeacherDashboard onExit={() => setTeacherMode(false)} />;
  }

  const renderScene = () => {
    if (showQuiz && QUIZZES[level]) {
      return <KnowledgeCheck config={QUIZZES[level]} onComplete={handleQuizComplete} />;
    }
    switch (level) {
      case 0: return (
        <div className="min-h-screen flex flex-col items-center justify-center relative animate-bounce-in">
           <h1 className="text-6xl md:text-8xl font-chunky text-slate-800 mb-8 transform -rotate-2 text-center">
             <span className="highlighter-yellow px-4">CodeQuest</span> 🚀
           </h1>
           <DoodleButton onClick={handleLevelComplete} color="bg-blue-400 text-white">Start Adventure</DoodleButton>
           <button onClick={() => setTeacherMode(true)} className="absolute bottom-4 right-4 text-slate-400 font-hand hover:text-slate-600 underline">
             Teacher Mode
           </button>
        </div>
      );
      case 1: return <Level1 onComplete={handleLevelComplete} />;
      case 2: return <Level2 onComplete={handleLevelComplete} />;
      case 3: return <Level3 onComplete={handleLevelComplete} />;
      case 4: return <Level4 onComplete={handleLevelComplete} />;
      case 5: return <Level5 onComplete={handleLevelComplete} />;
      case 6: return <Level6 onComplete={handleLevelComplete} />;
      case 7: return <Level7 onComplete={handleLevelComplete} />;
      case 8: return <Level8 onComplete={handleLevelComplete} />;
      case 9: return <Level9 onComplete={handleLevelComplete} />;
      case 10: return <Level10 onComplete={handleLevelComplete} />;
      default: return <Outro />;
    }
  };

  return (
    <>
      {level > 0 && level <= 10 && <ProgressBar />}
      <main className={`scene-transition ${transitionState === 'out' ? 'scene-out' : 'scene-in'}`}>
        {renderScene()}
      </main>
    </>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameController />
    </GameProvider>
  );
}