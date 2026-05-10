import React from 'react';
import '../styles/home.css';

interface HomeProps {
  onSelectMode: (mode: 'local' | 'ai' | 'online') => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectMode }) => {
  return (
    <div className="home-container">
      <div className="home-content">
        <header className="home-header">
          <h1>12 Pions</h1>
          <p className="home-subtitle">Jeu de stratégie 5x5 sans diagonales</p>
        </header>

        <div className="menu-buttons">
          <button className="menu-btn" onClick={() => onSelectMode('local')}>
            <span className="btn-title">Jouer en local</span>
            <span className="btn-desc">2 joueurs sur le même écran</span>
          </button>
          
          <button className="menu-btn" onClick={() => onSelectMode('ai')}>
            <span className="btn-title">Jouer contre l'IA</span>
            <span className="btn-desc">Idéal pour s'entraîner</span>
          </button>

          <button className="menu-btn online-btn" onClick={() => onSelectMode('online')}>
            <span className="btn-title">Jouer en ligne</span>
            <span className="btn-desc">Défier un ami à distance</span>
          </button>
        </div>

        <div className="quick-rules">
          <h3>Règles rapides :</h3>
          <ul>
            <li>Aucun déplacement ni capture en diagonale.</li>
            <li>Les captures sont toujours facultatives.</li>
            <li>Atteignez la ligne adverse pour promouvoir en Dame.</li>
            <li>Le joueur qui n'a plus de mouvements légaux perd.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
