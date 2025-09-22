import { NextRequest, NextResponse } from 'next/server';
import { AIWorkoutService, AIWorkoutRequest } from '../../../services/aiService';
import { WorkoutType } from '../../../data/exercises';

// POST /api/ai/workout - Generate AI-powered workout using OpenAI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const { workoutType, difficulty, duration, userGoals, equipment, injuries, experience } = body;
    
    if (!workoutType || !difficulty) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Workout type and difficulty are required' 
        },
        { status: 400 }
      );
    }

    // Prepare AI request
    const aiRequest: AIWorkoutRequest = {
      workoutType: workoutType as WorkoutType,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      duration: duration || 30,
      userGoals: userGoals || 'General fitness improvement',
      equipment: equipment || ['bodyweight'],
      injuries: injuries || [],
      experience: experience || difficulty
    };

    // Generate workout using AI
    const aiResponse = await AIWorkoutService.generateWorkoutProgram(aiRequest);
    
    return NextResponse.json({
      success: true,
      data: {
        program: aiResponse.program,
        reasoning: aiResponse.reasoning,
        tips: aiResponse.tips
      },
      meta: {
        aiGenerated: true,
        model: 'gpt-4o-mini',
        timestamp: new Date().toISOString(),
        provider: 'OpenAI via Puter.js'
      }
    });

  } catch (error) {
    console.error('AI workout generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate AI workout',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/ai/workout - Get AI workout with query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const workoutType = searchParams.get('type') as WorkoutType;
    const difficulty = searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced' || 'beginner';
    const duration = searchParams.get('duration') ? parseInt(searchParams.get('duration')!) : 30;
    const userGoals = searchParams.get('goals') || 'General fitness improvement';
    
    if (!workoutType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Workout type is required' 
        },
        { status: 400 }
      );
    }

    // Convert to POST request format
    const aiRequest: AIWorkoutRequest = {
      workoutType,
      difficulty,
      duration,
      userGoals,
      equipment: ['bodyweight', 'dumbbells'],
      injuries: [],
      experience: difficulty
    };

    // Generate workout using AI
    const aiResponse = await AIWorkoutService.generateWorkoutProgram(aiRequest);
    
    return NextResponse.json({
      success: true,
      data: {
        program: aiResponse.program,
        reasoning: aiResponse.reasoning,
        tips: aiResponse.tips
      },
      meta: {
        aiGenerated: true,
        model: 'gpt-4o-mini',
        timestamp: new Date().toISOString(),
        provider: 'OpenAI via Puter.js',
        parameters: { workoutType, difficulty, duration }
      }
    });

  } catch (error) {
    console.error('AI workout generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate AI workout',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}