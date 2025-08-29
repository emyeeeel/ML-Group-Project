import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  predictions: any = null;
  scores: any = null;

  scoreInterpretationItems: string[] = [];
  clinicalInterpretation: string = ''; 
  recommendationsItems: string[] = [];

  // recommendation_header: string = 'Based on the feature values and predicted results, the following recommendations can be made:';
  // interpretation_header: string = 'Based on the provided results, here is a clinical interpretation of the features and their relationships to the predicted results:' ;

  readonly riskLevelMap: { [key: number]: string } = {
    0: 'Symptoms not clinically significant',
    1: 'Mild symptoms',
    2: 'Moderate symptoms',
    3: 'Severe symptoms'
  };

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const state = history.state;
  
    if (state && state.predictions && state.scores && state.interpretations) {
       this.predictions = state.predictions;
      this.scores = state.scores;
      

      const analysisText = state.interpretations?.analysis || '';
      console.log('Raw Analysis Text:', analysisText);


      this.parseAnalysis(analysisText);
    } else {
      console.log('No data found in history state, redirecting to login.');
      this.router.navigate(['/login']);
    }
  }

  private parseAnalysis(analysisText: string): void {
    if (!analysisText) return;

    const cleanText = analysisText.replace(/\*|:/g, ''); 

    const scoreInterpRegex = /Score Interpretation/;
    const clinicalInterpRegex = /Clinical Interpretation/;
    const recommendationsRegex = /Recommendations for Intervention/;

    const parts = cleanText
      .split(new RegExp(`${scoreInterpRegex.source}|${clinicalInterpRegex.source}|${recommendationsRegex.source}`))
      .map(p => p.trim());

    if (parts.length > 3) {
        const scoreText = parts[1] || '';
        this.clinicalInterpretation = parts[2] || 'Not available.';
        const recommendText = parts[3] || '';

        // Split score interpretation into individual items
        this.scoreInterpretationItems = scoreText
            .split(/(?=Total [A-Za-z]+ Score \(\d+\))/) // Split but keep the delimiter
            .map(item => item.trim())
            .filter(item => item.startsWith('Total'));

        // Split recommendations into a numbered list
        this.recommendationsItems = recommendText.split(/\d+\./).filter(item => item.trim() !== '');

    } else {
        this.clinicalInterpretation = cleanText;
    }

  }
  

  // getFormattedAnalysis(): string {
  //   let analysisText = this.interpretations?.analysis || '';
  
  //   const colonIndex = analysisText.indexOf(':');
  //   if (colonIndex !== -1) {
  //     analysisText = analysisText.slice(colonIndex + 1); 
  //   }
  
  //   const recommendationIndex = analysisText.search(/recommendations for intervention/i);
  //   if (recommendationIndex !== -1) {
  //     analysisText = analysisText.slice(0, recommendationIndex);
  //   }
  
  //   analysisText = analysisText.replace(/\*\s*/g, '');
  
  //   analysisText = analysisText.replace(
  //     /(Symptoms not clinically significant \(Class: 0\)|Mild symptoms \(Class: 1\)|Moderate symptoms \(Class: 2\)|Severe symptoms \(Class: 3\))/gi,
  //     ''
  //   );
  
  //   let finalAnalysisText = '';
    
  //   for (let i = 0; i < analysisText.length; i++) {
  //     if (analysisText[i] === ':') {
  //       finalAnalysisText += ': \n\n';
  //     } else {
  //       finalAnalysisText += analysisText[i];
  //     }
  //   }
  
  //   const keywords = [
  //     'Inattention',
  //     'Hyperactivity/Impulsivity',
  //     'Oppositional/Defiant Behavior',
  //     'Age and Grade Level',
  //     'Gender and Family Structure',
  //     'Screen Access',
  //     'Screen Usage Habits',
  //     'Screen Content',
  //     'Interactivity',
  //     'Sleep and Bedtime Routine',
  //     'Parental Involvement',
  //     'Relationships to Predicted Results',
  //     'Inattentive Result',
  //     'Hyperactive Impulsive Result',
  //     'Oppositional Defiant Result'
  //   ];
  
  //   keywords.forEach(word => {
  //     const regex = new RegExp(`\\b(${word})\\b`, 'g');
  //     finalAnalysisText = finalAnalysisText.replace(regex, '<strong>$1</strong>');
  //   });
  
  //   finalAnalysisText = finalAnalysisText
  //     .split(/\n{2,}/)
  //     .map((p: string) => p.trim())
  //     .join('<br><br>');
  
  //   return finalAnalysisText.trim();
  // }
    

  // getFormattedRecommendations(): string {
  //   const text: string = (this.recommendations || '').replace(/\*/g, '');
  
  //   const firstIndex = text.search(/\b1\.\s/);
  
  //   const cleanedText = firstIndex !== -1 ? text.slice(firstIndex) : text;
  
  //   const parts: string[] = cleanedText.split(/(?=\d+\.\s)/);
  //   const formatted: string = parts.map((part: string) => part.trim()).join('\n\n');
  
  //   return formatted;
  // }

  boldFirstPart(text: string): string {
    const match = text.match(/^(Total .*? Score \(\d+\))/);

    if (match && match[1]) {
      const label = match[1];
      const restOfText = text.substring(label.length).trim();
      return `<span class="bold-label">${label}:</span> ${restOfText}`;
    }
    
    return text; 
  }

  backToStart(): void {
    this.router.navigate(['/login']);
  }

  getShapeClass(level: number): string {
    switch (level) {
      case 0:
        return 'shape-none';
      case 1:
        return 'shape-mild';
      case 2:
        return 'shape-moderate';
      case 3:
        return 'shape-severe';
      default:
        return 'shape-none';
    }
  }

  getResultBoxClass(level: number): string {
    switch (level) {
      case 0:
        return 'result-box-none';
      case 1:
        return 'result-box-mild';
      case 2:
        return 'result-box-moderate';
      case 3:
        return 'result-box-severe';
      default:
        return 'result-box-none';
    }
  }
  
}
