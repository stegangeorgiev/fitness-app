"use client";

import { useState } from 'react';
import { Copy, CheckCircle, ExternalLink, Database, Zap, Target, Brain } from 'lucide-react';

export default function ApiDocumentation() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/exercises',
      description: 'Get all exercises with optional filtering',
      parameters: [
        { name: 'muscleGroup', type: 'string', description: 'Filter by muscle group (e.g., "chest", "back")' },
        { name: 'difficulty', type: 'string', description: 'Filter by difficulty ("beginner", "intermediate", "advanced")' },
        { name: 'category', type: 'string', description: 'Filter by category ("strength", "cardio", "flexibility")' },
        { name: 'equipment', type: 'string', description: 'Filter by equipment ("none", "dumbbells", "barbell")' },
        { name: 'search', type: 'string', description: 'Search exercises by name or muscle groups' }
      ],
      example: 'http://localhost:3000/api/exercises?muscleGroup=chest&difficulty=beginner',
      icon: Database
    },
    {
      method: 'GET',
      path: '/api/exercises/[id]',
      description: 'Get a specific exercise by ID with detailed instructions',
      parameters: [
        { name: 'id', type: 'string', description: 'Exercise ID (e.g., "push-ups", "squats")' }
      ],
      example: 'http://localhost:3000/api/exercises/push-ups',
      icon: Target
    },
    {
      method: 'GET',
      path: '/api/exercises/workout-type/[type]',
      description: 'Get exercises suitable for a specific workout type',
      parameters: [
        { name: 'type', type: 'string', description: 'Workout type ("full-body", "chest", "back", "legs", "core", "arms", "shoulders")' },
        { name: 'difficulty', type: 'string', description: 'Filter by difficulty level' },
        { name: 'limit', type: 'number', description: 'Limit number of results' }
      ],
      example: 'http://localhost:3000/api/exercises/workout-type/chest?difficulty=beginner&limit=5',
      icon: Target
    },
    {
      method: 'GET',
      path: '/api/workout-programs',
      description: 'Generate AI-powered workout programs',
      parameters: [
        { name: 'type', type: 'string', description: 'Required. Workout type ("full-body", "chest", "back", etc.)' },
        { name: 'difficulty', type: 'string', description: 'Difficulty level (default: "beginner")' },
        { name: 'duration', type: 'number', description: 'Workout duration in minutes (default: 30)' },
        { name: 'generate', type: 'boolean', description: 'Force generation of new program' }
      ],
      example: 'http://localhost:3000/api/workout-programs?type=full-body&difficulty=intermediate&duration=45',
      icon: Zap
    },
    {
      method: 'POST',
      path: '/api/ai/workout',
      description: 'Generate AI-powered workout programs using OpenAI GPT-4',
      parameters: [
        { name: 'workoutType', type: 'string', description: 'Required. Workout type ("full-body", "chest", "back", etc.)' },
        { name: 'difficulty', type: 'string', description: 'Required. Difficulty level ("beginner", "intermediate", "advanced")' },
        { name: 'duration', type: 'number', description: 'Workout duration in minutes (default: 30)' },
        { name: 'userGoals', type: 'string', description: 'User fitness goals (e.g., "build muscle", "lose weight")' },
        { name: 'equipment', type: 'array', description: 'Available equipment (["bodyweight", "dumbbells", "barbell"])' },
        { name: 'injuries', type: 'array', description: 'Any injuries or limitations (["knee pain", "back issues"])' },
        { name: 'experience', type: 'string', description: 'Fitness experience level' }
      ],
      example: 'POST http://localhost:3000/api/ai/workout (with JSON body)',
      icon: Brain
    },
    {
      method: 'GET',
      path: '/api/ai/workout',
      description: 'Generate AI workout with query parameters (simpler version)',
      parameters: [
        { name: 'type', type: 'string', description: 'Required. Workout type' },
        { name: 'difficulty', type: 'string', description: 'Difficulty level (default: "beginner")' },
        { name: 'duration', type: 'number', description: 'Duration in minutes (default: 30)' },
        { name: 'goals', type: 'string', description: 'User fitness goals' }
      ],
      example: 'http://localhost:3000/api/ai/workout?type=legs&difficulty=intermediate&goals=build muscle&duration=45',
      icon: Brain
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Fitness App API Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete REST API for exercise data, workout programs, and AI-powered fitness recommendations.
            All endpoints return JSON responses with comprehensive exercise instructions and images.
          </p>
        </div>

        {/* Base URL */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Base URL</h2>
          <div className="flex items-center space-x-3">
            <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm font-mono flex-1">
              http://localhost:3000
            </code>
            <button
              onClick={() => copyToClipboard('http://localhost:3000', 'base-url')}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              {copiedEndpoint === 'base-url' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-8">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              {/* Endpoint Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                  <endpoint.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      endpoint.method === 'GET'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {endpoint.description}
                  </p>
                </div>
              </div>

              {/* Parameters */}
              {endpoint.parameters.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Parameters:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Name</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Type</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.parameters.map((param, paramIndex) => (
                          <tr key={paramIndex} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 px-3">
                              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                                {param.name}
                              </code>
                            </td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-300">{param.type}</td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-300">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Example */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Example Request:</h4>
                <div className="flex items-center space-x-3">
                  <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm font-mono flex-1 overflow-x-auto">
                    {endpoint.example}
                  </code>
                  <button
                    onClick={() => copyToClipboard(endpoint.example, `endpoint-${index}`)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0"
                  >
                    {copiedEndpoint === `endpoint-${index}` ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                  <a
                    href={endpoint.example}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Response Format */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Response Format</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            All API responses follow a consistent JSON structure:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "data": { /* Exercise data or array of exercises */ },
  "meta": {
    "total": 9,
    "filters": { /* Applied filters */ }
  }
}`}
          </pre>
        </div>

        {/* Exercise Data Structure */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Exercise Data Structure</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Each exercise includes comprehensive data with images, videos, and detailed instructions:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "id": "push-ups",
  "name": "Push-ups",
  "category": "strength",
  "muscleGroups": ["chest", "triceps", "shoulders"],
  "primaryMuscles": ["pectorals"],
  "secondaryMuscles": ["triceps", "anterior deltoids", "core"],
  "difficulty": "beginner",
  "equipment": [],
  "estimatedDuration": 3,
  "restTime": 60,
  "imageUrl": "https://images.unsplash.com/photo-1571019613454...",
  "videoUrl": "https://www.youtube.com/watch?v=IODxDxX7oi4",
  "instructions": {
    "setup": ["Step-by-step setup instructions..."],
    "execution": ["Movement execution steps..."],
    "tips": ["Pro tips for better performance..."],
    "commonMistakes": ["What to avoid..."]
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}