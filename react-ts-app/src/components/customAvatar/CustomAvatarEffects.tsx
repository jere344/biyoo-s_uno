import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
// import * as THREE from 'three';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';

// Main function to apply effects based on profile_effect value
export const applyAvatarEffect = (
  avatarElement: React.ReactNode,
  effectType?: string,
  isHovered: boolean = false,
  size: number = 40
) => {
  switch (effectType) {
    case 'fire':
      return <FireEffect size={size}>{avatarElement}</FireEffect>;
    case 'rainbow':
      return <RainbowBorderEffect size={size}>{avatarElement}</RainbowBorderEffect>;
    case 'pulse':
      return <PulseEffect>{avatarElement}</PulseEffect>;
    case 'rotate':
      return <RotateEffect>{avatarElement}</RotateEffect>;
    case 'glow':
      return <GlowEffect color="#00ff00">{avatarElement}</GlowEffect>;
    case 'particles':
      return <ParticleEffect size={size}>{avatarElement}</ParticleEffect>;
    case 'shadow':
      return <ShadowEffect>{avatarElement}</ShadowEffect>;
    case 'bounce':
      return <BounceEffect>{avatarElement}</BounceEffect>;
    case 'ripple':
      return <RippleEffect>{avatarElement}</RippleEffect>;
    default:
      return avatarElement;
  }
};

// Individual effect components
const FireEffect: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      <Box
        className="fire-effect"
        sx={{
          position: 'absolute',
          width: size * 1.3,
          height: size * 1.3,
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
          background: 'radial-gradient(circle, rgba(255,59,0,0.6) 0%, rgba(255,0,0,0) 70%)',
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,165,0,0.6) 0%, rgba(255,0,0,0) 70%)',
            filter: 'blur(8px)',
            animation: 'fire 2s infinite alternate',
          },
          '@keyframes fire': {
            '0%': { transform: 'scale(0.9) rotate(0deg)', opacity: 0.8 },
            '100%': { transform: 'scale(1.1) rotate(10deg)', opacity: 0.9 }
          }
        }}
      />
    </Box>
  );
};

const RainbowBorderEffect: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => {
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

const PulseEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  );
};

const RotateEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

const GlowEffect: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => {
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


const ParticleEffect: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const particleCount = 20;
    const container = containerRef.current;
    if (!container) return;
    
    const particles: HTMLDivElement[] = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.top = '0px';
      particle.style.left = '0px';
      particle.style.width = '5px';
      particle.style.height = '5px';
      particle.style.borderRadius = '50%';
      particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
      particle.style.opacity = '0';
      particle.style.transform = `translate(${size/2}px, ${size/2}px)`;
      container.appendChild(particle);
      particles.push(particle);
      
      animateParticle(particle, size);
    }
    
    return () => {
      particles.forEach(particle => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      });
    };
  }, [size]);
  
  function animateParticle(particle: HTMLDivElement, size: number) {
    const angle = Math.random() * Math.PI * 2;
    const distance = size/2 + Math.random() * 10;
    const duration = 1000 + Math.random() * 2000;
    
    const keyframes = [
      { 
        opacity: 0,
        transform: `translate(${size/2}px, ${size/2}px)`
      },
      { 
        opacity: 0.8,
        transform: `translate(${size/2 + Math.cos(angle) * distance/2}px, ${size/2 + Math.sin(angle) * distance/2}px)`
      },
      { 
        opacity: 0,
        transform: `translate(${size/2 + Math.cos(angle) * distance}px, ${size/2 + Math.sin(angle) * distance}px)`
      }
    ];
    
    particle.animate(keyframes, {
      duration,
      iterations: Infinity,
      delay: Math.random() * 1000
    });
  }
  
  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: size, height: size }}>
      {children}
    </Box>
  );
};

const ShadowEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

const BounceEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

const RippleEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
