import React, { useState } from 'react';
import { Home } from './pages/Home';
import { LocalGame } from './pages/LocalGame';
import { AIGame } from './pages/AIGame';
import { OnlineGame } from './pages/OnlineGame';

import './styles/global.css';
import './styles/board.css';
import './styles/game.css';
import './styles/home.css';

type AppMode = 'home' | 'local' | 'ai' | 'online';

export default function App() {
  const [mode, setMode] = useState<AppMode>('home');

  const goToMenu = () => setMode('home');

  switch (mode) {
    case 'local':
      return <LocalGame onBackToMenu={goToMenu} />;
    case 'ai':
      return <AIGame onBackToMenu={goToMenu} />;
    case 'online':
      return <OnlineGame onBackToMenu={goToMenu} />;
    case 'home':
    default:
      return <Home onSelectMode={setMode} />;
  }
}

