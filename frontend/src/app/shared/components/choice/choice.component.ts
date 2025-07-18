import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoiceModel } from '../../../models/choice';
import { GenerateChoiceService } from '../../../services/generate-choice.service';
import { Question } from '../../constants/questions';

@Component({
  selector: 'app-choice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnChanges {
  @Input() currentQuestion!: Question;
  @Output() onAnswer = new EventEmitter<{ questionId: string, value: number }>();

  choices: ChoiceModel[] = [];
  selectedChoiceIndex: number | null = null;

  constructor(private generateChoiceService: GenerateChoiceService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentQuestion'] && this.currentQuestion) {
      this.choices = this.generateChoiceService.generateFromQuestion(this.currentQuestion);
      this.selectedChoiceIndex = null;
    }
  }

  onSelectChoice(index: number): void {
    if (this.selectedChoiceIndex === null) {
      this.selectedChoiceIndex = index;
      this.onAnswer.emit({
        questionId: this.currentQuestion.id,
        value: this.choices[index].value ?? 0
      });
    }
  }

  isDisabled(index: number): boolean {
    return this.selectedChoiceIndex !== null && this.selectedChoiceIndex !== index;
  }
}