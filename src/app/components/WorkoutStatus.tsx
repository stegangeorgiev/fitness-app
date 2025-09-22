"use client";

import { Play, Pause, Square, Clock, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useWorkout } from "../context/WorkoutContext";

export function WorkoutStatus() {
  const { state } = useWorkout();

  if (!state.currentSession) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4 inline-block">
            <Dumbbell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Work Out?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            Start a new workout session to track your exercises.
          </p>
          <Link
            href="/workout"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors mx-auto w-fit"
          >
            <Play className="h-4 w-4" />
            <span>Start Workout</span>
          </Link>
        </div>
      </div>
    );
  }

  const completedExercises = state.currentSession.exercises.filter(ex => 
    ex.sets.every(set => set.completed)
  ).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Workout
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {state.currentSession.name}
          </p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
          state.isPaused 
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        }`}>
          {state.isPaused ? (
            <>
              <Pause className="h-3 w-3" />
              <span>Paused</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3" />
              <span>Active</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Exercises completed</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {completedExercises}/{state.currentSession.exercises.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${state.currentSession.exercises.length > 0 
                ? (completedExercises / state.currentSession.exercises.length) * 100 
                : 0}%` 
            }}
          ></div>
        </div>
      </div>

      <Link
        href="/workout"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <Dumbbell className="h-4 w-4" />
        <span>Continue Workout</span>
      </Link>
    </div>
  );
}