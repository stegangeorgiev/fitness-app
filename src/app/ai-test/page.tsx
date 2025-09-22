"use client";

import { useState } from 'react';
import { Brain, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

export default function AITestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testAI = async () => {
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      if (typeof window.puter === 'undefined') {
        throw new Error('Puter.js not loaded. Please refresh the page.');
      }

      const response = await window.puter.ai.chat(
        'Generate a simple 2-exercise leg workout for a beginner. Keep it under 50 words.',
        { model: 'gpt-4o-mini', temperature: 0.7, max_tokens: 100 }
      );

      const responseText = typeof response === 'string' 
        ? response 
        : response.message?.content || response.content || 'No response received';
      
      setResult(responseText);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const testWorkoutAPI = async () => {
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/ai/workout?type=legs&difficulty=beginner&duration=20');
      const data = await response.json();
      
      if (data.success) {
        setResult(`AI Workout Generated!\nProgram: ${data.data.program.name}\nExercises: ${data.data.program.exercises.length}\nProvider: ${data.meta.provider}`);
      } else {
        setError(data.error || 'Failed to generate workout');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'API request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full inline-block mb-6">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Integration Test
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Test OpenAI GPT-4 integration via Puter.js
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Direct AI Test</span>
            </h3>
            <button
              onClick={testAI}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg"
            >
              {isLoading ? 'Testing...' : 'Test AI Connection'}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>API Workout Test</span>
            </h3>
            <button
              onClick={testWorkoutAPI}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg"
            >
              {isLoading ? 'Generating...' : 'Test Workout API'}
            </button>
          </div>
        </div>

        {(result || error) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              {error ? (
                <><AlertCircle className="h-5 w-5 text-red-600" /><span>Error</span></>
              ) : (
                <><CheckCircle className="h-5 w-5 text-green-600" /><span>Success</span></>
              )}
            </h3>
            <div className={`p-4 rounded-lg ${error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <pre className="text-sm whitespace-pre-wrap">{error || result}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}