import { Component, OnInit } from '@angular/core';
import { QUESTIONS_BY_CATEGORY, QuestionCategory, Question } from '../../constants/questions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test',
  imports: [CommonModule, FormsModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  questionsByCategory = QUESTIONS_BY_CATEGORY;
  assessmentAnswers: { [key: string]: number } = {}; // Stores the user's answers keyed by question id

  constructor() {}

  ngOnInit(): void {}

  getCategories(): QuestionCategory[] {
    return Object.keys(this.questionsByCategory) as QuestionCategory[];
  }
  
  
  submit() {
    console.log('Assessment Answers:', this.assessmentAnswers);
    // You can calculate scores, navigate, or store the result
  }
  
}
