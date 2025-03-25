import React from 'react';
import { motion } from 'framer-motion';

export const BounceEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0]
      }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  );
};
