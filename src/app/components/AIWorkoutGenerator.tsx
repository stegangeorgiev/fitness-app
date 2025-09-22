"use client";

import { useState, useEffect } from 'react';
import { Sparkles, Clock, Target, TrendingUp, ChevronRight, RotateCcw, Brain } from 'lucide-react';
import { WorkoutType, WorkoutProgram } from '../data/exercises';
import { AIWorkoutService, AIWorkoutRequest } from '../services/aiService';

interface AIWorkoutGeneratorProps {
  workoutType: WorkoutType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onStartWorkout: (program: WorkoutProgram) => void;
  onBack: () => void;
}

export function AIWorkoutGenerator({ workoutType, difficulty, onStartWorkout, onBack }: AIWorkoutGeneratorProps) {
  const [generatedProgram, setGeneratedProgram] = useState<WorkoutProgram | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string>('');
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAiMode, setIsAiMode] = useState<boolean>(true);
  const [showAiPermission, setShowAiPermission] = useState<boolean>(false);
  const [aiInitialized, setAiInitialized] = useState<boolean>(false);

  // Pre-initialize AI service on component mount
  useEffect(() => {
    const initAI = async () => {
      // Start pre-initialization immediately
      AIWorkoutService.preInitializeAI();
      
      // Check if AI is ready after a short delay
      setTimeout(() => {
        setAiInitialized(AIWorkoutService.isAIReady());
      }, 1000);
      
      // Check again after more time for slower connections
      setTimeout(() => {
        setAiInitialized(AIWorkoutService.isAIReady());
      }, 5000);
    };
    
    initAI();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setShowAiPermission(false);
    
    try {
      // Prepare AI request
      const aiRequest: AIWorkoutRequest = {
        workoutType,
        difficulty,
        duration: 30, // Default duration
        userGoals: 'General fitness improvement',
        equipment: ['bodyweight', 'dumbbells', 'barbell'], // Default equipment
        experience: difficulty
      };

      console.log('Attempting AI workout generation...');
      
      // Call the AI service with optimized error handling
      const aiResponse = await AIWorkoutService.generateWorkoutProgram(aiRequest);
      
      setGeneratedProgram(aiResponse.program);
      setAiReasoning(aiResponse.reasoning);
      setAiTips(aiResponse.tips);
      setIsAiMode(aiResponse.program.aiGenerated);
      
      // Update AI status
      setAiInitialized(AIWorkoutService.isAIReady());
      
      if (!aiResponse.program.aiGenerated) {
        console.log('Using smart algorithm - AI not available');
      }
      
    } catch (error) {
      console.error('Workout generation failed:', error);
      setError('Unable to generate workout. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetryWithPermission = async () => {
    setShowAiPermission(true);
    setIsGenerating(true);
    
    try {
      // Give user guidance about the verification process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to re-initialize AI
      await AIWorkoutService.preInitializeAI();
      
      // Check if now ready
      setTimeout(() => {
        setAiInitialized(AIWorkoutService.isAIReady());
        setShowAiPermission(false);
        handleGenerate();
      }, 2000);
    } catch (error) {
      setShowAiPermission(false);
      setIsGenerating(false);
      console.log('Permission setup failed, will use smart algorithm');
      handleGenerate();
    }
  };

  const handleRegenerate = () => {
    setGeneratedProgram(null);
    setAiReasoning('');
    setAiTips([]);
    handleGenerate();
  };

  useEffect(() => {
    handleGenerate();
  }, [workoutType, difficulty]);

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full inline-block mb-6 animate-pulse">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Creating Your {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level Workout
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {showAiPermission 
            ? 'Setting up AI service - this may require one-time permission for enhanced workout generation...'
            : aiInitialized
            ? `Generating a personalized AI workout with ${difficulty === 'beginner' ? '3-4 exercises' : difficulty === 'intermediate' ? '4-6 exercises' : '5-8 exercises'} designed for your ${difficulty} fitness level...`
            : `Creating a smart workout with ${difficulty === 'beginner' ? '3-4 exercises' : difficulty === 'intermediate' ? '4-6 exercises' : '5-8 exercises'} designed for your ${difficulty} fitness level...`
          }
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
        {showAiPermission && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              🤖 <strong>AI Enhancement Setup</strong>
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              We're connecting to OpenAI GPT-4o-mini for personalized workout generation. 
              If prompted, please allow access to enable AI-powered recommendations.
              Don't worry - if unavailable, our smart algorithm will create an excellent workout!
            </p>
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {aiInitialized 
            ? 'Powered by OpenAI GPT-4o-mini + Smart Algorithm'
            : 'Powered by Smart Algorithm + AI Enhancement'
          }
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full inline-block mb-6">
          <Sparkles className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          AI Service Temporarily Unavailable
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {error}
        </p>
        <button
          onClick={handleGenerate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!generatedProgram) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors mb-4"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span>Back</span>
        </button>
        <div className="flex items-center space-x-3 mb-4">
          <div className={`bg-gradient-to-r p-3 rounded-xl ${isAiMode ? 'from-purple-600 to-blue-600' : 'from-green-600 to-teal-600'}`}>
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your {isAiMode ? 'AI-Generated' : 'Smart-Generated'} Workout
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {isAiMode 
                ? `Personalized by OpenAI GPT-4o-mini • ${difficulty} level ${workoutType.replace('-', ' ')} program`
                : `Intelligently designed by Smart Algorithm • ${difficulty} level ${workoutType.replace('-', ' ')} program`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Program Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {generatedProgram.name}
          </h3>
          <button
            onClick={handleRegenerate}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">Regenerate</span>
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {generatedProgram.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Duration</p>
              <p className="font-semibold text-gray-900 dark:text-white">{Math.round(generatedProgram.duration)} min</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <Target className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Exercises</p>
              <p className="font-semibold text-gray-900 dark:text-white">{generatedProgram.exercises.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Difficulty</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{generatedProgram.difficulty}</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Benefits of this workout:</h4>
          <div className="flex flex-wrap gap-2">
            {generatedProgram.benefits.map((benefit, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* AI Reasoning */}
        {aiReasoning && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span>AI Exercise Selection Reasoning</span>
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{aiReasoning}</p>
          </div>
        )}

        {/* AI Tips */}
        {aiTips.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span>AI Training Tips</span>
            </h4>
            <ul className="space-y-2">
              {aiTips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Exercise List */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Exercise Program</h4>
        {generatedProgram.exercises.map((programExercise, index) => (
          <div
            key={programExercise.exercise.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {programExercise.exercise.name}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {programExercise.exercise.primaryMuscles.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Sets:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{programExercise.sets}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reps:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{programExercise.reps}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Weight:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{programExercise.weight}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Rest:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{programExercise.restBetweenSets}s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start Workout Button */}
      <div className="flex justify-center">
        <button
          onClick={() => onStartWorkout(generatedProgram)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl flex items-center space-x-2 transition-all transform hover:scale-105 font-medium text-lg"
        >
          <span>Start This Workout</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}