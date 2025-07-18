import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChoiceComponent } from '../../shared/components/choice/choice.component';
import { ASSESSMENT_QUESTIONS, Question } from '../../shared/constants/questions';

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
  questionIndex = 0;
  userAnswers: { [key: string]: number } = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
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

  handleAnswer(answer: { questionId: string, value: number }): void {
    this.userAnswers[answer.questionId] = answer.value;
    
    setTimeout(() => {
      this.questionIndex++;
      this.loadNextQuestion();
    }, 500);
  }

  finishAssessment(): void {
    console.log('Assessment Finished! Ready to send to backend:', this.userAnswers);
    // Later, we can navigate to a results page here.
  }
}