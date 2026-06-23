import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserData } from '../types';

interface GameContextType extends UserData {
  addXP: (amount: number) => void;
  setLevel: (level: number) => void;
  unlockBadge: (badgeId: string) => void;
  saveQuizScore: (levelId: number, score: number) => void;
  resetProgress: () => void;
}

const defaultState: UserData = {
  xp: 0,
  level: 0, // 0 = Intro
  unlockedBadges: [],
  quizScores: {},
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<UserData>(() => {
    try {
      const saved = localStorage.getItem('codeQuestData');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load save data', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem('codeQuestData', JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save data', e);
    }
  }, [data]);

  const addXP = (amount: number) => {
    setData(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const setLevel = (level: number) => {
    setData(prev => ({ ...prev, level }));
  };

  const unlockBadge = (badgeId: string) => {
    setData(prev => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      return { ...prev, unlockedBadges: [...prev.unlockedBadges, badgeId] };
    });
  };

  const saveQuizScore = (levelId: number, score: number) => {
    setData(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [levelId]: score }
    }));
  };

  const resetProgress = () => {
    setData(defaultState);
  };

  return (
    <GameContext.Provider value={{ ...data, addXP, setLevel, unlockBadge, saveQuizScore, resetProgress }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
