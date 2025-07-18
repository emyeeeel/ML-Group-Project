import { Injectable } from '@angular/core';
import { ChoiceModel } from '../models/choice';
import { Question } from '../shared/constants/questions';

@Injectable({
  providedIn: 'root'
})
export class GenerateChoiceService {
  private readonly shapeCycle = ['triangle', 'diamond', 'circle', 'square'];
  private readonly colorCycle = ['#E31A3C', '#1268CD', '#D79F00', '#26890A'];

  generateFromQuestion(question: Question): ChoiceModel[] {
    return question.choices.map((choice, index) => ({
      backgroundColor: this.colorCycle[index % this.colorCycle.length],
      shape: this.shapeCycle[index % this.shapeCycle.length] as 'triangle' | 'diamond' | 'circle' | 'square',
      text: choice.label,
      value: choice.value  // optional: track value if needed
    }));
  }
}