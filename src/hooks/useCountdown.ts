import { useState, useEffect } from 'react';
import type { TimeRemaining } from '../types';
import { calculateTimeRemaining } from '../utils/countdown';

export function useCountdown(targetDate: Date): TimeRemaining {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetDate)
  );

  useEffect(() => {
    // Update immediately when targetDate changes
    setTimeRemaining(calculateTimeRemaining(targetDate));

    // Set up interval to update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeRemaining;
}
