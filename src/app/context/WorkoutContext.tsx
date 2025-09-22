"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { WorkoutSession, WorkoutAction } from '../types/workout';

interface WorkoutState {
  currentSession: WorkoutSession | null;
  isActive: boolean;
  isPaused: boolean;
  sessionHistory: WorkoutSession[];
}

interface WorkoutContextType {
  state: WorkoutState;
  dispatch: React.Dispatch<WorkoutAction>;
  startWorkout: (session: WorkoutSession) => void;
  endWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const initialState: WorkoutState = {
  currentSession: null,
  isActive: false,
  isPaused: false,
  sessionHistory: [],
};

function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'START_WORKOUT':
      return {
        ...state,
        currentSession: {
          ...action.payload,
          startTime: new Date(),
          isActive: true,
        },
        isActive: true,
        isPaused: false,
      };

    case 'END_WORKOUT':
      if (!state.currentSession) return state;
      
      const completedSession = {
        ...state.currentSession,
        endTime: new Date(),
        isActive: false,
        completed: true,
        duration: state.currentSession.startTime 
          ? Math.floor((new Date().getTime() - state.currentSession.startTime.getTime()) / 1000)
          : 0,
      };

      return {
        ...state,
        currentSession: null,
        isActive: false,
        isPaused: false,
        sessionHistory: [completedSession, ...state.sessionHistory],
      };

    case 'PAUSE_WORKOUT':
      return {
        ...state,
        isPaused: true,
      };

    case 'RESUME_WORKOUT':
      return {
        ...state,
        isPaused: false,
      };

    case 'ADD_SET':
      if (!state.currentSession) return state;
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          exercises: state.currentSession.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? { ...exercise, sets: [...exercise.sets, action.payload.set] }
              : exercise
          ),
        },
      };

    case 'UPDATE_SET':
      if (!state.currentSession) return state;
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          exercises: state.currentSession.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map(set =>
                    set.id === action.payload.setId
                      ? { ...set, ...action.payload.updates }
                      : set
                  ),
                }
              : exercise
          ),
        },
      };

    case 'DELETE_SET':
      if (!state.currentSession) return state;
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          exercises: state.currentSession.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.filter(set => set.id !== action.payload.setId),
                }
              : exercise
          ),
        },
      };

    case 'ADD_EXERCISE':
      if (!state.currentSession) return state;
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          exercises: [...state.currentSession.exercises, action.payload],
        },
      };

    case 'UPDATE_EXERCISE':
      if (!state.currentSession) return state;
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          exercises: state.currentSession.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? { ...exercise, ...action.payload.updates }
              : exercise
          ),
        },
      };

    case 'DELETE_EXERCISE':
      if (!state.currentSession) return state;
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          exercises: state.currentSession.exercises.filter(
            exercise => exercise.id !== action.payload.exerciseId
          ),
        },
      };

    default:
      return state;
  }
}

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  // Load workout history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        // You might want to dispatch an action to load this history
        // For now, we'll keep it simple
      } catch (error) {
        console.error('Failed to load workout history:', error);
      }
    }
  }, []);

  // Save workout history to localStorage when it changes
  useEffect(() => {
    if (state.sessionHistory.length > 0) {
      localStorage.setItem('workoutHistory', JSON.stringify(state.sessionHistory));
    }
  }, [state.sessionHistory]);

  const startWorkout = (session: WorkoutSession) => {
    dispatch({ type: 'START_WORKOUT', payload: session });
  };

  const endWorkout = () => {
    dispatch({ type: 'END_WORKOUT' });
  };

  const pauseWorkout = () => {
    dispatch({ type: 'PAUSE_WORKOUT' });
  };

  const resumeWorkout = () => {
    dispatch({ type: 'RESUME_WORKOUT' });
  };

  return (
    <WorkoutContext.Provider value={{
      state,
      dispatch,
      startWorkout,
      endWorkout,
      pauseWorkout,
      resumeWorkout,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}