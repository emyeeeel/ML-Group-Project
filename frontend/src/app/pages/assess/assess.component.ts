import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChoiceComponent } from '../../shared/components/choice/choice.component';
import { ASSESSMENT_QUESTIONS, Question } from '../../shared/constants/questions';
import { User } from '../../models/user';
import { ClassifierService } from '../../services/classifier.service';

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
  questionIndex = 1; // Skip first question (e.g., age)
  userAnswers: { [key: string]: any } = {}; // Store all answers here
  user: User | null = null;

  constructor(
    private router: Router,
    private classifierService: ClassifierService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;

    // Inject age from user object
    this.userAnswers['age'] = Number(this.user!.age);

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

  finishAssessment(): void {
    console.log('Final payload to send:', this.userAnswers); 
    this.classifierService.classify(this.userAnswers).subscribe({
      next: (response) => {
        console.log('Prediction response:', response);
      },
      error: (err) => {
        console.error('Error posting to classifier:', err);
      }
    });

    this.classifierService.interpret(this.userAnswers).subscribe({
      next: (response) => {
        console.log('Interpretation response:', response);
      },
      error: (err) => {
        console.error('Error posting to llm analyzer:', err);
      }
    });
  }
}