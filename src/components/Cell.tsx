import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cell as CellType, Piece as PieceType } from '../game/types';
import { Piece } from './Piece';

interface CellProps {
  cell: CellType;
  piece: PieceType | null;
  isSelected: boolean;
  isHighlight: boolean;
  isCaptureHighlight: boolean;
  onClick: () => void;
}

const cellVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
};

export const Cell: React.FC<CellProps> = ({ cell, piece, isSelected, isHighlight, isCaptureHighlight, onClick }) => {
  const isDark = (cell.row + cell.col) % 2 === 1;
  const isCenter = cell.row === 2 && cell.col === 2;
  
  let className = `cell ${isDark ? 'dark' : ''}`;
  if (isCenter) className += ' center-cell';
  if (isSelected) className += ' selected';
  if (isCaptureHighlight) className += ' highlight capture';
  else if (isHighlight) className += ' highlight';

  return (
    <motion.div 
      className={className} 
      id={`cell-${cell.row}-${cell.col}`} 
      onClick={onClick}
      variants={cellVariants}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {piece && <Piece key={piece.id} piece={piece} />}
      </AnimatePresence>
    </motion.div>
  );
};
