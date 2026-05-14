import React from 'react';
import { motion } from 'framer-motion';
import { Piece as PieceType } from '../game/types';

interface PieceProps {
  piece: PieceType;
}

export const Piece: React.FC<PieceProps> = ({ piece }) => {
  return (
    <motion.div 
      layoutId={piece.id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
      style={{ zIndex: 10, position: 'relative' }}
      className={`piece player-${piece.player}`}
    >
      {piece.type === 'queen' ? (
        <motion.span 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="crown"
        >
          ♛
        </motion.span>
      ) : null}
    </motion.div>
  );
};
