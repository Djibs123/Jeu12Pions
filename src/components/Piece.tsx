import React from 'react';
import { Piece as PieceType } from '../game/types';

interface PieceProps {
  piece: PieceType;
}

export const Piece: React.FC<PieceProps> = ({ piece }) => {
  return (
    <div className={`piece player-${piece.player}`}>
      {piece.type === 'queen' ? <span className="crown">♛</span> : null}
    </div>
  );
};
