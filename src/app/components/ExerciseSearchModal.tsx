"use client";

import { useState, useEffect } from 'react';
import { Search, X, Plus, Target, Clock, Dumbbell } from 'lucide-react';
import { ExerciseData } from '../data/exercises';
import { ExerciseService } from '../services/api';

interface ExerciseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseData) => void;
}

export function ExerciseSearchModal({ isOpen, onClose, onSelectExercise }: ExerciseSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: '',
    muscleGroup: '',
    category: ''
  });

  // Fetch exercises when modal opens or search/filters change
  useEffect(() => {
    if (isOpen) {
      fetchExercises();
    }
  }, [isOpen, searchTerm, selectedFilters]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      
      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }
      
      if (selectedFilters.difficulty) {
        filters.difficulty = selectedFilters.difficulty;
      }
      
      if (selectedFilters.muscleGroup) {
        filters.muscleGroup = selectedFilters.muscleGroup;
      }
      
      if (selectedFilters.category) {
        filters.category = selectedFilters.category;
      }

      const response = await ExerciseService.getExercises(filters);
      setExercises(response.data);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExercise = (exercise: ExerciseData) => {
    onSelectExercise(exercise);
    onClose();
    setSearchTerm('');
    setSelectedFilters({ difficulty: '', muscleGroup: '', category: '' });
  };

  const clearFilters = () => {
    setSelectedFilters({ difficulty: '', muscleGroup: '', category: '' });
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Exercise to Workout
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search exercises by name, muscle group, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-3">
            <select
              value={selectedFilters.difficulty}
              onChange={(e) => setSelectedFilters({...selectedFilters, difficulty: e.target.value})}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={selectedFilters.muscleGroup}
              onChange={(e) => setSelectedFilters({...selectedFilters, muscleGroup: e.target.value})}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Muscle Groups</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="core">Core</option>
            </select>

            <select
              value={selectedFilters.category}
              onChange={(e) => setSelectedFilters({...selectedFilters, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
            </select>

            {(searchTerm || selectedFilters.difficulty || selectedFilters.muscleGroup || selectedFilters.category) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">Searching exercises...</span>
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm || selectedFilters.difficulty || selectedFilters.muscleGroup || selectedFilters.category
                  ? 'No exercises found matching your search criteria.'
                  : 'Start typing to search for exercises.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleSelectExercise(exercise)}
                >
                  {/* Exercise Image */}
                  {exercise.imageUrl && (
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}

                  {/* Exercise Info */}
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {exercise.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {exercise.muscleGroups.join(', ')}
                  </p>

                  {/* Exercise Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{exercise.estimatedDuration}s/rep</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Dumbbell className="h-3 w-3" />
                      <span>{exercise.equipment?.length ? exercise.equipment.join(', ') : 'No equipment'}</span>
                    </div>
                  </div>

                  {/* Add Button */}
                  <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>Add to Workout</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}