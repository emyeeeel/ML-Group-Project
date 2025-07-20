import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChoiceComponent } from '../../shared/components/choice/choice.component';
import { ASSESSMENT_QUESTIONS, Question, AssessmentForm } from '../../shared/constants/questions';
import { User } from '../../models/user';
import { ClassifierService } from '../../services/classifier.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-assess',
  standalone: true,
  imports: [
    CommonModule, 
    ChoiceComponent 
  ],
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {
  allQuestions: Question[] = ASSESSMENT_QUESTIONS;
  currentQuestion: Question | undefined;
  questionIndex = 1;
  userAnswers: { [key: string]: any } = {};
  user: User | null = null;
  finalResults: any = null;

  constructor(
    private router: Router,
    private classifierService: ClassifierService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userAnswers['age'] = Number(this.user!.age);
    } else {
      this.router.navigate(['/login']);
      return;
    }
    this.loadNextQuestion();
  }

  loadNextQuestion(): void {
    if (this.questionIndex < this.allQuestions.length) {
      this.currentQuestion = this.allQuestions[this.questionIndex];
    } else {
      this.currentQuestion = undefined;
      this.finishAssessment();
    }
  }

  handleAnswer(answer: { questionId: string; value: number }): void {
    this.userAnswers[answer.questionId] = answer.value;
    setTimeout(() => {
      this.questionIndex++;
      this.loadNextQuestion();
    }, 500);
  }

  private calculateScoresAndLevels(answers: { [key: string]: any }): AssessmentForm {
    const payload: Partial<AssessmentForm> = { ...answers };

    const categoryQuestionIds = {
      access: ['do_you_have_a_tv,_game_console,_tablet,_or_computer_with_internet__in_your_bedroom?', 'do_you_have_your_own__phone,_tablet,_or_other__portable_screen?', 'do_you_use_screens__during_meals_(breakfast,__lunch,_or_dinner)?', 'do_you_use_screens__on_school_nights__(monday_to_friday)?', 'do_you_use_screens_while__waiting_(e.g.,_in_line_or_in__the_car)?'],
      frequency: ['how_old_were_you__when_you_first_used__a_screen_(tv,_tablet,__phone,_etc.)?', 'about_how_many__hours_do_you_use__screens_each_day?', 'do_you_use_screens__at_bedtime_to_help__you_fall_asleep?', "do_you_use_screens__when_you're_feeling__upset_to_calm_down?"],
      content: ['do_you_watch_or_play__things_that_have_fighting__or_violence?', 'do_you_choose_your__own_shows_or_download__your_own_apps?', 'are_the_shows_or__games_you_usually_use:'],
      interactivity: ['do_you_usually_watch_tv_or_videos:', 'do_you_usually_play__games_or_use_apps:', "when_watching_tv_or_movies,__how_often_does_a_grownup_talk__to_you_or_ask_questions_about__what's_happening?", "after_watching_or_playing,__how_often_does_a_grownup_talk_with_you_about_what_it_was_about_or_what_you_liked?:"]
    };

    payload.total_access_score = categoryQuestionIds.access.reduce((sum, id) => sum + (answers[id] || 0), 0);
    payload.total_frequency_score = categoryQuestionIds.frequency.reduce((sum, id) => sum + (answers[id] || 0), 0);
    payload.total_content_score = categoryQuestionIds.content.reduce((sum, id) => sum + (answers[id] || 0), 0);
    payload.total_interactivity_score = categoryQuestionIds.interactivity.reduce((sum, id) => sum + (answers[id] || 0), 0);

    payload.access_level = payload.total_access_score >= 4 ? 0 : 1;
    payload.frequency_level = payload.total_frequency_score >= 5 ? 0 : 1;
    payload.content_level = payload.total_content_score >= 3 ? 0 : 1;
    payload.interactivity_level = payload.total_interactivity_score >= 3 ? 0 : 1;

    return payload as AssessmentForm;
  }

 finishAssessment(): void {
  const finalPayload = this.calculateScoresAndLevels(this.userAnswers);
  console.log('Final payload to send:', finalPayload);

  forkJoin({
    predictions: this.classifierService.classify(finalPayload),
    interpretations: this.classifierService.interpret(finalPayload)
  }).subscribe({
    next: (results) => {
      console.log('Combined API Responses:', results);
      
      this.finalResults = { 
        predictions: results.predictions,
        interpretations: results.interpretations,
        scores: {
          access: finalPayload.total_access_score,
          frequency: finalPayload.total_frequency_score,
          content: finalPayload.total_content_score,
          interactivity: finalPayload.total_interactivity_score
        }
      };
    },
    error: (err) => {
      console.error('Error during API calls:', err);
    }
  });
}

navigateToResults(): void {
  if (this.finalResults) {
    this.router.navigate(['/result'], { state: this.finalResults });
  }
}

}