"use client";

import { useState } from 'react';
import { X, Play, AlertCircle, CheckCircle, Target, Clock } from 'lucide-react';
import { ExerciseData } from '../data/exercises';

interface ExerciseInstructionModalProps {
  exercise: ExerciseData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExerciseInstructionModal({ exercise, isOpen, onClose }: ExerciseInstructionModalProps) {
  const [activeTab, setActiveTab] = useState<'instructions' | 'tips' | 'mistakes'>('instructions');

  if (!isOpen || !exercise) return null;

  const tabs = [
    { id: 'instructions' as const, label: 'How to Perform', icon: Play },
    { id: 'tips' as const, label: 'Pro Tips', icon: CheckCircle },
    { id: 'mistakes' as const, label: 'Common Mistakes', icon: AlertCircle }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {exercise.name}
                </h3>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {exercise.primaryMuscles.join(', ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exercise.difficulty === 'beginner' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : exercise.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {exercise.difficulty}
                  </span>
                </div>
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

        {/* Exercise Image/Video */}
        {exercise.imageUrl && (
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={exercise.imageUrl}
                alt={`How to perform ${exercise.name}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
                }}
              />
              {exercise.videoUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <a
                    href={exercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-105"
                  >
                    <Play className="h-8 w-8 text-gray-800 ml-1" />
                  </a>
                </div>
              )}
            </div>
            {exercise.videoUrl && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                Click the play button above to watch demonstration video
              </p>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-sm text-gray-600 dark:text-gray-300">Duration</div>
              <div className="font-semibold text-gray-900 dark:text-white">{exercise.estimatedDuration}s/rep</div>
            </div>
            <div className="text-center">
              <Target className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <div className="text-sm text-gray-600 dark:text-gray-300">Category</div>
              <div className="font-semibold text-gray-900 dark:text-white capitalize">{exercise.category}</div>
            </div>
            <div className="text-center">
              <CheckCircle className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <div className="text-sm text-gray-600 dark:text-gray-300">Equipment</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {exercise.equipment?.length ? exercise.equipment.join(', ') : 'None'}
              </div>
            </div>
            <div className="text-center">
              <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
              <div className="text-sm text-gray-600 dark:text-gray-300">Rest Time</div>
              <div className="font-semibold text-gray-900 dark:text-white">{exercise.restTime}s</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'instructions' && (
            <div className="space-y-6">
              {/* Setup */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Setup</span>
                </h4>
                <ul className="space-y-2">
                  {exercise.instructions.setup.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Execution */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Execution</span>
                </h4>
                <ul className="space-y-2">
                  {exercise.instructions.execution.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Pro Tips for Better Performance</h4>
              <ul className="space-y-3">
                {exercise.instructions.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'mistakes' && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Avoid These Common Mistakes</h4>
              <ul className="space-y-3">
                {exercise.instructions.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Muscle Groups */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Targeted Muscles</h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Primary: </span>
              <span className="text-gray-900 dark:text-white font-medium">{exercise.primaryMuscles.join(', ')}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Secondary: </span>
              <span className="text-gray-900 dark:text-white font-medium">{exercise.secondaryMuscles.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            Got it, Let's Do This!
          </button>
        </div>
      </div>
    </div>
  );
}