"use client";

import { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';

export function WorkoutTimer() {
  const { state } = useWorkout();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isActive && !state.isPaused && state.currentSession?.startTime) {
      interval = setInterval(() => {
        const startTime = new Date(state.currentSession!.startTime!).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isActive, state.isPaused, state.currentSession?.startTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  if (!state.currentSession || !state.isActive) {
    return <span>--:--</span>;
  }

  return (
    <span className={`font-mono ${state.isPaused ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
      {formatTime(elapsedTime)}
    </span>
  );
}