import React from 'react';
import { Box, keyframes } from '@mui/material';
import { styled } from '@mui/system';

// Keyframes for the fire animation
const flameAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
  25% { transform: scale(1.1) rotate(2deg); opacity: 0.9; }
  50% { transform: scale(1) rotate(-1deg); opacity: 1; }
  75% { transform: scale(1.2) rotate(1deg); opacity: 0.9; }
  100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
`;

// Styled container with the fire effect
const FireContainer = styled(Box)(({ size }: { size: number }) => ({
  position: 'relative',
  width: size,
  height: size,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse at center, rgba(255,140,0,0.5) 0%, rgba(255,69,0,0.5) 40%, rgba(255,0,0,0.5) 60%, rgba(255,0,0,0) 70%)',
    top: '-10%',
    left: '-10%',
    zIndex: -1,
    animation: `${flameAnimation} 3s infinite alternate`,
  },
  
  '&::after': {
    width: '140%',
    height: '140%',
    background: 'radial-gradient(ellipse at center, rgba(255,69,0,0.5) 0%, rgba(255,0,0,0.5) 40%, rgba(255,0,0,0) 60%)',
    top: '-20%',
    left: '-20%',
    animation: `${flameAnimation} 4s infinite alternate-reverse`,
  }
}));

// Multiple flame elements for a more dynamic effect
const FlameElement = styled(Box)((props: { delay: number, size: number, position: { top: string, left: string } }) => ({
  position: 'absolute',
  width: `${props.size}%`,
  height: `${props.size}%`,
  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
  background: 'linear-gradient(to top, #ff3d00, #ffab00)',
  top: props.position.top,
  left: props.position.left,
  filter: 'blur(5px)',
  opacity: 0.7,
  zIndex: 0,
  animation: `${flameAnimation} ${2 + props.delay}s infinite alternate`,
  transform: 'rotate(-45deg)',
}));

export const FireEffect: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => {
  return (
    <FireContainer size={size}>
      {/* The actual avatar */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
      }}>
        {children}
      </Box>
      
      {/* Individual flame elements */}
      <FlameElement delay={0} size={40} position={{ top: '-15%', left: '30%' }} />
      <FlameElement delay={0.2} size={50} position={{ top: '-10%', left: '10%' }} />
      <FlameElement delay={0.5} size={45} position={{ top: '10%', left: '-15%' }} />
      <FlameElement delay={0.7} size={60} position={{ top: '30%', left: '-10%' }} />
      <FlameElement delay={0.3} size={50} position={{ top: '60%', left: '0%' }} />
      <FlameElement delay={0.6} size={45} position={{ top: '70%', left: '30%' }} />
      <FlameElement delay={0.1} size={55} position={{ top: '60%', left: '70%' }} />
      <FlameElement delay={0.4} size={40} position={{ top: '30%', left: '80%' }} />
      <FlameElement delay={0.8} size={50} position={{ top: '0%', left: '70%' }} />
    </FireContainer>
  );
};
