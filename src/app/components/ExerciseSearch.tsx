"use client";

import { useState, useEffect } from 'react';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { ExerciseData } from '../data/exercises';
import { ExerciseService } from '../services/api';

interface ExerciseSearchProps {
  onSelectExercise: (exercise: ExerciseData) => void;
  onClose: () => void;
}

export function ExerciseSearch({ onSelectExercise, onClose }: ExerciseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    difficulty: '',
    muscleGroup: ''
  });

  // Load all exercises on mount
  useEffect(() => {
    loadExercises();
  }, []);

  // Filter exercises when search query or filters change
  useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedFilters, exercises]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const response = await ExerciseService.getExercises();
      setExercises(response.data);
      setFilteredExercises(response.data);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.muscleGroups.some(group => group.toLowerCase().includes(query)) ||
        exercise.primaryMuscles?.some(muscle => muscle.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedFilters.category) {
      filtered = filtered.filter(exercise => exercise.category === selectedFilters.category);
    }

    // Difficulty filter
    if (selectedFilters.difficulty) {
      filtered = filtered.filter(exercise => exercise.difficulty === selectedFilters.difficulty);
    }

    // Muscle group filter
    if (selectedFilters.muscleGroup) {
      filtered = filtered.filter(exercise =>
        exercise.muscleGroups.includes(selectedFilters.muscleGroup) ||
        exercise.primaryMuscles?.includes(selectedFilters.muscleGroup)
      );
    }

    setFilteredExercises(filtered);
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: '',
      difficulty: '',
      muscleGroup: ''
    });
    setSearchQuery('');
  };

  const categories = ['strength', 'cardio', 'flexibility', 'sports'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const muscleGroups = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps', 'core', 
    'quadriceps', 'hamstrings', 'glutes', 'calves'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Exercise
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search exercises by name or muscle group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </h4>
          {(selectedFilters.category || selectedFilters.difficulty || selectedFilters.muscleGroup) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Category
            </label>
            <select
              value={selectedFilters.category}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Difficulty
            </label>
            <select
              value={selectedFilters.difficulty}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Muscle Group Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Muscle Group
            </label>
            <select
              value={selectedFilters.muscleGroup}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, muscleGroup: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All muscle groups</option>
              {muscleGroups.map(muscle => (
                <option key={muscle} value={muscle}>
                  {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading exercises...</span>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || selectedFilters.category || selectedFilters.difficulty || selectedFilters.muscleGroup
                ? 'No exercises found matching your criteria'
                : 'No exercises available'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => onSelectExercise(exercise)}
                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {exercise.name}
                    </h4>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {exercise.category}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {exercise.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {exercise.muscleGroups.join(', ')}
                    </p>
                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Equipment: {exercise.equipment.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {loading ? 'Loading...' : `${filteredExercises.length} exercise${filteredExercises.length !== 1 ? 's' : ''} found`}
        </p>
      </div>
    </div>
  );
}