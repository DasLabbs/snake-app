import { useEffect, useState } from 'react';
import { useGameStore } from '@src/stores/game';

export const useLifeCountdown = () => {
  const [countdown, setCountdown] = useState<string>('');
  const { lastLifeRegeneration, lives, setLives, setLastLifeRegeneration } = useGameStore();

  useEffect(() => {
    // Only show countdown if not at max lives (6)
    if (lives >= 6) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const timePassed = now - lastLifeRegeneration; // 30 minutes in milliseconds
      const REGEN_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds
      const timeLeft = REGEN_TIME - timePassed;

      // Check if regeneration is complete
      if (timeLeft <= 0) {
        // Add a life and reset timer
        if (lives < 6) {
          setLives(lives + 1);
          setLastLifeRegeneration(Date.now());
        }
        setCountdown('');
        return;
      }

      // Convert to minutes and seconds
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      // Format with leading zeros
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setCountdown(formattedTime);
    };

    // Update immediately and then every second
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [lastLifeRegeneration, lives, setLives, setLastLifeRegeneration]);

  return countdown;
};
