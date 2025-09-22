"use client";

import { useState } from 'react';
import { Plus, Minus, Check, X, Weight, Hash, Clock, Info } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutExercise, WorkoutSet } from '../types/workout';
import { EXERCISE_DATABASE, ExerciseData } from '../data/exercises';

interface ExerciseLoggerProps {
  workoutExercise: WorkoutExercise;
  exerciseIndex: number;
  onShowInstructions?: (exercise: ExerciseData) => void;
}

export function ExerciseLogger({ workoutExercise, exerciseIndex, onShowInstructions }: ExerciseLoggerProps) {
  const { dispatch } = useWorkout();
  const [isExpanded, setIsExpanded] = useState(true);

  // Find the detailed exercise data
  const exerciseData = EXERCISE_DATABASE.find(ex => ex.id === workoutExercise.exercise.id);

  const addSet = () => {
    const newSet: WorkoutSet = {
      id: `set-${Date.now()}`,
      reps: workoutExercise.targetReps || 10,
      weight: workoutExercise.targetWeight || 0,
      completed: false,
    };

    dispatch({
      type: 'ADD_SET',
      payload: {
        exerciseId: workoutExercise.id,
        set: newSet,
      },
    });
  };

  const updateSet = (setId: string, updates: Partial<WorkoutSet>) => {
    dispatch({
      type: 'UPDATE_SET',
      payload: {
        exerciseId: workoutExercise.id,
        setId,
        updates,
      },
    });
  };

  const deleteSet = (setId: string) => {
    dispatch({
      type: 'DELETE_SET',
      payload: {
        exerciseId: workoutExercise.id,
        setId,
      },
    });
  };

  const markSetComplete = (setId: string) => {
    const set = workoutExercise.sets.find(s => s.id === setId);
    if (set) {
      updateSet(setId, { 
        completed: !set.completed,
        completedAt: !set.completed ? new Date() : undefined,
      });
    }
  };

  const completedSets = workoutExercise.sets.filter(set => set.completed).length;
  const totalSets = workoutExercise.sets.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Exercise Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
              <Weight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {workoutExercise.exercise.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span>{workoutExercise.exercise.muscleGroups.join(', ')}</span>
                <span>•</span>
                <span>{completedSets}/{totalSets} sets completed</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${
              completedSets === totalSets && totalSets > 0 ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            {exerciseData && onShowInstructions && (
              <button
                onClick={() => onShowInstructions(exerciseData)}
                className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors"
                title="View exercise instructions"
              >
                <Info className="h-4 w-4" />
              </button>
            )}
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              {isExpanded ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Details */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {/* Sets List */}
          <div className="space-y-3 mb-4">
            {workoutExercise.sets.map((set, setIndex) => (
              <SetRow
                key={set.id}
                set={set}
                setNumber={setIndex + 1}
                onUpdate={(updates) => updateSet(set.id, updates)}
                onToggleComplete={() => markSetComplete(set.id)}
                onDelete={() => deleteSet(set.id)}
              />
            ))}
          </div>

          {/* Add Set Button */}
          <button
            onClick={addSet}
            className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Set</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface SetRowProps {
  set: WorkoutSet;
  setNumber: number;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}

function SetRow({ set, setNumber, onUpdate, onToggleComplete, onDelete }: SetRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempReps, setTempReps] = useState(set.reps?.toString() || '');
  const [tempWeight, setTempWeight] = useState(set.weight?.toString() || '');

  const handleSave = () => {
    onUpdate({
      reps: tempReps ? parseInt(tempReps) : undefined,
      weight: tempWeight ? parseFloat(tempWeight) : undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempReps(set.reps?.toString() || '');
    setTempWeight(set.weight?.toString() || '');
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all ${
      set.completed 
        ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/10' 
        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
    }`}>
      {/* Set Number */}
      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
        {setNumber}
      </div>

      {/* Reps Input */}
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <Hash className="h-4 w-4 text-gray-400" />
        {isEditing ? (
          <input
            type="number"
            value={tempReps}
            onChange={(e) => setTempReps(e.target.value)}
            className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Reps"
          />
        ) : (
          <span 
            className="text-sm text-gray-900 dark:text-white cursor-pointer hover:text-blue-600"
            onClick={() => setIsEditing(true)}
          >
            {set.reps || 0} reps
          </span>
        )}
      </div>

      {/* Weight Input */}
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <Weight className="h-4 w-4 text-gray-400" />
        {isEditing ? (
          <input
            type="number"
            step="0.5"
            value={tempWeight}
            onChange={(e) => setTempWeight(e.target.value)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Weight"
          />
        ) : (
          <span 
            className="text-sm text-gray-900 dark:text-white cursor-pointer hover:text-blue-600"
            onClick={() => setIsEditing(true)}
          >
            {set.weight || 0} lbs
          </span>
        )}
      </div>

      {/* Rest Time */}
      {set.completed && set.completedAt && (
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{new Date(set.completedAt).toLocaleTimeString()}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onToggleComplete}
              className={`p-2 rounded-lg transition-colors ${
                set.completed
                  ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10'
              }`}
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}