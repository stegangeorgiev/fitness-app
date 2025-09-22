import { NextRequest, NextResponse } from 'next/server';
import { EXERCISE_DATABASE, WORKOUT_TYPES, type WorkoutType, type ExerciseData, type WorkoutProgram } from '../../data/exercises';

// Helper function to generate intelligent workout program
// Note: This is an algorithmic program generator, not true AI
function generateWorkoutProgram(
  type: WorkoutType, 
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  duration: number = 30
): WorkoutProgram {
  
  // Filter exercises based on workout type with better logic
  let availableExercises = EXERCISE_DATABASE.filter((exercise: ExerciseData) => {
    switch (type) {
      case 'full-body':
        return true;
      case 'chest':
        return exercise.muscleGroups.includes('chest') || 
               exercise.primaryMuscles.some((muscle: string) => muscle.toLowerCase().includes('pectoral'));
      case 'back':
        return exercise.muscleGroups.includes('back') ||
               exercise.primaryMuscles.some((muscle: string) => 
                 muscle.toLowerCase().includes('latissimus') || 
                 muscle.toLowerCase().includes('rhomboid'));
      case 'legs':
        // Fixed: Include all leg exercises properly
        return exercise.muscleGroups.some((group: string) => 
                 ['quadriceps', 'hamstrings', 'glutes', 'calves', 'legs'].includes(group)) ||
               exercise.primaryMuscles.some((muscle: string) =>
                 ['quadriceps', 'glutes', 'hamstrings', 'calves'].includes(muscle.toLowerCase()));
      case 'core':
        return exercise.muscleGroups.includes('core') ||
               exercise.primaryMuscles.some((muscle: string) =>
                 muscle.toLowerCase().includes('abdominis') || 
                 muscle.toLowerCase().includes('core'));
      case 'arms':
        return exercise.muscleGroups.includes('biceps') || 
               exercise.muscleGroups.includes('triceps') ||
               exercise.primaryMuscles.includes('biceps');
      case 'shoulders':
        return exercise.muscleGroups.includes('shoulders') ||
               exercise.primaryMuscles.some((muscle: string) => 
                 muscle.toLowerCase().includes('deltoid'));
      default:
        return false;
    }
  });

  console.log(`Found ${availableExercises.length} exercises for ${type}:`, availableExercises.map(ex => ex.name));

  // Filter by difficulty with STRICT level enforcement
  availableExercises = availableExercises.filter((exercise: ExerciseData) => {
    switch (difficulty) {
      case 'beginner':
        // Beginners should ONLY get beginner exercises
        return exercise.difficulty === 'beginner';
      case 'intermediate':
        // Intermediate can do beginner and intermediate exercises
        return exercise.difficulty === 'beginner' || exercise.difficulty === 'intermediate';
      case 'advanced':
        // Advanced can do all exercises
        return true;
      default:
        return exercise.difficulty === 'beginner'; // Default to safest
    }
  });

  // Ensure we have minimum exercises for the difficulty level
  const minRequirements = {
    beginner: 3,
    intermediate: 4,
    advanced: 5
  };

  const maxRequirements = {
    beginner: 4,
    intermediate: 6,
    advanced: 8
  };

  const minRequired = minRequirements[difficulty] || 3;
  const maxAllowed = maxRequirements[difficulty] || 4;

  // Ensure we have enough exercises
  if (availableExercises.length === 0) {
    // Fallback: include some basic exercises
    availableExercises = EXERCISE_DATABASE.filter(ex => ex.difficulty === 'beginner').slice(0, 3);
  }

  if (availableExercises.length < minRequired) {
    console.warn(`Insufficient exercises for ${difficulty} level ${type}. Found: ${availableExercises.length}, Required: ${minRequired}`);
    // Try to add more appropriate exercises if needed
    if (difficulty === 'beginner') {
      const additionalExercises = EXERCISE_DATABASE.filter(ex => 
        ex.difficulty === 'intermediate' && 
        !availableExercises.some(existing => existing.id === ex.id)
      ).slice(0, minRequired - availableExercises.length);
      availableExercises.push(...additionalExercises);
    }
  }

  // Determine number of exercises based on difficulty level requirements and duration
  let numExercises = minRequired; // Start with minimum required
  
  // Adjust based on duration
  if (duration <= 15) numExercises = Math.max(minRequired, 3);
  else if (duration <= 25) numExercises = Math.max(minRequired, 4);
  else if (duration <= 35) numExercises = Math.max(minRequired, 5);
  else if (duration <= 50) numExercises = Math.max(minRequired, 6);
  else numExercises = Math.max(minRequired, 7);
  
  // Ensure we don't exceed maximum for difficulty level
  numExercises = Math.min(numExercises, maxAllowed);
  
  // Ensure we don't ask for more exercises than available
  numExercises = Math.min(numExercises, availableExercises.length);

  // Intelligent exercise selection (not just random)
  let selectedExercises: ExerciseData[] = [];
  
  // For leg workouts, ensure we get compound movements first
  if (type === 'legs') {
    const compoundMovements = availableExercises.filter(ex => 
      ex.muscleGroups.includes('quadriceps') && ex.muscleGroups.includes('glutes')
    );
    const isolationMovements = availableExercises.filter(ex => 
      !ex.muscleGroups.includes('quadriceps') || !ex.muscleGroups.includes('glutes')
    );
    
    // Select compound movements first, then isolation
    selectedExercises = [
      ...compoundMovements.slice(0, Math.ceil(numExercises * 0.7)),
      ...isolationMovements.slice(0, Math.floor(numExercises * 0.3))
    ].slice(0, numExercises);
  } else {
    // For other workout types, use weighted random selection
    const shuffled = availableExercises.sort(() => 0.5 - Math.random());
    selectedExercises = shuffled.slice(0, numExercises);
  }

  // If we still don't have enough, fill with remaining exercises
  if (selectedExercises.length < numExercises) {
    const remaining = availableExercises.filter(ex => 
      !selectedExercises.find(selected => selected.id === ex.id)
    );
    selectedExercises.push(...remaining.slice(0, numExercises - selectedExercises.length));
  }

  // Generate sets and reps based on difficulty and exercise type with strict level adherence
  const exerciseProgram = selectedExercises.map((exercise: ExerciseData) => {
    let sets = 3;
    let reps = "10-12";
    let restBetweenSets = 60;

    // Adjust based on difficulty level with proper requirements
    if (difficulty === 'beginner') {
      sets = 2; // Beginners start with fewer sets
      reps = "8-10"; // Lower rep range for beginners
      restBetweenSets = 75; // Longer rest for beginners
    } else if (difficulty === 'intermediate') {
      sets = 3; // Standard sets for intermediate
      reps = "10-12"; // Standard rep range
      restBetweenSets = 60; // Standard rest
    } else if (difficulty === 'advanced') {
      sets = 4; // More sets for advanced
      reps = "12-15"; // Higher rep range for advanced
      restBetweenSets = 45; // Shorter rest for advanced
    }

    // Adjust based on exercise category
    if (exercise.category === 'cardio') {
      if (difficulty === 'beginner') {
        reps = "20 seconds";
        restBetweenSets = 45;
      } else if (difficulty === 'intermediate') {
        reps = "30 seconds";
        restBetweenSets = 30;
      } else {
        reps = "45 seconds";
        restBetweenSets = 30;
      }
    } else if (exercise.id === 'plank') {
      if (difficulty === 'beginner') {
        reps = "20-30 seconds hold";
        restBetweenSets = 60;
      } else if (difficulty === 'intermediate') {
        reps = "30-45 seconds hold";
        restBetweenSets = 45;
      } else {
        reps = "45-60 seconds hold";
        restBetweenSets = 45;
      }
    }

    return {
      exercise,
      sets,
      reps,
      weight: exercise.equipment?.length ? (difficulty === 'beginner' ? 'light' : difficulty === 'intermediate' ? 'moderate' : 'moderate-heavy') : 'bodyweight',
      restBetweenSets
    };
  });

  return {
    id: `smart-${type}-${difficulty}-${Date.now()}`,
    name: `Smart ${WORKOUT_TYPES[type].name} Workout (${difficulty})`,
    type,
    difficulty,
    duration,
    exercises: exerciseProgram,
    description: `Algorithmically-generated ${difficulty} level ${WORKOUT_TYPES[type].name.toLowerCase()} workout designed to ${WORKOUT_TYPES[type].description.toLowerCase()}. Uses intelligent exercise selection and progression.`,
    benefits: [
      `Targets ${type === 'full-body' ? 'all major muscle groups' : WORKOUT_TYPES[type].name.toLowerCase()}`,
      `Optimized for ${difficulty} fitness level`,
      `Estimated ${duration} minute duration`,
      'Progressive difficulty scaling',
      'Proper rest intervals included',
      'Intelligent exercise selection algorithm'
    ],
    aiGenerated: false // Being honest - this is algorithmic, not AI
  };
}

// GET /api/workout-programs - Generate or get workout programs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') as WorkoutType;
    const difficulty = searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced' || 'beginner';
    const duration = searchParams.get('duration') ? parseInt(searchParams.get('duration')!) : 30;
    const generate = searchParams.get('generate') === 'true';

    if (!type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Workout type is required',
          availableTypes: Object.keys(WORKOUT_TYPES)
        },
        { status: 400 }
      );
    }

    if (!Object.keys(WORKOUT_TYPES).includes(type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid workout type',
          availableTypes: Object.keys(WORKOUT_TYPES)
        },
        { status: 400 }
      );
    }

    // Generate AI workout program
    if (generate) {
      const program = generateWorkoutProgram(type, difficulty, duration);
      
      return NextResponse.json({
        success: true,
        data: program,
        meta: {
          generated: true,
          timestamp: new Date().toISOString(),
          parameters: { type, difficulty, duration }
        }
      });
    }

    // For now, just return the AI-generated program since we don't have predefined ones
    const program = generateWorkoutProgram(type, difficulty, duration);
    
    return NextResponse.json({
      success: true,
      data: program,
      meta: {
        generated: true,
        timestamp: new Date().toISOString(),
        parameters: { type, difficulty, duration }
      }
    });

  } catch (error) {
    console.error('Error generating workout program:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate workout program',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}