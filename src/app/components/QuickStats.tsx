import { Calendar, Clock, Flame, Trophy } from "lucide-react";

export function QuickStats() {
  const stats = [
    {
      icon: Flame,
      label: "Calories Burned",
      value: "2,847",
      change: "+12%",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: Clock,
      label: "Workout Time",
      value: "4h 32m",
      change: "+8%", 
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Trophy,
      label: "Goals Achieved",
      value: "12/15",
      change: "+3",
      color: "text-green-600 dark:text-green-400", 
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Calendar,
      label: "Active Days",
      value: "23",
      change: "+2",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {stat.change}
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}