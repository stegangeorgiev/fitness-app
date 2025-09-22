import axios from 'axios';
import { ExerciseData, WorkoutProgram, WorkoutType } from '../data/exercises';

// Base API configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000',
  timeout: 10000,
});

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    filters?: Record<string, any>;
    generated?: boolean;
    timestamp?: string;
  };
  error?: string;
  message?: string;
}

export interface ExerciseFilters {
  muscleGroup?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: 'strength' | 'cardio' | 'flexibility' | 'sports';
  equipment?: string;
  search?: string;
}

export interface WorkoutProgramRequest {
  type: WorkoutType;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  generate?: boolean;
}

// Enhanced exercise data with computed fields
export interface EnhancedExerciseData extends ExerciseData {
  hasImage?: boolean;
  hasVideo?: boolean;
  requiresEquipment?: boolean;
  totalInstructions?: number;
}

/**
 * Exercise API Service
 */
export class ExerciseService {
  /**
   * Get all exercises with optional filtering
   */
  static async getExercises(filters?: ExerciseFilters): Promise<ApiResponse<ExerciseData[]>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get(`/api/exercises?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw new Error('Failed to fetch exercises');
    }
  }

  /**
   * Get a specific exercise by ID
   */
  static async getExerciseById(id: string): Promise<ApiResponse<EnhancedExerciseData>> {
    try {
      const response = await api.get(`/api/exercises/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise ${id}:`, error);
      throw new Error(`Failed to fetch exercise: ${id}`);
    }
  }

  /**
   * Get exercises suitable for a specific workout type
   */
  static async getExercisesByWorkoutType(
    type: WorkoutType,
    options?: { difficulty?: string; limit?: number }
  ): Promise<ApiResponse<ExerciseData[]>> {
    try {
      const params = new URLSearchParams();
      
      if (options?.difficulty) {
        params.append('difficulty', options.difficulty);
      }
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }

      const response = await api.get(`/api/exercises/workout-type/${type}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercises for workout type ${type}:`, error);
      throw new Error(`Failed to fetch exercises for workout type: ${type}`);
    }
  }

  /**
   * Search exercises by text
   */
  static async searchExercises(query: string): Promise<ApiResponse<ExerciseData[]>> {
    return this.getExercises({ search: query });
  }

  /**
   * Get exercises by muscle group
   */
  static async getExercisesByMuscleGroup(muscleGroup: string): Promise<ApiResponse<ExerciseData[]>> {
    return this.getExercises({ muscleGroup });
  }

  /**
   * Get exercises by difficulty
   */
  static async getExercisesByDifficulty(
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<ApiResponse<ExerciseData[]>> {
    return this.getExercises({ difficulty });
  }

  /**
   * Get bodyweight exercises (no equipment required)
   */
  static async getBodyweightExercises(): Promise<ApiResponse<ExerciseData[]>> {
    return this.getExercises({ equipment: 'none' });
  }
}

/**
 * Workout Program API Service
 */
export class WorkoutProgramService {
  /**
   * Generate or get a workout program
   */
  static async getWorkoutProgram(request: WorkoutProgramRequest): Promise<ApiResponse<WorkoutProgram>> {
    try {
      const params = new URLSearchParams();
      params.append('type', request.type);
      
      if (request.difficulty) {
        params.append('difficulty', request.difficulty);
      }
      if (request.duration) {
        params.append('duration', request.duration.toString());
      }
      if (request.generate) {
        params.append('generate', 'true');
      }

      const response = await api.get(`/api/workout-programs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error generating workout program:', error);
      throw new Error('Failed to generate workout program');
    }
  }

  /**
   * Generate AI workout program with specific parameters
   */
  static async generateAIWorkout(
    type: WorkoutType,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
    duration: number = 30
  ): Promise<ApiResponse<WorkoutProgram>> {
    return this.getWorkoutProgram({
      type,
      difficulty,
      duration,
      generate: true
    });
  }
}

/**
 * Combined API Service with common utility methods
 */
export class FitnessApiService {
  static exercise = ExerciseService;
  static workoutProgram = WorkoutProgramService;

  /**
   * Get comprehensive workout data for a specific type
   */
  static async getWorkoutData(type: WorkoutType, difficulty?: string) {
    try {
      const [exercisesResponse, programResponse] = await Promise.all([
        ExerciseService.getExercisesByWorkoutType(type, { difficulty }),
        WorkoutProgramService.generateAIWorkout(type, difficulty as any)
      ]);

      return {
        exercises: exercisesResponse.data,
        program: programResponse.data,
        meta: {
          exerciseCount: exercisesResponse.meta?.total,
          workoutType: type,
          difficulty
        }
      };
    } catch (error) {
      console.error(`Error fetching workout data for ${type}:`, error);
      throw new Error(`Failed to fetch workout data for ${type}`);
    }
  }

  /**
   * Get exercise recommendations based on user preferences
   */
  static async getExerciseRecommendations(preferences: {
    muscleGroups?: string[];
    difficulty?: string;
    equipment?: string[];
    duration?: number;
  }) {
    try {
      const recommendations = [];

      // Get exercises for each preferred muscle group
      if (preferences.muscleGroups) {
        for (const muscleGroup of preferences.muscleGroups) {
          const response = await ExerciseService.getExercisesByMuscleGroup(muscleGroup);
          recommendations.push(...response.data);
        }
      }

      // Filter by difficulty if specified
      let filtered = recommendations;
      if (preferences.difficulty) {
        filtered = recommendations.filter(ex => ex.difficulty === preferences.difficulty);
      }

      // Filter by equipment if specified
      if (preferences.equipment) {
        if (preferences.equipment.includes('none')) {
          filtered = filtered.filter(ex => !ex.equipment || ex.equipment.length === 0);
        } else {
          filtered = filtered.filter(ex => 
            ex.equipment?.some(eq => preferences.equipment!.includes(eq))
          );
        }
      }

      // Remove duplicates
      const unique = filtered.filter((exercise, index, self) => 
        index === self.findIndex(ex => ex.id === exercise.id)
      );

      return {
        success: true,
        data: unique,
        meta: {
          total: unique.length,
          preferences
        }
      };
    } catch (error) {
      console.error('Error getting exercise recommendations:', error);
      throw new Error('Failed to get exercise recommendations');
    }
  }
}

// Export main service
export default FitnessApiService;