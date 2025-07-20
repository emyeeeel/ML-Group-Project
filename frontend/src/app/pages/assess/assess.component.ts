import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChoiceComponent } from '../../shared/components/choice/choice.component';
import { ASSESSMENT_QUESTIONS, Question, AssessmentForm, QuestionCategory, QUESTIONS_BY_CATEGORY } from '../../shared/constants/questions';
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

  private computeTotalScore(category: QuestionCategory): number {
    return QUESTIONS_BY_CATEGORY[category].reduce(
      (sum, q) => sum + (this.userAnswers[q.id] ?? 0),
      0
    );
  }

  private calculateScoresAndLevels(answers: { [key: string]: any }): AssessmentForm {
    const payload: Partial<AssessmentForm> = { ...answers };

    payload.total_access_score = this.computeTotalScore('access');
    payload.total_frequency_score = this.computeTotalScore('frequency');
    payload.total_content_score = this.computeTotalScore('content');
    payload.total_interactivity_score = this.computeTotalScore('interactivity');

    payload.access_level = payload.total_access_score <= 2 ? 0 : 1;
    payload.frequency_level = payload.total_frequency_score <= 4 ? 0 : 1;
    payload.content_level = payload.total_content_score <= 2 ? 0 : 1;
    payload.interactivity_level = payload.total_interactivity_score <= 3 ? 1 : 0;

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