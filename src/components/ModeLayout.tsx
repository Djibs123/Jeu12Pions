import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

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
        
        {headerContent && (
          <div className="header-right">
             {headerContent}
          </div>
        )}
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
