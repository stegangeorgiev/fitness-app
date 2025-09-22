import { Brain, Zap, Star, ChevronRight } from "lucide-react";

export function AIRecommendations() {
  const recommendations = [
    {
      type: "Workout Suggestion",
      title: "Focus on Legs Today",
      description: "Your upper body has been worked hard this week. Time to balance with leg exercises.",
      confidence: 95,
      action: "View Leg Workout",
      icon: Zap,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      type: "Recovery Tip",
      title: "Rest Day Recommended",
      description: "Your intensity has been high. Consider active recovery or a rest day tomorrow.",
      confidence: 88,
      action: "Plan Recovery",
      icon: Star,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      type: "Nutrition Insight",
      title: "Increase Protein Intake",
      description: "Based on your strength goals, consider adding 20g more protein daily.",
      confidence: 92,
      action: "View Meal Plans",
      icon: Brain,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Coach Insights</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Personalized recommendations
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${rec.bg}`}>
                <rec.icon className={`h-4 w-4 ${rec.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {rec.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {rec.confidence}% confidence
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {rec.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {rec.description}
                </p>
                <button className="flex items-center space-x-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  <span>{rec.action}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]">
          Get More AI Insights
        </button>
      </div>
    </div>
  );
}