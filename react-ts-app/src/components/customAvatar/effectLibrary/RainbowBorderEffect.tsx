import React from 'react';
import { Box } from '@mui/material';

export const RainbowBorderEffect: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: size + 10,
        height: size + 10,
        borderRadius: '50%',
        background: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
        animation: 'spin 3s linear infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '@keyframes spin': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' }
        }
      }}
    >
      {children}
    </Box>
  );
};
