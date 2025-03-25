import React from 'react';
import { motion } from 'framer-motion';

export const RotateEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      animate={{
        rotate: 360
      }}
      transition={{
        duration: 8,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  );
};
