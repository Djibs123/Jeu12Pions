import React, { ReactNode, useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { gameAudio } from '../game/audio';

interface ModeLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerMessage: string;
  onBack: () => void;
  headerContent?: ReactNode;
}

export const ModeLayout: React.FC<ModeLayoutProps> = ({ 
  title, 
  subtitle, 
  children, 
  footerMessage, 
  onBack,
  headerContent
}) => {
  const [soundEnabled, setSoundEnabled] = useState(gameAudio.isEnabled);

  const toggleSound = () => {
    setSoundEnabled(gameAudio.toggle());
  };

  return (
    <div className="game-container">
      <header className="header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack} title="Retour au menu">
            <ArrowLeft size={16} />
            <span className="hide-on-mobile">Retour</span>
          </button>
          <div className="header-title">
            <h1>{title}</h1>
            <span className="subtitle">{subtitle}</span>
          </div>
        </div>
        
        <div className="header-right">
          {headerContent}
          <button 
            className="back-btn" 
            onClick={toggleSound} 
            title={soundEnabled ? "Désactiver le son" : "Activer le son"}
            style={{ marginLeft: '12px', padding: '6px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>{footerMessage}</p>
      </footer>
    </div>
  );
};
