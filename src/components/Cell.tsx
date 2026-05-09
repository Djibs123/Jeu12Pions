import React from 'react';
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

export const Cell: React.FC<CellProps> = ({ cell, piece, isSelected, isHighlight, isCaptureHighlight, onClick }) => {
  const isDark = (cell.row + cell.col) % 2 === 1;
  const isCenter = cell.row === 2 && cell.col === 2;
  
  let className = `cell ${isDark ? 'dark' : ''}`;
  if (isCenter) className += ' center-cell';
  if (isSelected) className += ' selected';
  if (isCaptureHighlight) className += ' highlight capture';
  else if (isHighlight) className += ' highlight';

  return (
    <div className={className} id={`cell-${cell.row}-${cell.col}`} onClick={onClick}>
      {piece && <Piece piece={piece} />}
    </div>
  );
};
