import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoiceModel } from '../../../models/choice';
import { GenerateChoiceService } from '../../../services/generate-choice.service';
import { ASSESSMENT_QUESTIONS, Question } from '../../constants/questions';

@Component({
  selector: 'app-choice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit {
  currentQuestion!: Question;
  choices: ChoiceModel[] = [];
  selectedChoiceIndex: number | null = null;

  constructor(private generateChoiceService: GenerateChoiceService) {}

  ngOnInit(): void {
    this.currentQuestion = ASSESSMENT_QUESTIONS[10]; 
    this.choices = this.generateChoiceService.generateFromQuestion(this.currentQuestion);
  }

  onSelectChoice(index: number): void {
    if (this.selectedChoiceIndex === null) {
      this.selectedChoiceIndex = index;
    }
  }

  isDisabled(index: number): boolean {
    return this.selectedChoiceIndex !== null && this.selectedChoiceIndex !== index;
  }
}
