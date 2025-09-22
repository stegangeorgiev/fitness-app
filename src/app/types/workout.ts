export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'sports';
  muscleGroups: string[];
  instructions?: string;
  equipment?: string[];
}

export interface WorkoutSet {
  id: string;
  reps?: number;
  weight?: number;
  duration?: number; // for cardio exercises in seconds
  distance?: number; // for cardio exercises in meters/miles
  restTime?: number; // rest time after this set in seconds
  completed: boolean;
  completedAt?: Date;
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
  targetSets: number;
  targetReps?: number;
  targetWeight?: number;
  targetDuration?: number;
}

export interface WorkoutSession {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  startTime?: Date;
  endTime?: Date;
  duration?: number; // total duration in seconds
  isActive: boolean;
  notes?: string;
  completed: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Omit<WorkoutExercise, 'sets'>[];
  category: 'strength' | 'cardio' | 'mixed' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in minutes
}

export type WorkoutAction = 
  | { type: 'START_WORKOUT'; payload: WorkoutSession }
  | { type: 'END_WORKOUT' }
  | { type: 'PAUSE_WORKOUT' }
  | { type: 'RESUME_WORKOUT' }
  | { type: 'ADD_SET'; payload: { exerciseId: string; set: WorkoutSet } }
  | { type: 'UPDATE_SET'; payload: { exerciseId: string; setId: string; updates: Partial<WorkoutSet> } }
  | { type: 'DELETE_SET'; payload: { exerciseId: string; setId: string } }
  | { type: 'ADD_EXERCISE'; payload: WorkoutExercise }
  | { type: 'UPDATE_EXERCISE'; payload: { exerciseId: string; updates: Partial<WorkoutExercise> } }
  | { type: 'DELETE_EXERCISE'; payload: { exerciseId: string } };