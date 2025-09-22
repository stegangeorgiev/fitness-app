import { NextRequest, NextResponse } from 'next/server';
import { EXERCISE_DATABASE, type ExerciseData, type WorkoutType } from '../../data/exercises';

// GET /api/exercises - Get all exercises or filtered by query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters for filtering
    const muscleGroup = searchParams.get('muscleGroup');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const workoutType = searchParams.get('workoutType') as WorkoutType;
    const equipment = searchParams.get('equipment');
    const search = searchParams.get('search');

    let filteredExercises = [...EXERCISE_DATABASE];

    // Filter by muscle group
    if (muscleGroup) {
      filteredExercises = filteredExercises.filter(exercise =>
        exercise.muscleGroups.some(group => 
          group.toLowerCase().includes(muscleGroup.toLowerCase())
        ) ||
        exercise.primaryMuscles.some(muscle =>
          muscle.toLowerCase().includes(muscleGroup.toLowerCase())
        )
      );
    }

    // Filter by difficulty
    if (difficulty) {
      filteredExercises = filteredExercises.filter(exercise =>
        exercise.difficulty === difficulty
      );
    }

    // Filter by category
    if (category) {
      filteredExercises = filteredExercises.filter(exercise =>
        exercise.category === category
      );
    }

    // Filter by equipment requirement
    if (equipment) {
      if (equipment.toLowerCase() === 'none' || equipment.toLowerCase() === 'bodyweight') {
        filteredExercises = filteredExercises.filter(exercise =>
          !exercise.equipment || exercise.equipment.length === 0
        );
      } else {
        filteredExercises = filteredExercises.filter(exercise =>
          exercise.equipment?.some(eq =>
            eq.toLowerCase().includes(equipment.toLowerCase())
          )
        );
      }
    }

    // Text search across name and muscle groups
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredExercises = filteredExercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm) ||
        exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm)) ||
        exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm))
      );
    }

    // Return response with metadata
    return NextResponse.json({
      success: true,
      data: filteredExercises,
      meta: {
        total: filteredExercises.length,
        filters: {
          muscleGroup,
          difficulty,
          category,
          equipment,
          search
        }
      }
    });

  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch exercises',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}