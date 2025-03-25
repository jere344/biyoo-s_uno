import React from 'react';
import { motion } from 'framer-motion';

export const ShadowEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0px 0px 4px 2px rgba(0, 0, 255, 0.5)',
          '0px 0px 8px 4px rgba(255, 0, 0, 0.5)',
          '0px 0px 4px 2px rgba(0, 255, 0, 0.5)',
          '0px 0px 8px 4px rgba(0, 0, 255, 0.5)'
        ]
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      style={{
        borderRadius: '50%',
        display: 'inline-block'
      }}
    >
      {children}
    </motion.div>
  );
};
