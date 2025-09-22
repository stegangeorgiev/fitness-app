"use client";

import { useState } from 'react';
import { CheckCircle, Clock, Award, Target, X, Trophy, BarChart3 } from 'lucide-react';
import { WorkoutSession } from '../types/workout';

interface WorkoutSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutSession: WorkoutSession | null;
}

export function WorkoutSummaryModal({ isOpen, onClose, workoutSession }: WorkoutSummaryModalProps) {
  if (!isOpen || !workoutSession) return null;

  // Calculate workout statistics
  const totalSets = workoutSession.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = workoutSession.exercises.reduce((sum, ex) => 
    sum + ex.sets.filter(set => set.completed).length, 0
  );
  const totalReps = workoutSession.exercises.reduce((sum, ex) => 
    sum + ex.sets.reduce((setSum, set) => setSum + (set.reps || 0), 0), 0
  );
  const totalWeight = workoutSession.exercises.reduce((sum, ex) => 
    sum + ex.sets.reduce((setSum, set) => setSum + ((set.weight || 0) * (set.reps || 0)), 0), 0
  );
  
  const completionRate = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const workoutDuration = workoutSession.duration || 0; // in seconds
  const durationMinutes = Math.floor(workoutDuration / 60);
  const durationSeconds = workoutDuration % 60;

  // Exercise completion stats
  const exerciseStats = workoutSession.exercises.map(ex => ({
    name: ex.exercise.name,
    completedSets: ex.sets.filter(set => set.completed).length,
    totalSets: ex.sets.length,
    completionRate: ex.sets.length > 0 ? Math.round((ex.sets.filter(set => set.completed).length / ex.sets.length) * 100) : 0
  }));

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCompletionBg = (rate: number) => {
    if (rate >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (rate >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-3 rounded-full">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Workout Complete!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {workoutSession.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {durationMinutes}:{durationSeconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Duration</div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {completedSets}/{totalSets}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Sets</div>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <BarChart3 className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {totalReps}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Reps</div>
            </div>

            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <Award className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className={`text-lg font-bold ${getCompletionColor(completionRate)}`}>
                {completionRate}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Complete</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className={`text-sm font-medium ${getCompletionColor(completionRate)}`}>
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  completionRate >= 80 ? 'bg-green-500' :
                  completionRate >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Exercise Breakdown */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Exercise Breakdown
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {exerciseStats.map((stat, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getCompletionBg(stat.completionRate)} border-gray-200 dark:border-gray-700`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        stat.completionRate >= 80 ? 'bg-green-500' :
                        stat.completionRate >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {stat.name}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {stat.completedSets} of {stat.totalSets} sets completed
                        </p>
                      </div>
                    </div>
                    <div className={`text-right`}>
                      <div className={`text-lg font-bold ${getCompletionColor(stat.completionRate)}`}>
                        {stat.completionRate}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Mini progress bar */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stat.completionRate >= 80 ? 'bg-green-500' :
                          stat.completionRate >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${stat.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}