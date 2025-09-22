"use client";

import { Activity, ArrowLeft, History, Calendar } from "lucide-react";
import Link from "next/link";
import { ActiveWorkout } from "../components/ActiveWorkout";
import { useWorkout } from "../context/WorkoutContext";

export default function WorkoutPage() {
  const { state } = useWorkout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Workout Session
                  </h1>
                  {state.currentSession && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {state.isPaused ? "Paused" : "Active"} • {state.currentSession.exercises.length} exercises
                    </p>
                  )}
                </div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-4">
              <Link 
                href="/workout/history"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </Link>
              <Link 
                href="/workout/templates"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Calendar className="h-4 w-4" />
                <span>Templates</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveWorkout />
      </main>
    </div>
  );
}