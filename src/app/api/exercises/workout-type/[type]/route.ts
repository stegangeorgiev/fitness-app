import { NextRequest, NextResponse } from 'next/server';
import { EXERCISE_DATABASE, WORKOUT_TYPES, type WorkoutType } from '../../../../data/exercises';

// GET /api/exercises/workout-type/[type] - Get exercises suitable for a specific workout type
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const difficulty = searchParams.get('difficulty');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    if (!type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Workout type is required' 
        },
        { status: 400 }
      );
    }

    // Validate workout type
    if (!Object.keys(WORKOUT_TYPES).includes(type as WorkoutType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid workout type',
          message: `Valid types are: ${Object.keys(WORKOUT_TYPES).join(', ')}`
        },
        { status: 400 }
      );
    }

    const workoutType = type as WorkoutType;

    // Filter exercises based on workout type
    let filteredExercises = EXERCISE_DATABASE.filter(exercise => {
      switch (workoutType) {
        case 'full-body':
          // Include all exercises for full body workouts
          return true;
        
        case 'chest':
          return exercise.muscleGroups.includes('chest') || 
                 exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes('pectoral'));
        
        case 'back':
          return exercise.muscleGroups.includes('back') || 
                 exercise.primaryMuscles.some(muscle => 
                   muscle.toLowerCase().includes('latissimus') || 
                   muscle.toLowerCase().includes('rhomboid')
                 );
        
        case 'legs':
          return exercise.muscleGroups.some(group => 
                   ['quadriceps', 'hamstrings', 'glutes', 'calves'].includes(group)
                 ) ||
                 exercise.primaryMuscles.some(muscle =>
                   ['quadriceps', 'glutes', 'hamstrings', 'calves'].includes(muscle.toLowerCase())
                 );
        
        case 'core':
          return exercise.muscleGroups.includes('core') ||
                 exercise.primaryMuscles.some(muscle =>
                   muscle.toLowerCase().includes('abdominis') || 
                   muscle.toLowerCase().includes('core')
                 );
        
        case 'arms':
          return exercise.muscleGroups.includes('biceps') || 
                 exercise.muscleGroups.includes('triceps') ||
                 exercise.primaryMuscles.includes('biceps');
        
        case 'shoulders':
          return exercise.muscleGroups.includes('shoulders') ||
                 exercise.primaryMuscles.some(muscle => 
                   muscle.toLowerCase().includes('deltoid')
                 );
        
        default:
          return false;
      }
    });

    // Filter by difficulty if specified
    if (difficulty) {
      filteredExercises = filteredExercises.filter(exercise =>
        exercise.difficulty === difficulty
      );
    }

    // Limit results if specified
    if (limit && limit > 0) {
      filteredExercises = filteredExercises.slice(0, limit);
    }

    // Return response with workout type metadata
    return NextResponse.json({
      success: true,
      data: filteredExercises,
      meta: {
        workoutType: type,
        workoutInfo: WORKOUT_TYPES[workoutType],
        total: filteredExercises.length,
        filters: {
          difficulty,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching exercises for workout type:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch exercises for workout type',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}