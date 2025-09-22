"use client";

import Link from "next/link";
import { Activity, Target, TrendingUp, Zap } from "lucide-react";
import { ProgressChart } from "./components/ProgressChart";
import { AIRecommendations } from "./components/AIRecommendations";
import { QuickStats } from "./components/QuickStats";
import { WorkoutStatus } from "./components/WorkoutStatus";
import { AIInitializer } from "./components/AIInitializer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* AI Initializer - starts AI service in background */}
      <AIInitializer />
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Fitness App
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#dashboard" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                Dashboard
              </a>
              <Link href="/workout" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                Workouts
              </Link>
              <a href="#progress" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                Progress
              </a>
              <a href="#ai-coach" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                AI Coach
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, Fitness Enthusiast! 💪
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to crush your fitness goals today? Let's see what your AI coach recommends.
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Current Workout Status */}
          <div className="lg:col-span-2">
            <WorkoutStatus />
          </div>
          
          {/* AI Recommendations */}
          <div>
            <AIRecommendations />
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProgressChart />
          
          {/* Recent Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Achievements
              </h3>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="bg-green-500 p-2 rounded-full">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">7-Day Streak!</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Consistent workouts this week</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="bg-blue-500 p-2 rounded-full">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Personal Best</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Bench Press: 185 lbs</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="bg-purple-500 p-2 rounded-full">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Goal Completed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Monthly cardio target reached</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
