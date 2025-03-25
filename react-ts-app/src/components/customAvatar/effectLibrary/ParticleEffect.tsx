import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';

export const ParticleEffect: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => {
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
