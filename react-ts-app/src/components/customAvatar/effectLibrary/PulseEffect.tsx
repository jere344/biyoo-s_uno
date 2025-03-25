import React from 'react';
import { motion } from 'framer-motion';

export const PulseEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [1, 0.9, 1]
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  );
};
