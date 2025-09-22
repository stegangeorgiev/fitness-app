import { ExerciseData, WorkoutProgram, WorkoutType, EXERCISE_DATABASE, WORKOUT_TYPES } from '../data/exercises';

// Declare global puter object
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options?: { 
          model?: string; 
          temperature?: number; 
          max_tokens?: number;
          tools?: any[];
        }) => Promise<any>;
      };
    };
  }
}

export interface AIWorkoutRequest {
  workoutType: WorkoutType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  userGoals?: string;
  equipment?: string[];
  injuries?: string[];
  experience?: string;
}

export interface AIWorkoutResponse {
  program: WorkoutProgram;
  reasoning: string;
  tips: string[];
}

export class AIWorkoutService {
  private static readonly DEFAULT_MODEL = 'gpt-4o-mini';
  private static isInitialized = false;
  private static initializationPromise: Promise<boolean> | null = null;
  private static preInitStarted = false;
  private static lastWorkoutExercises: Map<string, string[]> = new Map(); // Track recent exercises by workout type
  
  /**
   * Pre-initialize AI service silently in the background
   */
  static async preInitializeAI(): Promise<void> {
    if (this.preInitStarted) return;
    this.preInitStarted = true;
    
    // Start initialization in background without blocking
    setTimeout(async () => {
      try {
        await this.initializeAI();
      } catch (error) {
        console.log('Pre-initialization completed with fallback mode');
      }
    }, 100);
  }

  /**
   * Check if AI is ready without triggering initialization
   */
  static isAIReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Initialize Puter.js AI service with proper error handling
   */
  private static async initializeAI(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = new Promise(async (resolve) => {
      try {
        // Check if Puter.js is loaded
        if (typeof window === 'undefined' || typeof window.puter === 'undefined') {
          console.log('Puter.js not available - using smart algorithm');
          resolve(false);
          return;
        }

        // Test AI availability with a minimal request and shorter timeout
        console.log('Initializing AI service...');
        const testResponse = await Promise.race([
          window.puter.ai.chat('Hi', {
            model: this.DEFAULT_MODEL,
            max_tokens: 3
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Initialization timeout')), 8000)
          )
        ]);

        if (testResponse) {
          console.log('✅ AI service ready - OpenAI GPT-4o-mini connected');
          this.isInitialized = true;
          resolve(true);
        } else {
          console.log('🔄 Using smart algorithm mode');
          resolve(false);
        }
      } catch (error: any) {
        // Detect if it's likely a permission/verification issue
        const isPermissionIssue = error?.message?.includes('verification') || 
                                error?.message?.includes('permission') ||
                                error?.message?.includes('popup');
        
        if (isPermissionIssue) {
          console.log('🔐 AI verification required - will prompt user when needed');
        } else {
          console.log('🔄 AI not available - using smart algorithm:', error?.message || 'Unknown error');
        }
        resolve(false);
      }
    });

    return this.initializationPromise;
  }
  
  /**
   * Generate an AI-powered workout program using real OpenAI models via Puter.js
   */
  static async generateWorkoutProgram(request: AIWorkoutRequest): Promise<AIWorkoutResponse> {
    try {
      // Try to initialize AI service first
      const aiAvailable = await this.initializeAI();
      
      if (!aiAvailable) {
        console.log('AI service not available, using intelligent fallback');
        return this.generateFallbackWorkout(request);
      }

      // Prepare the AI prompt with context about available exercises
      const availableExercises = this.getAvailableExercises(request.workoutType, request.difficulty);
      const exerciseList = availableExercises.map(ex => 
        `- ${ex.name}: ${ex.muscleGroups.join(', ')} (${ex.difficulty}, ${ex.equipment?.length ? ex.equipment.join(', ') : 'bodyweight'})`
      ).join('\n');

      const prompt = this.buildAIPrompt(request, exerciseList);

      // Call the real OpenAI API through Puter.js with extended timeout
      const response = await Promise.race([
        window.puter.ai.chat(prompt, {
          model: this.DEFAULT_MODEL,
          temperature: 0.7,
          max_tokens: 1500
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI request timeout')), 30000)
        )
      ]);

      // Parse the AI response
      const aiWorkout = this.parseAIResponse(response, request, availableExercises);
      
      return aiWorkout;

    } catch (error) {
      console.error('AI Workout Generation Error:', error);
      // Fallback to algorithmic generation if AI fails
      console.log('Using intelligent fallback due to AI error');
      return this.generateFallbackWorkout(request);
    }
  }

  /**
   * Get exercises available for the specified workout type and difficulty
   */
  private static getAvailableExercises(workoutType: WorkoutType, difficulty: string): ExerciseData[] {
    let exercises = EXERCISE_DATABASE.filter((exercise: ExerciseData) => {
      // First filter by workout type
      let matchesType = false;
      switch (workoutType) {
        case 'full-body':
          matchesType = true;
          break;
        case 'chest':
          matchesType = exercise.muscleGroups.includes('chest') || 
                      exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes('pectoral'));
          break;
        case 'back':
          matchesType = exercise.muscleGroups.includes('back') ||
                      exercise.primaryMuscles.some(muscle => 
                        muscle.toLowerCase().includes('latissimus') || 
                        muscle.toLowerCase().includes('rhomboid'));
          break;
        case 'legs':
          matchesType = exercise.muscleGroups.some(group => 
                        ['quadriceps', 'hamstrings', 'glutes', 'calves', 'legs'].includes(group)) ||
                      exercise.primaryMuscles.some(muscle =>
                        ['quadriceps', 'glutes', 'hamstrings', 'calves'].includes(muscle.toLowerCase()));
          break;
        case 'core':
          matchesType = exercise.muscleGroups.includes('core') ||
                      exercise.primaryMuscles.some(muscle =>
                        muscle.toLowerCase().includes('abdominis') || 
                        muscle.toLowerCase().includes('core'));
          break;
        case 'arms':
          matchesType = exercise.muscleGroups.includes('biceps') || 
                      exercise.muscleGroups.includes('triceps') ||
                      exercise.primaryMuscles.includes('biceps');
          break;
        case 'shoulders':
          matchesType = exercise.muscleGroups.includes('shoulders') ||
                      exercise.primaryMuscles.some(muscle => 
                        muscle.toLowerCase().includes('deltoid'));
          break;
      }

      return matchesType;
    });

    // Debug: Log found exercises for core workouts
    if (workoutType === 'core') {
      console.log(`🔍 Found ${exercises.length} core exercises:`, exercises.map(ex => `${ex.name} (${ex.difficulty})`));
    }

    // Apply STRICT difficulty filtering based on level
    const filteredByDifficulty = exercises.filter((exercise: ExerciseData) => {
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
          return exercise.difficulty === 'beginner'; // Default to safest option
      }
    });

    // Debug: Log filtered exercises for core workouts
    if (workoutType === 'core') {
      console.log(`🎯 After difficulty filtering (${difficulty}): ${filteredByDifficulty.length} exercises:`, 
        filteredByDifficulty.map(ex => `${ex.name} (${ex.difficulty})`));
    }

    // Ensure we have minimum exercises for each level
    const minRequirements = {
      beginner: 3,
      intermediate: 4, 
      advanced: 5
    };

    const minRequired = minRequirements[difficulty as keyof typeof minRequirements] || 3;

    if (filteredByDifficulty.length < minRequired) {
      console.warn(`Insufficient ${difficulty} level exercises for ${workoutType}. Found: ${filteredByDifficulty.length}, Required: ${minRequired}`);
      
      // If we don't have enough exercises at the strict level, gradually expand
      if (difficulty === 'beginner' && filteredByDifficulty.length < minRequired) {
        // For beginners, we might need to include some intermediate exercises if absolutely necessary
        const additionalExercises = exercises.filter(ex => 
          ex.difficulty === 'intermediate' && 
          !filteredByDifficulty.some(existing => existing.id === ex.id)
        ).slice(0, minRequired - filteredByDifficulty.length);
        
        return [...filteredByDifficulty, ...additionalExercises];
      }
      
      // For intermediate and advanced, if we don't have enough, include more beginner exercises
      if ((difficulty === 'intermediate' || difficulty === 'advanced') && filteredByDifficulty.length < minRequired) {
        const beginnerExercises = exercises.filter(ex => 
          ex.difficulty === 'beginner' && 
          !filteredByDifficulty.some(existing => existing.id === ex.id)
        );
        
        const additionalNeeded = minRequired - filteredByDifficulty.length;
        const additionalExercises = beginnerExercises.slice(0, additionalNeeded);
        
        console.log(`Adding ${additionalExercises.length} beginner exercises to meet ${difficulty} minimum requirements`);
        return [...filteredByDifficulty, ...additionalExercises];
      }
    }

    return filteredByDifficulty;
  }

  /**
   * Build the AI prompt with context and instructions
   */
  private static buildAIPrompt(request: AIWorkoutRequest, exerciseList: string): string {
    const levelRequirements = {
      beginner: {
        minExercises: 3,
        maxExercises: 4,
        sets: '2-3 sets',
        reps: '8-12 reps',
        focus: 'basic movements, proper form, building foundation'
      },
      intermediate: {
        minExercises: 4,
        maxExercises: 6,
        sets: '3-4 sets', 
        reps: '10-15 reps',
        focus: 'progressive overload, compound movements, increased volume'
      },
      advanced: {
        minExercises: 5,
        maxExercises: 8,
        sets: '4-5 sets',
        reps: '12-20 reps or advanced techniques',
        focus: 'complex movements, high intensity, advanced techniques'
      }
    };

    const currentLevel = levelRequirements[request.difficulty];
    
    // Get previously used exercises for variety
    const workoutKey = `${request.workoutType}-${request.difficulty}`;
    const previousExercises = this.lastWorkoutExercises.get(workoutKey) || [];
    const varietyInstruction = previousExercises.length > 0 
      ? `\n\n**EXERCISE VARIETY REQUIREMENT:**\nTo ensure workout variety, try to select AT LEAST 2-3 DIFFERENT exercises from the previous workout. Previous exercises were: ${previousExercises.join(', ')}. Change at least 50-70% of exercises for optimal training variety.`
      : '';

    return `You are an expert personal trainer and exercise physiologist. Create a personalized workout program with STRICT adherence to fitness level requirements.

**WORKOUT REQUIREMENTS:**
- Workout Type: ${WORKOUT_TYPES[request.workoutType].name} (${WORKOUT_TYPES[request.workoutType].description})
- Difficulty Level: ${request.difficulty.toUpperCase()}
- Duration: ${request.duration} minutes
- User Goals: ${request.userGoals || 'General fitness improvement'}
- Available Equipment: ${request.equipment?.join(', ') || 'Bodyweight only'}
- Injuries/Limitations: ${request.injuries?.join(', ') || 'None specified'}
- Experience Level: ${request.experience || request.difficulty}

**${request.difficulty.toUpperCase()} LEVEL REQUIREMENTS:**
- Minimum Exercises: ${currentLevel.minExercises}
- Maximum Exercises: ${currentLevel.maxExercises}
- Recommended Sets: ${currentLevel.sets}
- Recommended Reps: ${currentLevel.reps}
- Focus: ${currentLevel.focus}

**AVAILABLE EXERCISES (FILTERED FOR ${request.difficulty.toUpperCase()} LEVEL):**
${exerciseList}${varietyInstruction}

**CRITICAL INSTRUCTIONS:**
1. SELECT EXACTLY ${currentLevel.minExercises}-${currentLevel.maxExercises} exercises from the provided list
2. ALL selected exercises MUST be appropriate for ${request.difficulty} level
3. NO exercises above the user's difficulty level
4. Ensure proper exercise progression and muscle balance
5. Consider the specified duration when planning rest periods
6. Provide specific reasoning for each exercise selection
7. Include safety considerations for the fitness level
8. PRIORITIZE EXERCISE VARIETY - change at least 2-3 exercises from previous workouts

**RESPONSE FORMAT (JSON ONLY):**
{
  "selectedExercises": [
    {
      "exerciseName": "Exercise Name (MUST match exactly from available list)",
      "sets": ${currentLevel.sets.split(' ')[0].split('-')[0]},
      "reps": "${currentLevel.reps.split(' ')[0]}",
      "restBetweenSets": 60,
      "weight": "bodyweight/light/moderate",
      "notes": "${request.difficulty} specific form cues and safety tips",
      "difficultyJustification": "Why this exercise is appropriate for ${request.difficulty} level"
    }
  ],
  "reasoning": "Explain why you selected these specific exercises for a ${request.difficulty} trainee and how they meet the minimum requirements",
  "levelAppropriate": true,
  "tips": [
    "${request.difficulty}-specific form tip",
    "${request.difficulty}-specific progression advice", 
    "${request.difficulty}-specific safety consideration"
  ],
  "estimatedDuration": ${request.duration}
}

CRITICAL: Respond ONLY with valid JSON. Ensure ALL exercises are appropriate for ${request.difficulty} level and meet the minimum count requirement.`;
  }

  /**
   * Parse the AI response and create a WorkoutProgram object
   */
  private static parseAIResponse(aiResponse: any, request: AIWorkoutRequest, availableExercises: ExerciseData[]): AIWorkoutResponse {
    try {
      // Extract JSON from AI response
      const responseText = typeof aiResponse === 'string' ? aiResponse : aiResponse.message?.content || aiResponse.content || '';
      
      // Find JSON in the response (handle cases where AI adds extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const aiData = JSON.parse(jsonMatch[0]);

      // Validate AI followed difficulty requirements
      const levelRequirements = {
        beginner: { min: 3, max: 4 },
        intermediate: { min: 4, max: 6 },
        advanced: { min: 5, max: 8 }
      };

      const requirements = levelRequirements[request.difficulty];
      const exerciseCount = aiData.selectedExercises?.length || 0;

      if (exerciseCount < requirements.min) {
        console.warn(`AI selected ${exerciseCount} exercises, but ${request.difficulty} level requires minimum ${requirements.min}`);
        throw new Error(`Insufficient exercises for ${request.difficulty} level. AI selected ${exerciseCount}, minimum required: ${requirements.min}`);
      }

      if (exerciseCount > requirements.max) {
        console.warn(`AI selected ${exerciseCount} exercises, but ${request.difficulty} level maximum is ${requirements.max}. Truncating.`);
        aiData.selectedExercises = aiData.selectedExercises.slice(0, requirements.max);
      }

      // Map AI selected exercises to our exercise objects and validate difficulty
      const programExercises = aiData.selectedExercises.map((aiExercise: any, index: number) => {
        const exercise = availableExercises.find(ex => 
          ex.name.toLowerCase() === aiExercise.exerciseName.toLowerCase()
        );
        
        if (!exercise) {
          console.warn(`Exercise not found: ${aiExercise.exerciseName}`);
          return null;
        }

        // Validate exercise difficulty is appropriate for user level
        const isAppropriate = this.validateExerciseDifficulty(exercise, request.difficulty);
        if (!isAppropriate) {
          console.warn(`Exercise ${exercise.name} (${exercise.difficulty}) not appropriate for ${request.difficulty} level`);
          return null;
        }

        return {
          exercise,
          sets: this.validateSets(aiExercise.sets, request.difficulty),
          reps: this.validateReps(aiExercise.reps, request.difficulty),
          weight: aiExercise.weight || 'bodyweight',
          restBetweenSets: this.validateRestTime(aiExercise.restBetweenSets, request.difficulty),
          notes: aiExercise.notes,
          difficultyJustification: aiExercise.difficultyJustification
        };
      }).filter(Boolean);

      // Final validation - ensure we still have minimum exercises after filtering
      if (programExercises.length < requirements.min) {
        console.warn(`After validation, only ${programExercises.length} appropriate exercises remain, but ${request.difficulty} level requires ${requirements.min}. Falling back to smart algorithm.`);
        // Instead of throwing error, fall back to smart algorithm which has better exercise selection
        return this.generateFallbackWorkout(request);
      }

      // Create the workout program
      const program: WorkoutProgram = {
        id: `ai-workout-${request.workoutType}-${Date.now()}`,
        name: `AI ${WORKOUT_TYPES[request.workoutType].name} Workout (${request.difficulty})`,
        type: request.workoutType,
        difficulty: request.difficulty,
        duration: aiData.estimatedDuration || request.duration,
        exercises: programExercises,
        description: `AI-generated ${request.difficulty} level ${request.workoutType} workout with ${programExercises.length} exercises, specifically designed for your fitness level and goals.`,
        benefits: [
          `Perfectly tailored to ${request.difficulty} fitness level`,
          `${programExercises.length} exercises meeting minimum ${request.difficulty} requirements`,
          `AI-optimized for ${request.workoutType} development`,
          `Scientifically-backed exercise selection and progression`,
          `Expert form and safety guidance for your level`
        ],
        aiGenerated: true
      };

      // Store selected exercises for variety in future regenerations
      const workoutKey = `${request.workoutType}-${request.difficulty}`;
      const selectedExerciseNames = programExercises.map((pe: any) => pe.exercise.name);
      this.lastWorkoutExercises.set(workoutKey, selectedExerciseNames);

      return {
        program,
        reasoning: aiData.reasoning || `AI selected ${programExercises.length} appropriate exercises for ${request.difficulty} level`,
        tips: aiData.tips || [
          `Focus on proper form - quality over quantity for ${request.difficulty} level`,
          `Progress gradually - don't rush to the next difficulty level`, 
          `Listen to your body and rest when needed`
        ]
      };

    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error(`Failed to parse AI workout recommendation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate intelligent fallback workout when AI is not available
   */
  private static generateFallbackWorkout(request: AIWorkoutRequest): AIWorkoutResponse {
    const availableExercises = this.getAvailableExercises(request.workoutType, request.difficulty);
    
    // Apply the same strict difficulty requirements as AI
    const levelRequirements = {
      beginner: { min: 3, max: 4, sets: 2, reps: '8-10', rest: 75 },
      intermediate: { min: 4, max: 6, sets: 3, reps: '10-12', rest: 60 },
      advanced: { min: 5, max: 8, sets: 4, reps: '12-15', rest: 45 }
    };

    const requirements = levelRequirements[request.difficulty];
    const numExercises = Math.min(requirements.max, Math.max(requirements.min, availableExercises.length));
    
    // Get previously used exercises for variety
    const workoutKey = `${request.workoutType}-${request.difficulty}`;
    const previousExercises = this.lastWorkoutExercises.get(workoutKey) || [];
    
    // Intelligent exercise selection with variety priority
    let selectedExercises: ExerciseData[] = [];
    
    if (request.workoutType === 'legs') {
      // For legs, prioritize compound movements that work multiple muscle groups
      const compoundExercises = availableExercises.filter(ex => 
        ex.muscleGroups.includes('quadriceps') && ex.muscleGroups.includes('glutes')
      );
      const isolationExercises = availableExercises.filter(ex => 
        !compoundExercises.some(comp => comp.id === ex.id)
      );
      
      // Apply variety logic - prefer exercises not used recently
      const freshCompound = compoundExercises.filter(ex => !previousExercises.includes(ex.name));
      const freshIsolation = isolationExercises.filter(ex => !previousExercises.includes(ex.name));
      
      // Select 70% compound, 30% isolation with variety preference
      const compoundCount = Math.ceil(numExercises * 0.7);
      const isolationCount = numExercises - compoundCount;
      
      // Try to use fresh exercises first, fall back to all if needed
      const chosenCompound = freshCompound.length >= compoundCount 
        ? freshCompound.slice(0, compoundCount)
        : [...freshCompound, ...compoundExercises.filter(ex => previousExercises.includes(ex.name))].slice(0, compoundCount);
        
      const chosenIsolation = freshIsolation.length >= isolationCount
        ? freshIsolation.slice(0, isolationCount)
        : [...freshIsolation, ...isolationExercises.filter(ex => previousExercises.includes(ex.name))].slice(0, isolationCount);
      
      selectedExercises = [...chosenCompound, ...chosenIsolation];
    } else {
      // For other workout types, use balanced selection with variety
      const freshExercises = availableExercises.filter(ex => !previousExercises.includes(ex.name));
      
      if (freshExercises.length >= numExercises) {
        // We have enough fresh exercises
        selectedExercises = freshExercises.slice(0, numExercises);
      } else {
        // Mix fresh and previous exercises
        const reusedExercises = availableExercises.filter(ex => previousExercises.includes(ex.name));
        selectedExercises = [
          ...freshExercises,
          ...reusedExercises.slice(0, numExercises - freshExercises.length)
        ];
      }
    }

    // Generate program with proper difficulty-based parameters
    const program: WorkoutProgram = {
      id: `smart-workout-${request.workoutType}-${Date.now()}`,
      name: `Smart ${WORKOUT_TYPES[request.workoutType].name} Workout (${request.difficulty})`,
      type: request.workoutType,
      difficulty: request.difficulty,
      duration: request.duration,
      exercises: selectedExercises.map(exercise => ({
        exercise,
        sets: requirements.sets,
        reps: requirements.reps,
        weight: exercise.equipment?.length ? 
          (request.difficulty === 'beginner' ? 'light' : 
           request.difficulty === 'intermediate' ? 'moderate' : 'moderate-heavy') : 'bodyweight',
        restBetweenSets: requirements.rest
      })),
      description: `Intelligently-generated ${request.difficulty} level workout with ${selectedExercises.length} exercises, designed using exercise science principles and difficulty-appropriate progression.`,
      benefits: [
        `Scientifically designed for ${request.difficulty} level`,
        `${selectedExercises.length} exercises meeting ${request.difficulty} requirements`,
        `Proper exercise progression and muscle balance`,
        `Difficulty-appropriate sets, reps, and rest periods`,
        `Safe and effective training program`
      ],
      aiGenerated: false // Being honest about fallback
    };

    // Store selected exercises for variety in future regenerations
    const selectedExerciseNames = selectedExercises.map(ex => ex.name);
    this.lastWorkoutExercises.set(workoutKey, selectedExerciseNames);

    const levelTips = {
      beginner: [
        'Focus on learning proper form before increasing intensity',
        'Take longer rest periods (60-90 seconds) between sets',
        'Start with bodyweight or light weights',
        'Progress gradually - consistency is more important than intensity'
      ],
      intermediate: [
        'Focus on progressive overload - gradually increase weight or reps',
        'Maintain proper form even as intensity increases',
        'Rest 45-75 seconds between sets for optimal recovery',
        'Challenge yourself while listening to your body'
      ],
      advanced: [
        'Utilize advanced training techniques like supersets or drop sets',
        'Shorter rest periods (30-60 seconds) for increased intensity',
        'Focus on mind-muscle connection and movement quality',
        'Progressive overload through increased volume or intensity'
      ]
    };

    const varietyNote = previousExercises.length > 0 
      ? ` This workout includes new exercises for variety compared to your previous session.`
      : '';

    return {
      program,
      reasoning: `Smart algorithm selected ${selectedExercises.length} exercises specifically for ${request.difficulty} level ${request.workoutType} training. The program follows exercise science principles with ${requirements.sets} sets of ${requirements.reps} reps, optimized for your fitness level and goals.${varietyNote}`,
      tips: levelTips[request.difficulty]
    };
  }

  /**
   * Generate personalized fitness advice using AI
   */
  static async getPersonalizedAdvice(userProfile: {
    goals: string;
    currentLevel: string;
    challenges: string;
  }): Promise<string> {
    try {
      const prompt = `As a certified personal trainer, provide personalized fitness advice for someone with:
      
Goals: ${userProfile.goals}
Current Level: ${userProfile.currentLevel}
Challenges: ${userProfile.challenges}

Provide 3-4 specific, actionable recommendations in a supportive tone. Keep it under 200 words.`;

      const response = await window.puter.ai.chat(prompt, {
        model: this.DEFAULT_MODEL,
        temperature: 0.8,
        max_tokens: 300
      });

      return typeof response === 'string' ? response : response.message?.content || response.content || 'Focus on consistency and gradual progression in your fitness journey.';
    } catch (error) {
      console.error('Error getting AI advice:', error);
      return 'Focus on consistency, proper form, and gradual progression. Listen to your body and adjust intensity as needed.';
    }
  }

  /**
   * Validate if exercise difficulty is appropriate for user level
   */
  private static validateExerciseDifficulty(exercise: ExerciseData, userLevel: string): boolean {
    switch (userLevel) {
      case 'beginner':
        return exercise.difficulty === 'beginner';
      case 'intermediate':
        return exercise.difficulty === 'beginner' || exercise.difficulty === 'intermediate';
      case 'advanced':
        return true; // Advanced users can do any exercise
      default:
        return exercise.difficulty === 'beginner'; // Default to safest
    }
  }

  /**
   * Validate and adjust sets based on difficulty level
   */
  private static validateSets(aiSets: number, difficulty: string): number {
    const setRanges = {
      beginner: { min: 2, max: 3 },
      intermediate: { min: 3, max: 4 },
      advanced: { min: 3, max: 5 }
    };

    const range = setRanges[difficulty as keyof typeof setRanges] || setRanges.beginner;
    
    if (aiSets < range.min) return range.min;
    if (aiSets > range.max) return range.max;
    return aiSets;
  }

  /**
   * Validate and adjust reps based on difficulty level
   */
  private static validateReps(aiReps: string, difficulty: string): string {
    const repGuidelines = {
      beginner: ['6-8', '8-10', '8-12'],
      intermediate: ['10-12', '10-15', '12-15'],
      advanced: ['12-15', '15-20', '12-20']
    };

    const validReps = repGuidelines[difficulty as keyof typeof repGuidelines] || repGuidelines.beginner;
    
    // If AI provided reps are not in our guidelines, use appropriate default
    if (!validReps.some(valid => aiReps.includes(valid.split('-')[0]) || aiReps.includes(valid.split('-')[1]))) {
      return validReps[0]; // Return first valid option for the level
    }
    
    return aiReps;
  }

  /**
   * Validate and adjust rest time based on difficulty level
   */
  private static validateRestTime(aiRestTime: number, difficulty: string): number {
    const restRanges = {
      beginner: { min: 60, max: 90 },   // Longer rest for beginners
      intermediate: { min: 45, max: 75 },
      advanced: { min: 30, max: 60 }    // Shorter rest for advanced
    };

    const range = restRanges[difficulty as keyof typeof restRanges] || restRanges.beginner;
    
    if (aiRestTime < range.min) return range.min;
    if (aiRestTime > range.max) return range.max;
    return aiRestTime;
  }
}