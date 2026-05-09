import React from 'react';
import { MoveRecord } from '../game/types';

interface MoveHistoryProps {
  history: MoveRecord[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const formatCell = (c: {row: number, col: number}) => `(${c.row},${c.col})`;
  
  return (
    <div className="history-panel">
      <h3>Historique</h3>
      <ul className="history-list">
        {history.length === 0 ? <li className="history-item" style={{color: '#8E8E8E'}}>Aucun coup joué</li> : null}
        {history.map((record, index) => (
          <li key={index} className="history-item">
             <span style={{ color: '#8E8E8E', width: '20px' }}>{index + 1}.</span>
             <span style={{ fontWeight: 'bold', width: '20px', color: record.player === 'A' ? '#C05640' : '#5A5A40' }}>{record.player}</span>
             <span style={{ flex: 1 }}>
               {record.pieceType === 'pawn' ? 'Pion' : 'Dame'} : {formatCell(record.from)} &rarr; {formatCell(record.to)}
               {record.type === 'capture' ? ' ⚔️' : ''}
               {record.promoted ? ' ♛' : ''}
             </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
