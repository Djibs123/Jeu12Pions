import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveRecord } from '../game/types';

interface MoveHistoryProps {
  history: MoveRecord[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const formatCell = (c: {row: number, col: number}) => `(${c.row},${c.col})`;
  
  const recentHistory = history.slice(-5);
  const startIndex = Math.max(0, history.length - 5);
  
  return (
    <div className="history-panel">
      <h3>Historique</h3>
      <ul className="history-list">
        <AnimatePresence initial={false} mode="popLayout">
          {history.length === 0 ? <li className="history-item" style={{color: '#8E8E8E'}}>Aucun coup joué</li> : null}
          {recentHistory.map((record, index) => {
            const absoluteIndex = startIndex + index;
            return (
              <motion.li 
                layout
                key={absoluteIndex} 
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="history-item"
              >
                <span style={{ color: '#8E8E8E', width: '24px' }}>{absoluteIndex + 1}.</span>
                <span style={{ fontWeight: 'bold', width: '24px', color: record.player === 'A' ? '#C05640' : '#5A5A40' }}>{record.player}</span>
                <span style={{ flex: 1 }}>
                  {record.pieceType === 'pawn' ? 'Pion' : 'Dame'} : {formatCell(record.from)} &rarr; {formatCell(record.to)}
                  {record.type === 'capture' ? ' ⚔️' : ''}
                  {record.promoted ? ' ♛' : ''}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};

