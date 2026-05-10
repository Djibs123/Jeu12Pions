import React from 'react';
import { ModeLayout } from '../components/ModeLayout';

interface OnlineGameProps {
  onBackToMenu: () => void;
}

export const OnlineGame: React.FC<OnlineGameProps> = ({ onBackToMenu }) => {
  return (
    <ModeLayout
      title="12 Pions"
      subtitle="Mode En Ligne"
      footerMessage="Bientôt disponible avec Firebase"
      onBack={onBackToMenu}
    >
      <div className="online-setup-container">
        <h2>Créer ou rejoindre une partie</h2>
        
        <div className="online-forms">
          <div className="online-card">
            <h3>Joueur</h3>
            <div className="input-group">
              <label>Votre pseudo</label>
              <input type="text" placeholder="Ex: Maître Pions" />
            </div>
          </div>

          <div className="online-card">
            <h3>Créer une partie</h3>
            <p>Hébergez une nouvelle partie et invitez un ami.</p>
            <button className="primary-btn mt-2">Créer une partie</button>
          </div>

          <div className="online-card">
            <h3>Rejoindre une partie</h3>
            <div className="input-group">
              <label>Code de partie</label>
              <input type="text" placeholder="Ex: A1B2C" />
            </div>
            <button className="primary-btn mt-2">Rejoindre</button>
          </div>
        </div>
        
        <div className="instruction-box mt-8 text-center max-w-md mx-auto">
          <p>Le mode en ligne sera connecté avec Firebase Realtime Database ou Firestore dans la prochaine étape.</p>
        </div>
      </div>
    </ModeLayout>
  );
};
