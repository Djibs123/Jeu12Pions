import React from 'react';
import { Board as BoardType, Cell as CellType, Move } from '../game/types';
import { Cell } from './Cell';
import { isSameCell } from '../game/rules';

interface BoardProps {
  board: BoardType;
  selectedCell: CellType | null;
  legalMoves: Move[];
  onCellClick: (cell: CellType) => void;
}

export const Board: React.FC<BoardProps> = ({ board, selectedCell, legalMoves, onCellClick }) => {
  return (
    <div className="board" id="game-board">
      {board.map((row, rIndex) =>
        row.map((piece, cIndex) => {
          const cell = { row: rIndex, col: cIndex };
          const isSelected = selectedCell ? isSameCell(selectedCell, cell) : false;
          
          const move = legalMoves.find(m => isSameCell(m.to, cell));
          const isHighlight = !!move;
          const isCaptureHighlight = move ? move.type === 'capture' : false;

          return (
            <Cell
              key={`${rIndex}-${cIndex}`}
              cell={cell}
              piece={piece}
              isSelected={isSelected}
              isHighlight={isHighlight}
              isCaptureHighlight={isCaptureHighlight}
              onClick={() => onCellClick(cell)}
            />
          );
        })
      )}
    </div>
  );
};
