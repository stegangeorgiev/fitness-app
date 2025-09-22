"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar } from "lucide-react";

export function ProgressChart() {
  const weeklyData = [
    { day: 'Mon', weight: 185, calories: 2400 },
    { day: 'Tue', weight: 184.5, calories: 2650 },
    { day: 'Wed', weight: 184.2, calories: 2300 },
    { day: 'Thu', weight: 184.0, calories: 2800 },
    { day: 'Fri', weight: 183.8, calories: 2500 },
    { day: 'Sat', weight: 183.5, calories: 3200 },
    { day: 'Sun', weight: 183.2, calories: 2900 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Weekly Progress</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Weight and calorie tracking
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="h-4 w-4" />
          <span>Last 7 days</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Weight Progress */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Weight Progress (lbs)
          </h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calorie Burn */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Daily Calories Burned
          </h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar 
                  dataKey="calories" 
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}