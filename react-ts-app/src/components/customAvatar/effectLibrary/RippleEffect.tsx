import React from 'react';
import { Box } from '@mui/material';

export const RippleEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid #3f51b5',
            opacity: 0,
            animation: `ripple 2s ease-out ${i * 0.6}s infinite`
          }}
        />
      ))}
      <style>
        {`
          @keyframes ripple {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.5;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        `}
      </style>
    </Box>
  );
};
