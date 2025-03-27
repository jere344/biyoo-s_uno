// Define the audio paths for a theme
export interface ThemeAudioPaths {
  music: string;
  effects: {
    cardDraw: string;
    cardPlay: string;
    sayUno: string;
    denyUno: string;
    gameStart: string;
    gameEnd: string;
    skipCard: string;
    reverseCard: string;
    // Add more effects as needed
  };
}

// Sound effect type for type safety
export type SoundEffectType = keyof ThemeAudioPaths['effects'];

export class SoundManager {
  private musicAudio: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private currentTheme: string = 'default';
  private isMusicPlaying: boolean = false;
  private musicVolume: number = 0.5; // Default music volume
  private effectsVolume: number = 0.7; // Default sound effects volume
  private themes: Record<string, ThemeAudioPaths> = {
    default: {
      music: '/audio/default/uppbeat.io-getting-it-done-kevin-macleod-main-version-7982-03-25.mp3',
      effects: {
        cardDraw: '/audio/default/zapsplat_card_draw.mp3',
        cardPlay: '/audio/default/zapsplat_card_play.mp3',
        sayUno: '/audio/default/zhiyu_say_uno.mp3',
        denyUno: '/audio/default/zapsplat_deny_uno.mp3',
        gameStart: '',
        gameEnd: '/audio/default/zapsplat_applause.mp3',
        skipCard: '/audio/default/zapsplat_skip.mp3',
        reverseCard: '/audio/default/zapsplat_reverse.mp3',
      }
    },
    // Other themes can be added here
  };
  
  constructor() {
    // Preload the default theme sounds
    this.preloadSounds(this.currentTheme);
  }
  
  // Play background music
  playMusic(): void {
    if (!this.musicAudio) {
      this.musicAudio = new Audio(this.themes[this.currentTheme].music);
      this.musicAudio.loop = true;
      this.musicAudio.volume = this.musicVolume;
    }
    
    this.musicAudio.play().catch(e => console.error("Error playing music:", e));
    this.isMusicPlaying = true;
  }
  
  // Pause background music without resetting position
  pauseMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.isMusicPlaying = false;
    }
  }
  
  // Stop background music and reset to beginning
  stopMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
      this.isMusicPlaying = false;
    }
  }
  
  // Toggle music playback
  toggleMusic(): void {
    if (this.isMusicPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
  }
  
  // Play a sound effect
  playSoundEffect(effectName: SoundEffectType): void {
    const effect = this.soundEffects.get(effectName);
    if (effect) {
      // Create a clone to allow overlapping sounds
      const soundToPlay = effect.cloneNode(true) as HTMLAudioElement;
      soundToPlay.volume = this.effectsVolume;
      soundToPlay.play().catch(e => console.error(`Error playing ${effectName}:`, e));
    } else {
      console.warn(`Sound effect ${effectName} not found`);
    }
  }
  
  // Change the audio theme
  setTheme(themeName: string): void {
    if (this.themes[themeName]) {
      const wasPlaying = this.isMusicPlaying;
      this.currentTheme = themeName;
      
      // Stop current music if playing
      this.stopMusic();
      this.musicAudio = null;
      
      // Clear current sound effects
      this.soundEffects.clear();
      
      // Preload sounds for the new theme
      this.preloadSounds(themeName);
      
      // Resume music if it was playing
      if (wasPlaying) {
        this.playMusic();
      }
    } else {
      console.warn(`Theme ${themeName} not found`);
    }
  }
  
  // Preload all sound effects for a theme
  private preloadSounds(themeName: string): void {
    const theme = this.themes[themeName];
    if (!theme) return;
    
    // Preload all sound effects
    Object.entries(theme.effects).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = this.effectsVolume;
      this.soundEffects.set(key, audio);
    });
  }
  
  // Add a new theme
  addTheme(name: string, themePaths: ThemeAudioPaths): void {
    this.themes[name] = themePaths;
  }
  
  // Get current theme name
  getCurrentTheme(): string {
    return this.currentTheme;
  }
  
  // Check if music is playing
  isMusicOn(): boolean {
    return this.isMusicPlaying;
  }
  
  // Get available themes
  getAvailableThemes(): string[] {
    return Object.keys(this.themes);
  }
  
  // Set music volume (0-1)
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicAudio) {
      this.musicAudio.volume = this.musicVolume;
    }
  }
  
  // Set sound effects volume (0-1)
  setSoundEffectsVolume(volume: number): void {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
    
    // Update volume for all preloaded sound effects
    this.soundEffects.forEach(audio => {
      audio.volume = this.effectsVolume;
    });
  }
  
  // Get current music volume
  getMusicVolume(): number {
    return this.musicVolume;
  }
  
  // Get current sound effects volume
  getSoundEffectsVolume(): number {
    return this.effectsVolume;
  }
}
