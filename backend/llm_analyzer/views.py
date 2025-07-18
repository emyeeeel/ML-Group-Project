from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import json
import os
import joblib
import numpy as np
from dotenv import load_dotenv

import groq
from groq import Groq

# Initialize Groq client. 
# There must be a .env file to store the GROQ_API_KEY since Github doesn't allow pushing changes with it exposed.
# Option 1: Use .env
load_dotenv()  # Load .env file
api_key = os.getenv("GROQ_API_KEY")  # Read from environment
client = Groq(api_key=api_key)

# Option 2: Direct use of GROQ_API_KEY
# GROQ_API_KEY = "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"
# client = Groq(api_key=GROQ_API_KEY)

# Helper to load models
def load_model(model_name):
    model_path = os.path.join(settings.BASE_DIR, 'classifier', 'models', model_name)
    return joblib.load(model_path)

# Example input features based on your feature columns
expected_features = [
    'age', 'grade_level', 'gender', 'family_structure', 'screen_access',
    'do_you_have_a_tv,_game_console,_tablet,_or_computer_with_internet__in_your_bedroom?',
    'do_you_have_your_own__phone,_tablet,_or_other__portable_screen?',
    'do_you_use_screens__during_meals_(breakfast,__lunch,_or_dinner)?',
    'do_you_use_screens__on_school_nights__(monday_to_friday)?',
    'do_you_use_screens_while__waiting_(e.g.,_in_line_or_in__the_car)?',
    'total_access_score', 'access_level',
    'how_old_were_you__when_you_first_used__a_screen_(tv,_tablet,__phone,_etc.)?',
    'about_how_many__hours_do_you_use__screens_each_day?',
    'do_you_use_screens__at_bedtime_to_help__you_fall_asleep?',
    'do_you_use_screens__when_you’re_feeling__upset_to_calm_down?',
    'total_frequency_score', 'frequency_level',
    'do_you_watch_or_play__things_that_have_fighting__or_violence?',
    'do_you_choose_your__own_shows_or_download__your_own_apps?',
    'are_the_shows_or__games_you_usually_use:',
    'total_content_score', 'content_level',
    'do_you_usually_watch_tv_or_videos:',
    'do_you_usually_play__games_or_use_apps:',
    'when_watching_tv_or_movies,__how_often_does_a_grownup_talk__to_you_or_ask_questions_about__what’s_happening?',
    'after_watching_or_playing,__how_often_does_a_grownup_talk_with_you_about_what_it_was_about_or_what_you_liked?',
    'total_interactivity_score', 'interactivity_level'
]


def groq_analysis(child_data_text, results_text):
    """
    Use Groq to analyze your Random Forest results and generate insights
    """
    
    # Prepare analysis prompt
    analysis_prompt = f"""
    Analyze these Random Forest Classification results for attention span prediction and don't mention scoring specifics:
    
    PROJECT CONTEXT:
    - Study: Attention span prediction based on screen media usage
    - Population: Children in the Philippines 
    - Tools: ScreenQ + SNAP-IV scales
    - Algorithm: Random Forest Classification

    NOTES:
    1. Features:
        - Demographics: 'age', 'grade_level', 'gender', 'family_structure', 'screen_access'
        - ScreenQ Questions: 
            1. 'do_you_have_a_tv,_game_console,_tablet,_or_computer_with_internet__in_your_bedroom?',
            2. 'do_you_have_your_own__phone,_tablet,_or_other__portable_screen?',
            3. 'do_you_use_screens__during_meals_(breakfast,__lunch,_or_dinner)?',
            4. 'do_you_use_screens__on_school_nights__(monday_to_friday)?',
            5. 'do_you_use_screens_while__waiting_(e.g.,_in_line_or_in__the_car)?',

            6. 'how_old_were_you__when_you_first_used__a_screen_(tv,_tablet,__phone,_etc.)?',
            7. 'about_how_many__hours_do_you_use__screens_each_day?',
            8. 'do_you_use_screens__at_bedtime_to_help__you_fall_asleep?',
            9. 'do_you_use_screens__when_you’re_feeling__upset_to_calm_down?',

            10. 'do_you_watch_or_play__things_that_have_fighting__or_violence?',
            11. 'do_you_choose_your__own_shows_or_download__your_own_apps?',
            12. 'are_the_shows_or__games_you_usually_use:',

            13. 'do_you_usually_watch_tv_or_videos:',
            14. 'do_you_usually_play__games_or_use_apps:',
            15. 'when_watching_tv_or_movies,__how_often_does_a_grownup_talk__to_you_or_ask_questions_about__what’s_happening?',
            16. 'after_watching_or_playing,__how_often_does_a_grownup_talk_with_you_about_what_it_was_about_or_what_you_liked?',
            
            - Where Questions 1-5 are added to get 'total_access_score'
            - Where Questions 6-9 are added to get 'total_frequency_score'
            - Where Questions 10-12 are added to get 'total_content_score'
            - Where Questions 13-16 are added to get 'total_interactivity_score'
        - ScreenQ 4-Domains: 'access_level', 'frequency_level', 'content_level' , 'interactivity_level'
            - Corresponding to access to screens,  frequency of use, media content, & human interactivity/co-viewing, respectively.
    
    2. Feature Encoding: 
        - 'gender': 1=Female, 0=Male
        - 'family_structure':  0=Both parents, 1=One parent, 2=Guardian/Other
        - 'screen_access': 0=1 screen, 1=2 to 3 screens, 2=4or more screens

        - 'access_level': 0=High Access if 'total_access_score'> (7/2) , 1=Low Access 
        - 'frequency_level': 0=High Frequency if 'total_frequency_score'> (8/2), 1=Low Frequency
        - 'content_level': 0=High Content if 'total_content_score'> (5/2), 1=Low Content
        - 'interactivity_level': 0=High Interactivity if 'total_interactivity_score'> (6/2), 1=Low Interactivity

    3. Predictions from 3 Models based on the SNAP-IV 26-Item Teacher and Parent Rating Scale
        - The 3 Models: 'Inattention', 'Hyperactivity/Impulsivity', and 'Oppositional/Defiant'
            - Corresponding to the prediction results in 'inattentive_result', 'hyperactive_impulsive_result', & 'oppositional_defiant_result', respectively
        - Model Interpretation: The output will be one of:
            0: Symptoms not clinically significant
            1: Mild symptoms
            2: Moderate symptoms
            3: Severe symptoms

    FEATURES:
    {child_data_text}
    
    RESULTS:
    {results_text}
    
    Please provide:
    1. Clinical interpretation of features especially in the levels high or low and their relationships to the predicted results
    2. Recommendations for intervention
    """
    
    response = client.chat.completions.create(
        messages=[
                # {"role": "system", "content": "You are a clinical psychologist analyzing child attention data."},
                {"role": "user", "content": analysis_prompt}
            ],
        model="llama3-8b-8192",  # or "mixtral-8x7b-32768"
        temperature=0.2,
        max_tokens=4000
    )
    
    return response.choices[0].message.content


@csrf_exempt
def llm_analysis(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            input_values = [data.get(feature, 0) for feature in expected_features]
            input_array = np.array([input_values])

            results = {}

            # Load and use each model
            model_files = {
                'inattentive_result': 'model_inattentive_result.pkl',
                'hyperactive_impulsive_result': 'model_hyperactive_impulsive_result.pkl',
                'oppositional_defiant_result': 'model_oppositional_defiant_result.pkl'
            }

            for label, filename in model_files.items():
                model = load_model(filename)
                prediction = model.predict(input_array)[0]
                results[label] = int(prediction)


            # 1. Convert input data to text to pass into groq_analysis function
            child_data_text = ""
            for key, value in data.items():
                clean_key = key.replace('_', ' ').replace('?', '').title()
                child_data_text += f"{clean_key}: {value}\n"

            # 2. Convert results to simple text with meanings
            symptom_levels = {
                0: "Symptoms not clinically significant",
                1: "Mild symptoms", 
                2: "Moderate symptoms",
                3: "Severe symptoms"
            }
            
            results_text = ""
            for key, value in results.items():
                clean_key = key.replace('_', ' ').title()
                results_text += f"{clean_key}: {symptom_levels[value]} (Class: {value})\n"

            # 3. Get analysis from Groq from child features & results
            analysis = groq_analysis(child_data_text, results_text)

            return JsonResponse({'success': True, 'analysis': analysis, 'child_data_text': child_data_text, 'results_text': results_text})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'error': 'POST request required'})
