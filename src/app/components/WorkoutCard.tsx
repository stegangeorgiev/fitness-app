import { Play, Clock, Repeat, CheckCircle } from "lucide-react";

export function WorkoutCard() {
  const todaysWorkout = {
    name: "Upper Body Strength",
    duration: "45 min",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", completed: true },
      { name: "Pull-ups", sets: 3, reps: "6-8", completed: true },
      { name: "Shoulder Press", sets: 3, reps: "10-12", completed: false },
      { name: "Bicep Curls", sets: 3, reps: "12-15", completed: false },
      { name: "Tricep Dips", sets: 3, reps: "10-12", completed: false },
    ],
    progress: 40, // percentage completed
  };

  const completedExercises = todaysWorkout.exercises.filter(ex => ex.completed).length;
  const totalExercises = todaysWorkout.exercises.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Today's Workout
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{todaysWorkout.duration}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Repeat className="h-4 w-4" />
              <span>{completedExercises}/{totalExercises} exercises</span>
            </span>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors">
          <Play className="h-4 w-4" />
          <span>Start Workout</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {todaysWorkout.name}
          </span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {todaysWorkout.progress}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${todaysWorkout.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {todaysWorkout.exercises.map((exercise, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              exercise.completed 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              {exercise.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
              )}
              <div>
                <p className={`font-medium ${
                  exercise.completed 
                    ? 'text-green-800 dark:text-green-200 line-through' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {exercise.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exercise.sets} sets × {exercise.reps} reps
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}