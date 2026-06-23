import React from 'react';
import { GridWorld } from '../mini-games/GridWorld';
import { useGame } from '../../context/GameContext';

export const Level4: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { unlockBadge } = useGame();

  const handleComplete = () => {
    unlockBadge('robot_trainer');
    onComplete();
  };

  return (
    <GridWorld 
      title="Human vs Computer" 
      desc="A human would just walk straight to the star. A computer needs exact steps. Write them!"
      gridSize={5} 
      startPos={{x: 0, y: 4}} 
      endPos={{x: 4, y: 0}} 
      obstacles={[{x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4}]}
      initialDir={1}
      onComplete={handleComplete} 
    />
  );
};
