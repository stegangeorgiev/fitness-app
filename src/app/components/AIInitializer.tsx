"use client";

import { useEffect } from 'react';
import { AIWorkoutService } from '../services/aiService';

export function AIInitializer() {
  useEffect(() => {
    // Pre-initialize AI service as early as possible
    const initAI = async () => {
      try {
        // Wait a bit for the page to load and Puter.js to be available
        setTimeout(() => {
          AIWorkoutService.preInitializeAI();
          console.log('🚀 AI pre-initialization started');
        }, 500);
      } catch (error) {
        console.log('Early AI initialization failed, will fallback when needed');
      }
    };

    initAI();
  }, []);

  // This component doesn't render anything, it just initializes AI in the background
  return null;
}