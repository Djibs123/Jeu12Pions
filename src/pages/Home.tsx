import React from 'react';
import { motion } from 'framer-motion';
import '../styles/home.css';

interface HomeProps {
  onSelectMode: (mode: 'local' | 'ai' | 'online') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export const Home: React.FC<HomeProps> = ({ onSelectMode }) => {
  return (
    <div className="home-container">
      <motion.div 
        className="home-content"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <header className="home-header">
          <motion.h1 variants={itemVariants}>12 Pions</motion.h1>
          <motion.p variants={itemVariants} className="home-subtitle">Jeu de stratégie 5x5 sans diagonales</motion.p>
        </header>

        <div className="menu-buttons">
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="menu-btn" 
            onClick={() => onSelectMode('local')}
          >
            <span className="btn-title">Jouer en local</span>
            <span className="btn-desc">2 joueurs sur le même écran</span>
          </motion.button>
          
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="menu-btn" 
            onClick={() => onSelectMode('ai')}
          >
            <span className="btn-title">Jouer contre l'IA</span>
            <span className="btn-desc">Idéal pour s'entraîner</span>
          </motion.button>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="menu-btn online-btn" 
            onClick={() => onSelectMode('online')}
          >
            <span className="btn-title">Jouer en ligne</span>
            <span className="btn-desc">Défier un ami à distance</span>
          </motion.button>
        </div>

        <motion.div variants={itemVariants} className="quick-rules">
          <h3>Règles rapides :</h3>
          <ul>
            <li>Aucun déplacement ni capture en diagonale.</li>
            <li>Les captures sont toujours facultatives.</li>
            <li>Atteignez la ligne adverse pour promouvoir en Dame.</li>
            <li>Le joueur qui n'a plus de mouvements légaux perd.</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

