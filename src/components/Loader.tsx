import React from 'react';
import { motion } from 'framer-motion';

// Icon SVGs for each loader type
const icons = {
  home: (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: [0.8, 1.1, 1] }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    >
      <motion.circle cx="24" cy="24" r="20" stroke="#4a90e2" strokeWidth="4" />
      <motion.text x="24" y="30" textAnchor="middle" fontSize="18" fill="#4a90e2" fontFamily="inherit">📝</motion.text>
    </motion.svg>
  ),
  journal: (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    >
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#fff" stroke="#4a90e2" strokeWidth="3" />
      <motion.line x1="16" y1="16" x2="32" y2="16" stroke="#4a90e2" strokeWidth="2" />
      <motion.line x1="16" y1="24" x2="32" y2="24" stroke="#4a90e2" strokeWidth="2" />
      <motion.line x1="16" y1="32" x2="28" y2="32" stroke="#4a90e2" strokeWidth="2" />
    </motion.svg>
  ),
  entry: (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      initial={{ y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    >
      <rect x="10" y="10" width="28" height="28" rx="5" fill="#fff" stroke="#4a90e2" strokeWidth="3" />
      <motion.path d="M18 28 Q24 22 30 28" stroke="#4a90e2" strokeWidth="2" fill="none" />
      <motion.circle cx="24" cy="20" r="2" fill="#4a90e2" />
    </motion.svg>
  ),
  edit: (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      initial={{ x: 0 }}
      animate={{ x: [0, 4, -4, 0] }}
      transition={{ duration: 0.7, repeat: Infinity }}
    >
      <rect x="10" y="10" width="28" height="28" rx="5" fill="#fff" stroke="#4a90e2" strokeWidth="3" />
      <motion.rect x="18" y="28" width="12" height="2" fill="#4a90e2" />
      <motion.rect x="22" y="16" width="4" height="10" fill="#4a90e2" />
    </motion.svg>
  ),
  new: (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 0.7, repeat: Infinity }}
    >
      <rect x="10" y="10" width="28" height="28" rx="5" fill="#fff" stroke="#4a90e2" strokeWidth="3" />
      <motion.line x1="24" y1="16" x2="24" y2="32" stroke="#4a90e2" strokeWidth="2" />
      <motion.line x1="16" y1="24" x2="32" y2="24" stroke="#4a90e2" strokeWidth="2" />
    </motion.svg>
  ),
  auth: (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="24" cy="24" r="20" stroke="#4a90e2" strokeWidth="4" />
      <motion.circle cx="24" cy="24" r="12" stroke="#4a90e2" strokeWidth="2" strokeDasharray="20 20" />
      <motion.text x="24" y="29" textAnchor="middle" fontSize="18" fill="#4a90e2" fontFamily="inherit">🔒</motion.text>
    </motion.svg>
  ),
  settings: (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="24" cy="24" r="20" stroke="#4a90e2" strokeWidth="4" />
      <motion.circle cx="24" cy="24" r="10" stroke="#4a90e2" strokeWidth="2" />
      <motion.text x="24" y="29" textAnchor="middle" fontSize="18" fill="#4a90e2" fontFamily="inherit">⚙️</motion.text>
    </motion.svg>
  ),
  profile: (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <circle cx="24" cy="18" r="8" fill="#4a90e2" />
      <ellipse cx="24" cy="34" rx="12" ry="6" fill="#4a90e2" opacity="0.2" />
    </motion.svg>
  ),
  help: (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      initial={{ y: 0 }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    >
      <circle cx="24" cy="24" r="20" stroke="#4a90e2" strokeWidth="4" />
      <motion.text x="24" y="30" textAnchor="middle" fontSize="22" fill="#4a90e2" fontFamily="inherit">?</motion.text>
    </motion.svg>
  ),
};

export type LoaderPage = keyof typeof icons;

interface LoaderProps {
  page: LoaderPage;
  label?: string;
}

const Loader: React.FC<LoaderProps> = ({ page, label }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
      {icons[page]}
      <span style={{ marginTop: 16, color: 'var(--muted-text)', fontSize: 16, fontWeight: 500 }}>
        {label || 'Loading...'}
      </span>
    </div>
  );
};

export default Loader; 