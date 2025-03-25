import React from 'react';
import { Box } from '@mui/material';

export const GlowEffect: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-5px',
          left: '-5px',
          right: '-5px',
          bottom: '-5px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
          filter: 'blur(8px)',
          zIndex: -1,
          animation: 'pulse 2s infinite',
        },
        '@keyframes pulse': {
          '0%': { opacity: 0.6 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.6 }
        }
      }}
    >
      {children}
    </Box>
  );
};
