import os
import joblib
import numpy as np
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

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

@csrf_exempt
def predict_results(request):
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

            return JsonResponse({'success': True, 'predictions': results})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'error': 'POST request required'})
