import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import type { KnowledgeCheckConfig, Question } from '../../types';
import { DoodleCard, DoodleButton, Sticker, audio } from '../ui/DoodleUI';
import { Brain, CheckCircle2, XCircle } from 'lucide-react';

interface KnowledgeCheckProps {
  config: KnowledgeCheckConfig;
  onComplete: () => void;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({ config, onComplete }) => {
  const { addXP, saveQuizScore } = useGame();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = config.questions[currentIdx];

  const handleSelect = (opt: string) => {
    if (showResult) return;
    setSelectedOption(opt);
    audio.playPop();
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    setShowResult(true);
    
    // Simplistic check for MC and TF
    if (selectedOption === String(question.correctAnswer)) {
      audio.playSuccess();
      setScore(s => s + 1);
      addXP(50); // 50 XP per correct answer
    } else {
      audio.playError();
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedOption(null);
    if (currentIdx < config.questions.length - 1) {
      setCurrentIdx(curr => curr + 1);
    } else {
      setFinished(true);
      saveQuizScore(config.levelId, score + (selectedOption === String(question.correctAnswer) ? 1 : 0));
      addXP(100); // 100 XP for completing a knowledge check
      audio.playSuccess();
    }
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 animate-bounce-in pt-24">
        <Sticker icon={CheckCircle2} color="bg-green-300" className="top-24 left-1/4" />
        <DoodleCard className="max-w-2xl w-full text-center" rotation="-1">
          <h2 className="text-5xl font-chunky text-slate-800 mb-6">Mission Complete! 🎯</h2>
          <p className="font-hand text-3xl text-slate-600 mb-8">
            You scored {score} / {config.questions.length}
          </p>
          <div className="flex justify-center gap-4 text-xl font-chunky text-slate-800 mb-8">
            <div className="bg-yellow-300 border-2 border-slate-800 rounded-xl px-4 py-2 shadow-[2px_2px_0_#1e293b]">
              +{score * 50 + 100} XP Earned!
            </div>
          </div>
          <DoodleButton onClick={onComplete} color="bg-blue-400 text-white">
            Continue Journey ➡️
          </DoodleButton>
        </DoodleCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 py-12 animate-bounce-in pt-24">
      <div className="text-center mb-8 relative z-10">
        <span className="inline-block px-4 py-1 bg-sky-300 border-2 border-slate-800 rounded-full font-chunky text-slate-800 mb-4 transform -rotate-2 shadow-[2px_2px_0_#1e293b]">
          KNOWLEDGE CHECK 🧠
        </span>
        <h2 className="text-4xl font-chunky text-slate-800">{config.title}</h2>
      </div>

      <DoodleCard className="max-w-2xl w-full" rotation="1">
        <div className="flex justify-between items-center mb-6 font-chunky text-slate-500 border-b-2 border-slate-200 pb-4">
          <span>Question {currentIdx + 1} of {config.questions.length}</span>
          <span>Score: {score}</span>
        </div>

        <h3 className="text-3xl font-hand text-slate-800 mb-8 font-bold leading-relaxed">
          {question.question}
        </h3>

        <div className="flex flex-col gap-4 mb-8">
          {(question.options || []).map(opt => {
            const isSelected = selectedOption === opt;
            const isCorrect = String(question.correctAnswer) === opt;
            
            let btnClass = "bg-white text-slate-700 hover:bg-slate-50";
            if (showResult) {
              if (isCorrect) btnClass = "bg-green-300 border-green-600 text-green-900";
              else if (isSelected && !isCorrect) btnClass = "bg-red-300 border-red-600 text-red-900";
              else btnClass = "bg-white opacity-50";
            } else if (isSelected) {
              btnClass = "bg-sky-200 border-sky-600 text-sky-900 shadow-[4px_4px_0_#0284c7]";
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={showResult}
                className={`font-chunky text-xl text-left p-4 border-4 border-slate-800 rounded-2xl transition-all shadow-[2px_2px_0_#1e293b] active:translate-y-1 active:shadow-none ${btnClass}`}
              >
                {opt}
                {showResult && isCorrect && <CheckCircle2 className="inline float-right" />}
                {showResult && isSelected && !isCorrect && <XCircle className="inline float-right" />}
              </button>
            );
          })}
        </div>

        {showResult && question.explanation && (
          <div className="mb-8 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl font-hand text-xl text-slate-800">
            💡 <strong>Explanation:</strong> {question.explanation}
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <DoodleButton onClick={handleCheck} disabled={!selectedOption} color="bg-yellow-300 text-slate-800">
              Check Answer
            </DoodleButton>
          ) : (
            <DoodleButton onClick={handleNext} color="bg-pink-400 text-white">
              {currentIdx < config.questions.length - 1 ? 'Next Question ➡️' : 'Finish 🏁'}
            </DoodleButton>
          )}
        </div>
      </DoodleCard>
    </div>
  );
};
