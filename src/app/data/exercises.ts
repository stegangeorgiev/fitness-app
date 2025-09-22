import { Exercise } from '../types/workout';

export interface ExerciseInstruction {
  setup: string[];
  execution: string[];
  tips: string[];
  commonMistakes: string[];
}

export interface ExerciseData {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'sports';
  muscleGroups: string[];
  equipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: ExerciseInstruction;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  imageUrl?: string;
  videoUrl?: string;
  estimatedDuration: number; // in seconds per rep
  restTime: number; // recommended rest in seconds
}

export type WorkoutType = 'full-body' | 'chest' | 'back' | 'legs' | 'core' | 'arms' | 'shoulders';

export interface WorkoutProgram {
  id: string;
  name: string;
  type: WorkoutType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // estimated total duration in minutes
  exercises: {
    exercise: ExerciseData;
    sets: number;
    reps: string; // e.g., "8-12" or "10"
    weight?: string; // e.g., "bodyweight" or "moderate"
    restBetweenSets: number; // in seconds
  }[];
  description: string;
  benefits: string[];
  aiGenerated: boolean;
}

// Comprehensive Exercise Database
export const EXERCISE_DATABASE: ExerciseData[] = [
  // CHEST EXERCISES
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'strength',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    primaryMuscles: ['pectorals'],
    secondaryMuscles: ['triceps', 'anterior deltoids', 'core'],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 3,
    restTime: 60,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    instructions: {
      setup: [
        'Start in a plank position with hands slightly wider than shoulder-width apart',
        'Keep your body in a straight line from head to heels',
        'Place hands flat on the ground with fingers spread wide for stability',
        'Engage your core muscles and keep your feet together'
      ],
      execution: [
        'Lower your body until your chest nearly touches the floor',
        'Keep your elbows at a 45-degree angle to your body (not flared wide)',
        'Push through your palms to return to starting position',
        'Maintain tight core and straight body line throughout the movement',
        'Exhale as you push up, inhale as you lower down'
      ],
      tips: [
        'Keep your head in neutral position - don\'t look up or down',
        'Don\'t let your hips sag or pike up during the movement',
        'Control the descent - take 2-3 seconds to lower down',
        'If too difficult, modify by doing knee push-ups or incline push-ups',
        'Focus on quality over quantity - perfect form is key'
      ],
      commonMistakes: [
        'Flaring elbows too wide (puts stress on shoulders)',
        'Not going down far enough (reduces effectiveness)',
        'Arching the back or letting hips sag',
        'Rushing through the movement without control',
        'Holding breath instead of breathing rhythmically'
      ]
    }
  },
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'strength',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    primaryMuscles: ['pectorals'],
    secondaryMuscles: ['triceps', 'anterior deltoids'],
    difficulty: 'intermediate',
    equipment: ['barbell', 'bench'],
    estimatedDuration: 4,
    restTime: 120,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    instructions: {
      setup: [
        'Lie flat on bench with feet firmly planted on the ground',
        'Grip barbell with hands slightly wider than shoulder-width apart',
        'Keep shoulder blades pulled back and down against the bench',
        'Maintain a natural arch in your lower back',
        'Eyes should be directly under the barbell'
      ],
      execution: [
        'Unrack the bar and position it directly over your chest',
        'Lower the bar slowly to your chest, touching lightly at nipple level',
        'Press the bar back up in a straight line directly over your chest',
        'Lock out your arms at the top without overextending',
        'Maintain control throughout the entire range of motion'
      ],
      tips: [
        'Keep your core tight and engaged throughout the lift',
        'Drive through your heels to maintain stability',
        'Don\'t bounce the bar off your chest - control the weight',
        'Breathe in on the way down, breathe out forcefully when pressing up',
        'Keep your wrists straight and grip the bar firmly'
      ],
      commonMistakes: [
        'Lifting feet off the ground (reduces stability)',
        'Using too wide or too narrow grip',
        'Not touching the chest or stopping too high',
        'Bouncing the bar off the chest',
        'Arching the back excessively'
      ]
    }
  },

  // BACK EXERCISES
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'strength',
    muscleGroups: ['back', 'biceps'],
    primaryMuscles: ['latissimus dorsi'],
    secondaryMuscles: ['biceps', 'rear deltoids', 'rhomboids'],
    difficulty: 'intermediate',
    equipment: ['pull-up bar'],
    estimatedDuration: 4,
    restTime: 90,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    instructions: {
      setup: [
        'Hang from pull-up bar with hands shoulder-width apart',
        'Use overhand grip (palms facing away from you)',
        'Let arms fully extend with a slight bend in elbows',
        'Engage core and keep legs slightly bent or crossed',
        'Shoulders should be pulled down and back, not hunched up'
      ],
      execution: [
        'Pull your body up by driving elbows down toward your sides',
        'Lead with your chest, keeping it up and open',
        'Pull until your chin clears the bar',
        'Pause briefly at the top',
        'Lower yourself with control to full arm extension'
      ],
      tips: [
        'Think about pulling your elbows down and back rather than pulling up',
        'Keep shoulders away from your ears throughout the movement',
        'Engage your lats by imagining squeezing something under your armpits',
        'If you can\'t do full pull-ups, use resistance bands or do negatives',
        'Breathe out forcefully as you pull up, breathe in on the way down'
      ],
      commonMistakes: [
        'Not going to full extension at the bottom (partial range of motion)',
        'Swinging or using momentum (kipping when not intended)',
        'Only pulling chin over bar instead of getting chest up',
        'Hunching shoulders up toward ears',
        'Rushing through the movement without control'
      ]
    }
  },
  {
    id: 'bent-over-rows',
    name: 'Bent-over Barbell Rows',
    category: 'strength',
    muscleGroups: ['back', 'biceps'],
    primaryMuscles: ['latissimus dorsi', 'rhomboids'],
    secondaryMuscles: ['biceps', 'rear deltoids'],
    difficulty: 'intermediate',
    equipment: ['barbell'],
    estimatedDuration: 4,
    restTime: 90,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
    instructions: {
      setup: [
        'Stand with feet hip-width apart, holding barbell with overhand grip',
        'Hinge at hips by pushing them back, keeping chest up and back straight',
        'Bend knees slightly for stability and balance',
        'Let arms hang straight down with bar close to your legs',
        'Maintain a 45-degree torso angle or slightly higher'
      ],
      execution: [
        'Pull the bar toward your lower ribcage/upper abdomen',
        'Lead with your elbows, pulling them back and up',
        'Squeeze shoulder blades together at the top',
        'Hold briefly at the top of the movement',
        'Lower the bar with control back to starting position'
      ],
      tips: [
        'Keep your back straight and chest up throughout the movement',
        'Don\'t use momentum - control the weight on both phases',
        'Focus on squeezing your back muscles, not just moving the weight',
        'Keep the bar close to your body throughout the movement',
        'Breathe out as you pull the bar up, breathe in as you lower it'
      ],
      commonMistakes: [
        'Using too much momentum or \'cheating\' the weight up',
        'Rounding the back instead of keeping it straight',
        'Pulling to the wrong area (too high toward chest)',
        'Not squeezing shoulder blades together',
        'Standing too upright instead of maintaining hip hinge'
      ]
    }
  },

  // LEG EXERCISES
  {
    id: 'squats',
    name: 'Squats',
    category: 'strength',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 4,
    restTime: 90,
    imageUrl: 'https://images.unsplash.com/photo-1566241134087-b8fc8e49754b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    instructions: {
      setup: [
        'Stand with feet shoulder-width apart, toes slightly pointed outward',
        'Keep your chest up and core engaged',
        'Arms can be crossed over chest, on hips, or extended forward for balance',
        'Look straight ahead, not up or down'
      ],
      execution: [
        'Initiate the movement by pushing your hips back as if sitting in a chair',
        'Bend at the knees and hips simultaneously',
        'Lower until your thighs are parallel to the floor (or as low as comfortable)',
        'Keep your knees tracking over your toes',
        'Drive through your heels to return to standing position'
      ],
      tips: [
        'Keep your weight centered over your heels, not your toes',
        'Don\'t let your knees cave inward - push them out',
        'Maintain an upright torso throughout the movement',
        'Go only as low as you can maintain good form',
        'Breathe in on the way down, out on the way up'
      ],
      commonMistakes: [
        'Not going deep enough (stopping too high)',
        'Knees caving inward (valgus collapse)',
        'Leaning too far forward',
        'Rising onto toes instead of staying on heels',
        'Rounding the back'
      ]
    }
  },
  {
    id: 'lunges',
    name: 'Lunges',
    category: 'strength',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 3,
    restTime: 60,
    imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    instructions: {
      setup: [
        'Stand with feet hip-width apart',
        'Keep your core engaged and chest up',
        'Place hands on hips or let them hang at your sides',
        'Step one foot forward into a long stride'
      ],
      execution: [
        'Lower your body until both knees are bent at 90 degrees',
        'Keep your front knee directly over your ankle',
        'Lower back knee toward the ground without touching',
        'Push through your front heel to return to starting position',
        'Alternate legs or complete sets on one side first'
      ],
      tips: [
        'Keep most of your weight on your front leg',
        'Don\'t let your front knee drift past your toes',
        'Keep your torso upright throughout the movement',
        'Take a big enough step to maintain proper form',
        'Control the movement - don\'t bounce at the bottom'
      ],
      commonMistakes: [
        'Taking too small a step (puts stress on knees)',
        'Leaning forward instead of staying upright',
        'Allowing front knee to cave inward',
        'Pushing off the back foot instead of front foot',
        'Not going deep enough for full range of motion'
      ]
    }
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    category: 'strength',
    muscleGroups: ['calves'],
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 2,
    restTime: 45,
    imageUrl: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=gwLzBJYoWlI',
    instructions: {
      setup: [
        'Stand with feet hip-width apart',
        'Keep your core engaged and spine neutral',
        'Place hands on hips or hold onto something for balance',
        'Distribute weight evenly across both feet'
      ],
      execution: [
        'Rise up onto the balls of your feet',
        'Lift your heels as high as possible',
        'Hold the contraction briefly at the top',
        'Lower your heels back down with control',
        'Feel the stretch in your calves at the bottom'
      ],
      tips: [
        'Focus on getting full range of motion',
        'Don\'t bounce - control both up and down phases',
        'Keep your weight on the balls of your feet',
        'Pause at the top to maximize muscle activation',
        'For added difficulty, try single-leg or add weight'
      ],
      commonMistakes: [
        'Not going through full range of motion',
        'Bouncing at the top or bottom',
        'Using momentum instead of muscle control',
        'Leaning forward or backward',
        'Going too fast without proper muscle engagement'
      ]
    }
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    category: 'strength',
    muscleGroups: ['quadriceps', 'glutes'],
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes', 'calves'],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 30, // 30 seconds hold
    restTime: 60,
    imageUrl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=y-wV4Venusw',
    instructions: {
      setup: [
        'Stand with your back against a wall',
        'Place feet shoulder-width apart, about 2 feet from wall',
        'Keep your arms at your sides or crossed over chest',
        'Engage your core before starting the movement'
      ],
      execution: [
        'Slide down the wall until thighs are parallel to floor',
        'Keep your knees at 90-degree angles',
        'Hold this position while breathing normally',
        'Keep your back flat against the wall',
        'Push through heels and slide back up when finished'
      ],
      tips: [
        'Keep your weight in your heels, not on your toes',
        'Don\'t let your knees cave inward',
        'Breathe normally - don\'t hold your breath',
        'Start with shorter holds and build up time',
        'Keep your core engaged throughout the hold'
      ],
      commonMistakes: [
        'Not going down far enough (thighs not parallel)',
        'Allowing knees to drift inward',
        'Putting weight on toes instead of heels',
        'Holding breath during the exercise',
        'Rounding back away from the wall'
      ]
    }
  },
  {
    id: 'step-ups',
    name: 'Step-ups',
    category: 'strength',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    difficulty: 'beginner',
    equipment: ['step', 'box'],
    estimatedDuration: 3,
    restTime: 60,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=dQqApCGd5Ss',
    instructions: {
      setup: [
        'Stand facing a sturdy step, box, or bench',
        'Step should be about knee height or slightly lower',
        'Keep your core engaged and chest up',
        'Place hands on hips or let them swing naturally'
      ],
      execution: [
        'Step up with one foot, placing entire foot on the step',
        'Push through the heel to lift your body up',
        'Bring the trailing leg up to meet the first',
        'Step back down with the same leg that went up first',
        'Alternate leading legs or complete sets on one side'
      ],
      tips: [
        'Use the leg on the step to lift yourself, not momentum',
        'Keep your knee in line with your toes',
        'Control both the up and down phases',
        'Keep your torso upright throughout',
        'Start with a lower step if you\'re a beginner'
      ],
      commonMistakes: [
        'Using the bottom leg to push off instead of step leg',
        'Allowing knee to cave inward',
        'Leaning forward excessively',
        'Stepping down too hard or fast',
        'Using a step that\'s too high for your fitness level'
      ]
    }
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
    category: 'strength',
    muscleGroups: ['hamstrings', 'glutes', 'back', 'legs'],
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['erector spinae', 'traps', 'forearms'],
    difficulty: 'intermediate',
    equipment: ['barbell'],
    estimatedDuration: 5,
    restTime: 120,
    imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    instructions: {
      setup: [
        'Stand with feet hip-width apart, bar positioned over mid-foot',
        'Bend at hips and knees to grip the bar with hands just outside legs',
        'Keep chest up and shoulders back, maintaining natural spine curve',
        'Arms should be straight with a firm grip on the bar',
        'Shoulders should be slightly in front of the bar at starting position'
      ],
      execution: [
        'Drive through heels and extend hips and knees simultaneously',
        'Keep the bar close to your body throughout the entire movement',
        'As you stand up, thrust hips forward and squeeze glutes',
        'Stand tall with shoulders back and hips fully extended',
        'Lower the bar by pushing hips back first, then bending knees'
      ],
      tips: [
        'Keep the bar as close to your body as possible - it should almost drag',
        'Don\'t round your back - maintain neutral spine throughout',
        'Drive through your heels, not your toes',
        'Think \'hips back\' when lowering, not \'knees forward\'',
        'Keep your core tight and engaged throughout the entire lift'
      ],
      commonMistakes: [
        'Rounding the back, especially in the lower back area',
        'Bar drifting away from the body during the lift',
        'Not engaging glutes fully at the top of the movement',
        'Hyperextending at the top (leaning back too far)',
        'Looking up instead of keeping head in neutral position'
      ]
    }
  },

  // CORE EXERCISES
  {
    id: 'plank',
    name: 'Plank',
    category: 'strength',
    muscleGroups: ['core'],
    primaryMuscles: ['rectus abdominis', 'transverse abdominis'],
    secondaryMuscles: ['shoulders', 'glutes'],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 30, // 30 seconds hold
    restTime: 60,
    imageUrl: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e4?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    instructions: {
      setup: [
        'Start in push-up position with hands directly under shoulders',
        'Lower onto forearms, keeping elbows directly under shoulders',
        'Keep your body in a straight line from head to heels',
        'Engage core muscles by pulling belly button toward spine',
        'Keep feet together or hip-width apart for stability'
      ],
      execution: [
        'Hold the position while breathing normally and steadily',
        'Keep hips level - don\'t let them sag toward floor or pike up',
        'Maintain neutral spine alignment throughout the hold',
        'Focus on keeping core muscles contracted and engaged',
        'Keep shoulders stable and away from ears'
      ],
      tips: [
        'Think about pulling belly button to spine to engage deep core muscles',
        'Keep breathing throughout the hold - don\'t hold your breath',
        'Start with shorter holds (10-15 seconds) and gradually build up time',
        'Focus on quality over duration - perfect form is more important',
        'If too difficult, modify by dropping to knees while maintaining straight line'
      ],
      commonMistakes: [
        'Letting hips sag toward the ground (losing core engagement)',
        'Holding breath instead of breathing normally',
        'Looking up instead of keeping head in neutral position',
        'Allowing shoulders to round forward',
        'Piking hips up too high (making it easier but less effective)'
      ]
    }
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    muscleGroups: ['core', 'shoulders'],
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'hip flexors'],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 2,
    restTime: 30,
    imageUrl: 'https://images.unsplash.com/photo-1566241142-17fca4dcc571?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    instructions: {
      setup: [
        'Start in high plank position with hands directly under shoulders',
        'Keep your body in a straight line from head to heels',
        'Engage your core and keep weight evenly distributed',
        'Start with feet together and core tight',
        'Keep shoulders stable and directly over wrists'
      ],
      execution: [
        'Bring one knee toward your chest in a running motion',
        'Quickly switch legs, extending one back while bringing the other forward',
        'Continue alternating legs in a smooth, controlled running motion',
        'Keep hips level and avoid bouncing up and down',
        'Maintain strong plank position with your upper body throughout'
      ],
      tips: [
        'Start slow and build up speed as you get comfortable with the movement',
        'Keep your core engaged throughout to maintain stability',
        'Don\'t let your hips bounce up and down - keep them level',
        'Focus on bringing knees toward chest, not just moving feet',
        'Keep breathing rhythmically throughout the exercise'
      ],
      commonMistakes: [
        'Letting hips rise too high, making it easier but less effective',
        'Not bringing knees far enough forward toward chest',
        'Going too fast too soon, losing form for speed',
        'Allowing shoulders to drift forward past wrists',
        'Holding breath instead of breathing continuously'
      ]
    }
  },
  
  // Additional Core Exercises
  {
    id: 'sit-ups',
    name: 'Sit-ups',
    category: 'strength',
    muscleGroups: ['core'],
    primaryMuscles: ['rectus abdominis'],
    secondaryMuscles: ['hip flexors'],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 2,
    restTime: 45,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=1fbU_MkV7NE',
    instructions: {
      setup: [
        'Lie on your back with knees bent at 90 degrees',
        'Keep feet flat on the floor',
        'Place hands lightly behind your head',
        'Keep elbows wide and pointing out to sides'
      ],
      execution: [
        'Engage core and lift shoulder blades off the ground',
        'Curl up toward your knees using abdominal muscles',
        'Don\'t pull on your head or neck',
        'Pause briefly at the top',
        'Lower back down with control'
      ],
      tips: [
        'Focus on using your abs, not your neck',
        'Keep the movement slow and controlled',
        'Don\'t sit all the way up - just lift shoulder blades',
        'Breathe out as you crunch up'
      ],
      commonMistakes: [
        'Pulling on the neck with hands',
        'Using momentum instead of muscle control',
        'Not engaging core properly',
        'Going too fast'
      ]
    }
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    category: 'strength',
    muscleGroups: ['core'],
    primaryMuscles: ['obliques', 'rectus abdominis'],
    secondaryMuscles: ['hip flexors'],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 2,
    restTime: 45,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    instructions: {
      setup: [
        'Sit on the floor with knees bent and feet slightly off ground',
        'Lean back slightly to engage core',
        'Keep chest up and back straight',
        'Clasp hands together in front of chest'
      ],
      execution: [
        'Rotate torso to the right, touching ground beside hip',
        'Return to center position',
        'Rotate to the left side',
        'Keep feet off ground throughout movement',
        'Maintain steady breathing pattern'
      ],
      tips: [
        'Keep core engaged throughout entire movement',
        'Control the rotation - don\'t swing wildly',
        'Keep chest up and shoulders back',
        'Start with feet on ground if too difficult'
      ],
      commonMistakes: [
        'Moving too fast without control',
        'Rounding the back',
        'Not rotating far enough to each side',
        'Holding breath during movement'
      ]
    }
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'strength',
    muscleGroups: ['core'],
    primaryMuscles: ['transverse abdominis', 'rectus abdominis'],
    secondaryMuscles: ['hip flexors'],
    difficulty: 'beginner',
    equipment: [],
    estimatedDuration: 3,
    restTime: 45,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws',
    instructions: {
      setup: [
        'Lie on your back with arms reaching toward ceiling',
        'Bend hips and knees to 90 degrees',
        'Keep lower back pressed into the floor',
        'Engage core muscles'
      ],
      execution: [
        'Slowly lower right arm overhead while extending left leg',
        'Stop just before they touch the ground',
        'Return to starting position with control',
        'Repeat with opposite arm and leg',
        'Maintain core engagement throughout'
      ],
      tips: [
        'Keep lower back pressed into floor',
        'Move slowly and with control',
        'Stop if you lose core engagement',
        'Breathe normally throughout'
      ],
      commonMistakes: [
        'Allowing lower back to arch off floor',
        'Moving too quickly',
        'Not maintaining 90-degree angles',
        'Holding breath'
      ]
    }
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    category: 'strength',
    muscleGroups: ['core'],
    primaryMuscles: ['rectus abdominis', 'obliques'],
    secondaryMuscles: ['hip flexors'],
    difficulty: 'intermediate',
    equipment: [],
    estimatedDuration: 2,
    restTime: 45,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
    instructions: {
      setup: [
        'Lie on your back with hands behind head',
        'Lift shoulder blades off the ground',
        'Bring knees up to 90-degree angle',
        'Keep elbows wide'
      ],
      execution: [
        'Bring right elbow toward left knee while extending right leg',
        'Switch sides in a pedaling motion',
        'Keep shoulder blades off ground throughout',
        'Focus on rotating from the torso, not just moving arms',
        'Maintain steady, controlled rhythm'
      ],
      tips: [
        'Don\'t pull on your neck',
        'Focus on quality over speed',
        'Keep core engaged throughout',
        'Make sure to actually rotate your torso'
      ],
      commonMistakes: [
        'Moving too fast without proper form',
        'Pulling on neck with hands',
        'Not rotating torso enough',
        'Letting shoulder blades rest on ground'
      ]
    }
  },
  {
    id: 'leg-raises',
    name: 'Leg Raises',
    category: 'strength',
    muscleGroups: ['core'],
    primaryMuscles: ['rectus abdominis', 'hip flexors'],
    secondaryMuscles: [],
    difficulty: 'intermediate',
    equipment: [],
    estimatedDuration: 3,
    restTime: 60,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    instructions: {
      setup: [
        'Lie flat on your back with legs extended',
        'Place hands under lower back for support if needed',
        'Keep lower back pressed into the floor',
        'Start with legs together and straight'
      ],
      execution: [
        'Keeping legs straight, lift them up to 90 degrees',
        'Slowly lower legs back down without touching floor',
        'Stop just before feet touch ground',
        'Lift back up using core muscles',
        'Keep movement slow and controlled'
      ],
      tips: [
        'Keep lower back pressed into floor',
        'If too difficult, bend knees slightly',
        'Focus on using core, not momentum',
        'Control the descent carefully'
      ],
      commonMistakes: [
        'Allowing lower back to arch',
        'Using momentum to swing legs up',
        'Lowering legs too quickly',
        'Not controlling the movement'
      ]
    }
  },
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    category: 'strength',
    muscleGroups: ['biceps'],
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    estimatedDuration: 3,
    restTime: 60,
    imageUrl: 'https://images.unsplash.com/photo-1566241134087-b8fc8e49754b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    instructions: {
      setup: [
        'Stand with feet hip-width apart for stability',
        'Hold dumbbells at your sides with arms fully extended',
        'Keep elbows close to your body throughout the movement',
        'Maintain neutral spine with shoulders back and down',
        'Use a firm grip on the dumbbells with palms facing forward'
      ],
      execution: [
        'Curl the weights up toward your shoulders in a smooth arc',
        'Keep your elbows stationary - don\'t let them drift forward',
        'Squeeze your biceps hard at the top of the movement',
        'Hold the contraction briefly at the top',
        'Lower the weights with control back to starting position'
      ],
      tips: [
        'Don\'t use momentum or swing the weights - control the movement',
        'Focus on feeling the muscle contraction, not just moving weight',
        'Control both the lifting (concentric) and lowering (eccentric) phases',
        'Keep your wrists straight and strong throughout',
        'Breathe out as you curl up, breathe in as you lower down'
      ],
      commonMistakes: [
        'Using momentum to swing weights instead of controlled movement',
        'Moving elbows forward or away from body during the curl',
        'Not going through full range of motion (partial reps)',
        'Curling too fast without focusing on muscle contraction',
        'Using weights that are too heavy, compromising form'
      ]
    }
  },

  // Additional Intermediate Exercises for better variety
  {
    id: 'dumbbell-flyes',
    name: 'Dumbbell Flyes',
    category: 'strength',
    muscleGroups: ['chest'],
    primaryMuscles: ['pectorals'],
    secondaryMuscles: ['anterior deltoids'],
    difficulty: 'intermediate',
    equipment: ['dumbbells', 'bench'],
    estimatedDuration: 4,
    restTime: 75,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
    instructions: {
      setup: [
        'Lie on bench with dumbbell in each hand',
        'Start with weights directly above chest, arms slightly bent',
        'Keep feet flat on floor for stability',
        'Maintain slight arch in lower back'
      ],
      execution: [
        'Lower weights in wide arc until chest feels stretched',
        'Keep elbows slightly bent throughout movement',
        'Bring weights back together above chest',
        'Squeeze chest muscles at the top'
      ],
      tips: [
        'Control the weight - don\'t let it drop quickly',
        'Focus on feeling the stretch in your chest',
        'Don\'t go too heavy - this is an isolation exercise',
        'Keep core engaged throughout'
      ],
      commonMistakes: [
        'Going too deep and straining shoulders',
        'Using too much weight',
        'Changing elbow angle during movement',
        'Bringing weights together at bottom instead of top'
      ]
    }
  },
  {
    id: 'lat-pulldowns',
    name: 'Lat Pulldowns',
    category: 'strength',
    muscleGroups: ['back', 'biceps'],
    primaryMuscles: ['latissimus dorsi'],
    secondaryMuscles: ['biceps', 'rhomboids'],
    difficulty: 'intermediate',
    equipment: ['cable machine'],
    estimatedDuration: 4,
    restTime: 75,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    instructions: {
      setup: [
        'Sit at lat pulldown machine with thighs secured under pads',
        'Grip bar wider than shoulder-width with overhand grip',
        'Lean back slightly and keep chest up',
        'Engage core and keep feet flat on floor'
      ],
      execution: [
        'Pull bar down to upper chest by driving elbows down and back',
        'Squeeze shoulder blades together at bottom',
        'Slowly return to starting position with control',
        'Don\'t let weight stack slam down'
      ],
      tips: [
        'Think about pulling with your back, not your arms',
        'Keep shoulders down and back',
        'Don\'t lean too far back',
        'Focus on squeezing your lats'
      ],
      commonMistakes: [
        'Pulling bar behind neck (dangerous)',
        'Using momentum or swinging',
        'Not going through full range of motion',
        'Hunching shoulders forward'
      ]
    }
  },
  {
    id: 'bulgarian-split-squats',
    name: 'Bulgarian Split Squats',
    category: 'strength',
    muscleGroups: ['quadriceps', 'glutes'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    difficulty: 'intermediate',
    equipment: ['bench'],
    estimatedDuration: 5,
    restTime: 75,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    instructions: {
      setup: [
        'Stand 2-3 feet in front of bench',
        'Place top of rear foot on bench behind you',
        'Keep most weight on front leg',
        'Torso should be upright with slight forward lean'
      ],
      execution: [
        'Lower into lunge position by bending front knee',
        'Go down until front thigh is parallel to ground',
        'Push through front heel to return to start',
        'Complete all reps on one leg before switching'
      ],
      tips: [
        'Keep most weight on your front leg',
        'Don\'t push off back foot',
        'Control the descent',
        'Keep front knee tracking over toes'
      ],
      commonMistakes: [
        'Putting too much weight on back leg',
        'Front knee caving inward',
        'Leaning too far forward',
        'Not going deep enough'
      ]
    }
  },
  {
    id: 'dips',
    name: 'Dips',
    category: 'strength',
    muscleGroups: ['triceps', 'chest'],
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['pectorals', 'anterior deltoids'],
    difficulty: 'intermediate',
    equipment: ['dip bars'],
    estimatedDuration: 4,
    restTime: 90,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    instructions: {
      setup: [
        'Grip dip bars with arms straight',
        'Lean slightly forward',
        'Keep legs straight or bent at knees',
        'Engage core and keep shoulders down'
      ],
      execution: [
        'Lower body by bending elbows',
        'Go down until shoulders are below elbows',
        'Push back up to starting position',
        'Keep elbows close to body'
      ],
      tips: [
        'Don\'t go too deep if you feel shoulder strain',
        'Keep movement controlled',
        'Lean forward slightly for chest emphasis',
        'Stay upright for triceps emphasis'
      ],
      commonMistakes: [
        'Going too deep and straining shoulders',
        'Flaring elbows out wide',
        'Using momentum',
        'Not going through full range of motion'
      ]
    }
  }
];

export const WORKOUT_TYPES: { [key in WorkoutType]: { name: string; description: string; icon: string } } = {
  'full-body': {
    name: 'Full Body',
    description: 'Complete workout targeting all major muscle groups',
    icon: '🏋️'
  },
  'chest': {
    name: 'Chest',
    description: 'Focus on chest muscles and supporting muscle groups',
    icon: '💪'
  },
  'back': {
    name: 'Back',
    description: 'Strengthen your back muscles and improve posture',
    icon: '🔙'
  },
  'legs': {
    name: 'Legs',
    description: 'Lower body strength and power development',
    icon: '🦵'
  },
  'core': {
    name: 'Core',
    description: 'Strengthen your core for better stability and balance',
    icon: '🎯'
  },
  'arms': {
    name: 'Arms',
    description: 'Build arm strength with biceps and triceps focus',
    icon: '💪'
  },
  'shoulders': {
    name: 'Shoulders',
    description: 'Develop shoulder strength and mobility',
    icon: '🤸'
  }
};