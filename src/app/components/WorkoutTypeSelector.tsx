"use client";

import { useState } from 'react';
import { ChevronRight, Users, Clock, Target } from 'lucide-react';
import { WorkoutType, WORKOUT_TYPES } from '../data/exercises';

interface WorkoutTypeSelectorProps {
  onSelectType: (type: WorkoutType, difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
  onBack: () => void;
}

export function WorkoutTypeSelector({ onSelectType, onBack }: WorkoutTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<WorkoutType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const difficulties = [
    {
      level: 'beginner' as const,
      name: 'Beginner',
      description: 'New to fitness or this muscle group',
      duration: '15-25 min',
      icon: '🌱'
    },
    {
      level: 'intermediate' as const,
      name: 'Intermediate', 
      description: 'Some experience with regular workouts',
      duration: '25-40 min',
      icon: '💪'
    },
    {
      level: 'advanced' as const,
      name: 'Advanced',
      description: 'Experienced with intense training',
      duration: '40-60 min',
      icon: '🔥'
    }
  ];

  const handleContinue = () => {
    if (selectedType) {
      onSelectType(selectedType, selectedDifficulty);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors mb-4"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span>Back</span>
        </button>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Workout
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select the type of workout and difficulty level for your AI-generated program
        </p>
      </div>

      {/* Step 1: Workout Type Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>Step 1: Choose Workout Type</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(WORKOUT_TYPES).map(([key, workout]) => (
            <button
              key={key}
              onClick={() => setSelectedType(key as WorkoutType)}
              className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                selectedType === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="text-3xl mb-3">{workout.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {workout.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {workout.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Difficulty Selection */}
      {selectedType && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Step 2: Choose Difficulty Level</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.level}
                onClick={() => setSelectedDifficulty(difficulty.level)}
                className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                  selectedDifficulty === difficulty.level
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{difficulty.icon}</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{difficulty.duration}</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {difficulty.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {difficulty.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedType && (
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl flex items-center space-x-2 transition-all transform hover:scale-105 font-medium"
          >
            <span>Generate AI Workout Program</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}