import { NextRequest, NextResponse } from 'next/server';
import { EXERCISE_DATABASE } from '../../../data/exercises';

// GET /api/exercises/[id] - Get a specific exercise by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Exercise ID is required' 
        },
        { status: 400 }
      );
    }

    const exercise = EXERCISE_DATABASE.find(ex => ex.id === id);

    if (!exercise) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Exercise not found',
          message: `No exercise found with ID: ${id}`
        },
        { status: 404 }
      );
    }

    // Return the exercise with additional metadata
    return NextResponse.json({
      success: true,
      data: {
        ...exercise,
        // Add some computed fields for convenience
        hasImage: !!exercise.imageUrl,
        hasVideo: !!exercise.videoUrl,
        requiresEquipment: exercise.equipment && exercise.equipment.length > 0,
        totalInstructions: 
          exercise.instructions.setup.length + 
          exercise.instructions.execution.length + 
          exercise.instructions.tips.length + 
          exercise.instructions.commonMistakes.length
      }
    });

  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch exercise',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}