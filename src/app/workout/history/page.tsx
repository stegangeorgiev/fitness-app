"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Target, Award, Trash2, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { WorkoutSession } from '../../types/workout';

export default function WorkoutHistoryPage() {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);

  // Load workout history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setWorkoutHistory(history || []);
      } catch (error) {
        console.error('Failed to load workout history:', error);
        setWorkoutHistory([]);
      }
    }
  }, []);

  // Filter workouts based on search and time period
  const filteredWorkouts = workoutHistory.filter(workout => {
    // Search filter
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.exercises.some(ex => ex.exercise.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    // Time period filter
    if (filterPeriod === 'all') return true;
    
    const workoutDate = new Date(workout.endTime || workout.startTime || '');
    const now = new Date();
    const timeDiff = now.getTime() - workoutDate.getTime();
    
    switch (filterPeriod) {
      case 'week':
        return timeDiff <= 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return timeDiff <= 30 * 24 * 60 * 60 * 1000;
      case 'year':
        return timeDiff <= 365 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });

  // Calculate stats for a workout
  const calculateWorkoutStats = (workout: WorkoutSession) => {
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = workout.exercises.reduce((sum, ex) => 
      sum + ex.sets.filter(set => set.completed).length, 0
    );
    const totalReps = workout.exercises.reduce((sum, ex) => 
      sum + ex.sets.reduce((setSum, set) => setSum + (set.reps || 0), 0), 0
    );
    const completionRate = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
    
    return { totalSets, completedSets, totalReps, completionRate };
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Delete workout
  const deleteWorkout = (workoutId: string) => {
    const updatedHistory = workoutHistory.filter(w => w.id !== workoutId);
    setWorkoutHistory(updatedHistory);
    localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
  };

  // Overall stats
  const totalWorkouts = workoutHistory.length;
  const totalDuration = workoutHistory.reduce((sum, w) => sum + (w.duration || 0), 0);
  const averageCompletion = workoutHistory.length > 0 
    ? Math.round(workoutHistory.reduce((sum, w) => {
        const stats = calculateWorkoutStats(w);
        return sum + stats.completionRate;
      }, 0) / workoutHistory.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/workout"
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Workout History
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Track your fitness journey
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-xl">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWorkouts}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Workouts</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(totalDuration)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-xl">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageCompletion}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Avg Completion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search workouts or exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
        </div>

        {/* Workout List */}
        {filteredWorkouts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {workoutHistory.length === 0 ? 'No Workouts Yet' : 'No Workouts Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {workoutHistory.length === 0 
                ? 'Start your first workout to see your progress here!'
                : 'Try adjusting your search terms or filter.'}
            </p>
            {workoutHistory.length === 0 && (
              <Link
                href="/workout"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                Start Your First Workout
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorkouts.map((workout) => {
              const stats = calculateWorkoutStats(workout);
              return (
                <div
                  key={workout.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {workout.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(workout.endTime || workout.startTime)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteWorkout(workout.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatDuration(workout.duration || 0)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats.completedSets}/{stats.totalSets}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Sets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats.totalReps}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Reps</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-bold ${
                        stats.completionRate >= 80 ? 'text-green-600 dark:text-green-400' :
                        stats.completionRate >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {stats.completionRate}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Complete</p>
                    </div>
                  </div>

                  {/* Exercise List */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exercises ({workout.exercises.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {workout.exercises.map((ex, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {ex.exercise.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}