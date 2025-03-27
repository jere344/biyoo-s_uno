import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, IconButton, Paper } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import { useUnoGame } from '@hooks/useUnoGame';

interface SoundSettingsProps {
  open: boolean;
  onClose: () => void;
}

const SoundSettings: React.FC<SoundSettingsProps> = ({ open, onClose }) => {
  const { soundManager } = useUnoGame();
  const [musicVolume, setMusicVolume] = useState<number>(soundManager.getMusicVolume() * 100);
  const [effectsVolume, setEffectsVolume] = useState<number>(soundManager.getSoundEffectsVolume() * 100);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(soundManager.isMusicOn());

  // Load saved settings on component mount
  useEffect(() => {
    const savedMusicVolume = localStorage.getItem('musicVolume');
    const savedEffectsVolume = localStorage.getItem('effectsVolume');
    const savedMusicOn = localStorage.getItem('isMusicOn');
    
    if (savedMusicVolume !== null) {
      const volume = parseFloat(savedMusicVolume);
      setMusicVolume(volume * 100);
      soundManager.setMusicVolume(volume);
    }
    
    if (savedEffectsVolume !== null) {
      const volume = parseFloat(savedEffectsVolume);
      setEffectsVolume(volume * 100);
      soundManager.setSoundEffectsVolume(volume);
    }
    
    if (savedMusicOn !== null) {
      const musicOn = savedMusicOn === 'true';
      setIsMusicOn(musicOn);
      if (musicOn !== soundManager.isMusicOn()) {
        soundManager.toggleMusic();
      }
    }
  }, [soundManager]);

  // Update the component state when the SoundManager changes
  useEffect(() => {
    setMusicVolume(soundManager.getMusicVolume() * 100);
    setEffectsVolume(soundManager.getSoundEffectsVolume() * 100);
    setIsMusicOn(soundManager.isMusicOn());
  }, [soundManager]);

  // Handle music volume change
  const handleMusicVolumeChange = (_event: Event, newValue: number | number[]) => {
    const volume = Array.isArray(newValue) ? newValue[0] : newValue;
    setMusicVolume(volume);
    const normalizedVolume = volume / 100;
    soundManager.setMusicVolume(normalizedVolume);
    localStorage.setItem('musicVolume', normalizedVolume.toString());
  };

  // Handle effects volume change
  const handleEffectsVolumeChange = (_event: Event, newValue: number | number[]) => {
    const volume = Array.isArray(newValue) ? newValue[0] : newValue;
    setEffectsVolume(volume);
    const normalizedVolume = volume / 100;
    soundManager.setSoundEffectsVolume(normalizedVolume);
    localStorage.setItem('effectsVolume', normalizedVolume.toString());
  };

  // Toggle music playback
  const toggleMusic = () => {
    soundManager.toggleMusic();
    const newMusicState = soundManager.isMusicOn();
    setIsMusicOn(newMusicState);
    localStorage.setItem('isMusicOn', newMusicState.toString());
  };

  // Play a test sound effect
  const playTestSound = () => {
    soundManager.playSoundEffect('cardPlay');
  };

  if (!open) return null;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'absolute', 
        bottom: '10px', 
        right: '10px', 
        zIndex: 100, 
        p: 2, 
        width: '300px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Sound Settings
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={toggleMusic} sx={{ mr: 1 }}>
          {isMusicOn ? <MusicNoteIcon /> : <MusicOffIcon />}
        </IconButton>
        <Typography sx={{ width: '80px' }}>Music:</Typography>
        <Slider
          value={musicVolume}
          onChange={handleMusicVolumeChange}
          aria-labelledby="music-volume-slider"
          sx={{ flex: 1, ml: 1 }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={playTestSound} sx={{ mr: 1 }}>
          {effectsVolume > 0 ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
        <Typography sx={{ width: '80px' }}>Effects:</Typography>
        <Slider
          value={effectsVolume}
          onChange={handleEffectsVolumeChange}
          aria-labelledby="effects-volume-slider"
          sx={{ flex: 1, ml: 1 }}
        />
      </Box>
    </Paper>
  );
};

export default SoundSettings;
