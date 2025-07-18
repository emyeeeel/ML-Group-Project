//let question interface only the following: id string, text string, list of choice with their appropriate numerical value conversion, and its category
export interface Question {
  id: string;
  text: string;
  choices: Array<{value: number, label: string}>;
  category?: string;
}

export interface AssessmentForm {
  // Demographics
  age: number;
  grade_level: number;
  gender: number;
  family_structure: number;
  screen_access: number;
  
  // Access questions
  "do_you_have_a_tv,_game_console,_tablet,_or_computer_with_internet__in_your_bedroom?": number;
  "do_you_have_your_own__phone,_tablet,_or_other__portable_screen?": number;
  "do_you_use_screens__during_meals_(breakfast,__lunch,_or_dinner)?": number;
  "do_you_use_screens__on_school_nights__(monday_to_friday)?": number;
  "do_you_use_screens_while__waiting_(e.g.,_in_line_or_in__the_car)?": number;
  total_access_score: number;
  access_level: number;
  
  // Frequency questions
  "how_old_were_you__when_you_first_used__a_screen_(tv,_tablet,__phone,_etc.)?": number;
  "about_how_many__hours_do_you_use__screens_each_day?": number;
  "do_you_use_screens__at_bedtime_to_help__you_fall_asleep?": number;
  "do_you_use_screens__when_you're_feeling__upset_to_calm_down?": number;
  total_frequency_score: number;
  frequency_level: number;
  
  // Content questions
  "do_you_watch_or_play__things_that_have_fighting__or_violence?": number;
  "do_you_choose_your__own_shows_or_download__your_own_apps?": number;
  "are_the_shows_or__games_you_usually_use:": number;
  total_content_score: number;
  content_level: number;
  
  // Interactivity questions
  "do_you_usually_watch_tv_or_videos:": number;
  "do_you_usually_play__games_or_use_apps:": number;
  "when_watching_tv_or_movies,__how_often_does_a_grownup_talk__to_you_or_ask_questions_about__what's_happening?": number;
  "after_watching_or_playing,__how_often_does_a_grownup_talk_with_you_about_what_it_was_about_or_what_you_liked?": number;
  total_interactivity_score: number;
  interactivity_level: number;
}

export const ASSESSMENT_QUESTIONS: Question[] = [
  // Demographics
  { 
    id: 'age', 
    text: 'Age',
    choices: [
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10' },
      { value: 11, label: '11' },
      { value: 12, label: '12' },
      { value: 13, label: '13' },
      { value: 14, label: '14' }
    ],
    category: 'demographics'
  },
  { 
    id: 'grade_level', 
    text: 'Grade Level',
    choices: [
      { value: 4, label: '4th Grade' },
      { value: 5, label: '5th Grade' },
      { value: 6, label: '6th Grade' },
    ],
    category: 'demographics'
  },
  { 
    id: 'gender', 
    text: 'Gender', 
    choices: [
      { value: 0, label: 'Female' },
      { value: 1, label: 'Male' },
    ],
    category: 'demographics' 
  },
  { 
    id: 'family_structure', 
    text: 'Family Structure', 
    choices: [
      { value: 0, label: 'I live with both my parents' },
      { value: 1, label: 'I live with one parent' },
      { value: 2, label: 'I live with a guardian or someone else' }
    ],
    category: 'demographics' 
  },
  { 
    id: 'screen_access', 
    text: 'Screen Access at Home', 
    choices: [
      { value: 0, label: 'I have 1 screen (TV, phone, tablet, or computer)' },
      { value: 1, label: 'I have 2 or 3 screens' },
      { value: 2, label: 'I have 4 or more screens' }
    ],
    category: 'demographics',
  },

  // SCREEN Q - A. Access to Screens
  { 
    id: 'do_you_have_a_tv,_game_console,_tablet,_or_computer_with_internet__in_your_bedroom?', 
    text: 'Do you have a TV, game console, tablet, or computer with internet in your bedroom?', 
    choices: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ],
    category: 'screen_access'
  },
  { 
    id: 'do_you_have_your_own__phone,_tablet,_or_other__portable_screen?', 
    text: 'Do you have your own phone, tablet, or other portable screen?', 
    choices: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ],
    category: 'screen_access'
  },
  { 
    id: 'do_you_use_screens__during_meals_(breakfast,__lunch,_or_dinner)?', 
    text: 'Do you use screens during meals (breakfast, lunch, or dinner)?', 
    choices: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ],
    category: 'screen_access'
  },
  { 
    id: 'do_you_use_screens__on_school_nights__(monday_to_friday)?', 
    text: 'Do you use screens on school nights (Monday to Friday)?', 
    choices: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ],
    category: 'screen_access'
  },
  { 
    id: 'do_you_use_screens_while__waiting_(e.g.,_in_line_or_in__the_car)?', 
    text: 'Do you use screens while waiting (e.g., in line or in the car)?', 
    choices: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ],
    category: 'screen_access'
  },

  // SCREEN Q - B. How Often You Use Screens
  { 
    id: 'how_old_were_you__when_you_first_used__a_screen_(tv,_tablet,__phone,_etc.)?', 
    text: 'How old were you when you first used a screen (TV, tablet, phone, etc.)?', 
    choices: [
      { value: 0, label: 'After I turned 1 and a half years old' },
      { value: 1, label: 'Between 1 year and 1 and a half years old' },
      { value: 2, label: 'Before I turned 1 year old' },
    ],
    category: 'frequency'
  },
  { 
    id: 'about_how_many__hours_do_you_use__screens_each_day?', 
    text: 'About how many hours do you use screens each day?', 
    choices: [
      { value: 0, label: 'Less than 1 hour' },
      { value: 1, label: '1 to 3 hours' },
      { value: 2, label: 'More than 3 hours' },
    ],
    category: 'frequency'
  },
  { 
    id: 'do_you_use_screens__at_bedtime_to_help__you_fall_asleep?', 
    text: 'Do you use screens at bedtime to help you fall asleep?', 
    choices: [
      { value: 0, label: 'Often' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Never' },
    ],
    category: 'frequency'
  },
  { 
    id: 'do_you_use_screens__when_you’re_feeling__upset_to_calm_down?', 
    text: 'Do you use screens when you’re feeling upset to calm down?', 
    choices: [
      { value: 0, label: 'Often' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Never' },
    ],
    category: 'frequency'
  },

  // SCREEN Q - C. What You Watch or Play
  { 
    id: 'do_you_watch_or_play__things_that_have_fighting__or_violence?', 
    text: 'Do you watch or play things that have fighting or violence?', 
    choices: [
      { value: 0, label: 'Often' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Never' },
    ],
    category: 'content'
  },
  { 
    id: 'do_you_choose_your__own_shows_or_download__your_own_apps?', 
    text: 'Do you choose your own shows or download your own apps?', 
    choices: [
      { value: 0, label: 'Often' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Never' },
    ],
    category: 'content'
  },
  { 
    id: 'are_the_shows_or__games_you_usually_use:', 
    text: 'Are the shows or games you usually use:', 
    choices: [
      { value: 0, label: 'Slow, with more talking or singing' },
      { value: 1, label: 'Fast, with lots of action' },
    ],
    category: 'content'
  },

  // SCREEN Q - D. Watching or Playing with Grownups
  { 
    id: 'do_you_usually_watch_tv_or_videos:', 
    text: 'Do you usually watch TV or videos:', 
    choices: [
      { value: 0, label: 'With a grownup' },
      { value: 1, label: 'Alone' },
    ],
    category: 'interactivity'
  },
  { 
    id: 'do_you_usually_play__games_or_use_apps:', 
    text: 'Do you usually play games or use apps:', 
    choices: [
      { value: 0, label: 'With a grownup' },
      { value: 1, label: 'Alone' },
    ],
    category: 'interactivity'
  },
  { 
    id: 'when_watching_tv_or_movies,__how_often_does_a_grownup_talk__to_you_or_ask_questions_about__what’s_happening?', 
    text: 'When watching TV or movies, how often does a grownup talk to you or ask questions about what’s happening?', 
    choices: [
        { value: 0, label: 'Often' },
        { value: 1, label: 'Sometimes' },
        { value: 2, label: 'Never' },
    ],
    category: 'interactivity'
  },
  { 
    id: 'after_watching_or_playing,__how_often_does_a_grownup_talk_with_you_about_what_it_was_about_or_what_you_liked?:', 
    text: 'After watching or playing, how often does a grownup talk with you about what it was about or what you liked?', 
    choices: [
        { value: 0, label: 'Often' },
        { value: 1, label: 'Sometimes' },
        { value: 2, label: 'Never' },
    ],
    category: 'interactivity'
  },

];

export type QuestionCategory = 'demographics' | 'access' | 'frequency' | 'content' | 'interactivity';

export const QUESTIONS_BY_CATEGORY: Record<QuestionCategory, Question[]> = {
  demographics: ASSESSMENT_QUESTIONS.filter(q => q.category === 'demographics'),
  access: ASSESSMENT_QUESTIONS.filter(q => q.category === 'screen_access'),
  frequency: ASSESSMENT_QUESTIONS.filter(q => q.category === 'frequency'),
  content: ASSESSMENT_QUESTIONS.filter(q => q.category === 'content'),
  interactivity: ASSESSMENT_QUESTIONS.filter(q => q.category === 'interactivity')
};
