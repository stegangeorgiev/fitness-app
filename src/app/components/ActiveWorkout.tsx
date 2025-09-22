"use client";

import { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, Dumbbell, Plus, Info, CheckCircle, TrendingUp, X } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutSession, WorkoutExercise, WorkoutSet } from '../types/workout';
import { WorkoutProgram, WorkoutType, ExerciseData } from '../data/exercises';
import { ExerciseLogger } from './ExerciseLogger';
import { WorkoutTimer } from './WorkoutTimer';
import { WorkoutTypeSelector } from './WorkoutTypeSelector';
import { AIWorkoutGenerator } from './AIWorkoutGenerator';
import { ExerciseSearch } from './ExerciseSearch';

function ExerciseSearchModal({ isOpen, onClose, onSelectExercise }: {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseData) => void;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <ExerciseSearch
          onSelectExercise={(exercise) => {
            onSelectExercise(exercise);
            onClose();
          }}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

function WorkoutSummaryModal({ isOpen, onClose, workoutSession }: {
  isOpen: boolean;
  onClose: () => void;
  workoutSession: WorkoutSession | null;
}) {
  if (!isOpen || !workoutSession) return null;

  const completedExercises = workoutSession.exercises.filter(ex => 
    ex.sets.some(set => set.completed)
  ).length;
  
  const totalSets = workoutSession.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const completedSets = workoutSession.exercises.reduce((total, ex) => 
    total + ex.sets.filter(set => set.completed).length, 0
  );
  
  const totalReps = workoutSession.exercises.reduce((total, ex) => 
    total + ex.sets.filter(set => set.completed).reduce((repTotal, set) => repTotal + (set.reps || 0), 0), 0
  );

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Workout Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {workoutSession.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Workout Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Duration */}
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-300">Duration</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {workoutSession.duration ? formatDuration(workoutSession.duration) : '--'}
              </div>
            </div>

            {/* Exercises */}
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <Dumbbell className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-300">Exercises</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {completedExercises}/{workoutSession.exercises.length}
              </div>
            </div>

            {/* Sets */}
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-300">Sets</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {completedSets}/{totalSets}
              </div>
            </div>

            {/* Total Reps */}
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <CheckCircle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Reps</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {totalReps}
              </div>
            </div>
          </div>

          {/* Exercise Breakdown */}
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Exercise Breakdown
          </h4>
          <div className="space-y-3 mb-6">
            {workoutSession.exercises.map((exercise) => {
              const exerciseCompletedSets = exercise.sets.filter(set => set.completed).length;
              const exerciseTotalSets = exercise.sets.length;
              const completionRate = exerciseTotalSets > 0 ? (exerciseCompletedSets / exerciseTotalSets) * 100 : 0;
              
              return (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {exercise.exercise.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {exercise.exercise.muscleGroups.join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {exerciseCompletedSets}/{exerciseTotalSets} sets
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {Math.round(completionRate)}% complete
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActiveWorkout() {
  const { state, dispatch, startWorkout, endWorkout, pauseWorkout, resumeWorkout } = useWorkout();
  const [showExerciseSearchModal, setShowExerciseSearchModal] = useState(false);
  const [showWorkoutSummary, setShowWorkoutSummary] = useState(false);
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);
  const [workoutFlow, setWorkoutFlow] = useState<'start' | 'select-type' | 'ai-generate' | 'active'>('start');
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<WorkoutType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseData | null>(null);
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  const createNewWorkout = () => {
    setWorkoutFlow('select-type');
  };

  const handleWorkoutTypeSelection = (type: WorkoutType, difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedWorkoutType(type);
    setSelectedDifficulty(difficulty);
    setWorkoutFlow('ai-generate');
  };

  const handleStartAIWorkout = (program: WorkoutProgram) => {
    const newSession: WorkoutSession = {
      id: program.id,
      name: program.name,
      exercises: program.exercises.map(programEx => ({
        id: `${programEx.exercise.id}-${Date.now()}`,
        exercise: {
          id: programEx.exercise.id,
          name: programEx.exercise.name,
          category: programEx.exercise.category,
          muscleGroups: programEx.exercise.muscleGroups,
          equipment: programEx.exercise.equipment
        },
        sets: [],
        targetSets: programEx.sets,
        targetReps: typeof programEx.reps === 'string' 
          ? parseInt(programEx.reps.split('-')[0]) || 10 // Take first number from "8-12" format
          : programEx.reps,
        targetWeight: typeof programEx.weight === 'string' ? 0 : programEx.weight,
      })),
      startTime: new Date(),
      isActive: true,
      completed: false,
    };
    
    startWorkout(newSession);
    setWorkoutFlow('active');
  };

  const handleBackToStart = () => {
    setWorkoutFlow('start');
    setSelectedWorkoutType(null);
  };

  const handleBackToTypeSelection = () => {
    setWorkoutFlow('select-type');
  };

  const showExerciseInfo = (exercise: ExerciseData) => {
    setSelectedExercise(exercise);
    setShowInstructionModal(true);
  };

  const addExerciseToWorkout = (exercise: ExerciseData) => {
    const newWorkoutExercise: WorkoutExercise = {
      id: `${exercise.id}-${Date.now()}`,
      exercise: {
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        muscleGroups: exercise.muscleGroups,
        equipment: exercise.equipment
      },
      sets: [],
      targetSets: 3,
      targetReps: 10,
    };
    
    // Add exercise to current workout
    if (state.currentSession) {
      dispatch({
        type: 'ADD_EXERCISE',
        payload: newWorkoutExercise,
      });
    }
    setShowExerciseSearchModal(false);
  };

  const handleEndWorkout = () => {
    if (state.currentSession) {
      // Store current session for summary modal
      const sessionWithDuration = {
        ...state.currentSession,
        endTime: new Date(),
        completed: true,
        duration: state.currentSession.startTime 
          ? Math.floor((new Date().getTime() - state.currentSession.startTime.getTime()) / 1000)
          : 0,
      };
      setCompletedSession(sessionWithDuration);
      setShowWorkoutSummary(true);
      
      // End the workout in the context
      endWorkout();
    }
  };

  const handleCloseSummary = () => {
    setShowWorkoutSummary(false);
    setCompletedSession(null);
    setWorkoutFlow('start');
  };

  // Check if we have an active session and should show the active workout
  useEffect(() => {
    if (state.currentSession && state.isActive) {
      setWorkoutFlow('active');
    }
  }, [state.currentSession, state.isActive]);

  // Show workout flow based on current state
  if (workoutFlow === 'select-type') {
    return (
      <WorkoutTypeSelector
        onSelectType={handleWorkoutTypeSelection}
        onBack={handleBackToStart}
      />
    );
  }

  if (workoutFlow === 'ai-generate' && selectedWorkoutType) {
    return (
      <AIWorkoutGenerator
        workoutType={selectedWorkoutType}
        difficulty={selectedDifficulty}
        onStartWorkout={handleStartAIWorkout}
        onBack={handleBackToTypeSelection}
      />
    );
  }

  if (!state.currentSession) {
    return (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl mb-6">
              <Dumbbell className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Start Your AI-Powered Workout?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose your workout type and let our AI create a personalized program just for you.
              </p>
            </div>
            <button
              onClick={createNewWorkout}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl flex items-center space-x-2 mx-auto transition-all transform hover:scale-105"
            >
              <Play className="h-5 w-5" />
              <span className="font-medium">Start AI Workout</span>
            </button>
          </div>
        </div>

        {/* Workout Summary Modal */}
        <WorkoutSummaryModal
          isOpen={showWorkoutSummary}
          onClose={handleCloseSummary}
          workoutSession={completedSession}
        />
      </>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Workout Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {state.currentSession.name}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <WorkoutTimer startTime={state.currentSession.startTime} isPaused={state.isPaused} />
              <span>•</span>
              <span>{state.currentSession.exercises.length} exercises</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {state.isPaused ? (
              <button
                onClick={resumeWorkout}
                className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-colors"
              >
                <Play className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={pauseWorkout}
                className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-xl transition-colors"
              >
                <Pause className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={handleEndWorkout}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition-colors"
            >
              <Square className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${
            state.isPaused ? 'bg-yellow-500' : 'bg-green-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {state.isPaused ? 'Workout Paused' : 'Workout Active'}
          </span>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        {state.currentSession.exercises.map((workoutExercise, index) => (
          <ExerciseLogger
            key={workoutExercise.id}
            workoutExercise={workoutExercise}
            exerciseIndex={index}
            onShowInstructions={showExerciseInfo}
          />
        ))}

        {/* Add Exercise Button */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 border-dashed">
          <button
            onClick={() => setShowExerciseSearchModal(true)}
            className="w-full flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Exercise</span>
          </button>
        </div>
      </div>

      {/* Exercise Instruction Modal */}
      <ExerciseInstructionModal
        exercise={selectedExercise}
        isOpen={showInstructionModal}
        onClose={() => setShowInstructionModal(false)}
      />

      {/* Exercise Search Modal */}
      <ExerciseSearchModal
        isOpen={showExerciseSearchModal}
        onClose={() => setShowExerciseSearchModal(false)}
        onSelectExercise={addExerciseToWorkout}
      />

      {/* Workout Summary Modal */}
      <WorkoutSummaryModal
        isOpen={showWorkoutSummary}
        onClose={handleCloseSummary}
        workoutSession={completedSession}
      />
    </div>
  );
}