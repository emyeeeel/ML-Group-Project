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
  interpretations: any = null;
  scores: any = null;
  recommendations: any = null;
  recommendation_header: string = '';
  interpretation_header: string = '';

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
      const fullAnalysis = state.interpretations.analysis || '';
  
      // Split based on recommendations header
      const splitText = fullAnalysis.split('**Recommendations for Intervention**');
      let rawInterpretation = splitText[0]?.trim() || '';
      let rawRecommendations = splitText[1]?.trim() || '';
  
      // Extract and remove header from interpretation (first non-empty line)
      const interpretationLines = rawInterpretation
        .split('\n')
        .filter((line: string) => line.trim() !== '');
  
      if (interpretationLines.length > 0) {
        this.interpretation_header = interpretationLines[0].replace(/\*/g, '').trim(); // e.g., remove "**"
        interpretationLines.shift(); // Remove header line
      }
  
      this.interpretations = {
        analysis: interpretationLines.join('\n').trim()
      };
  
      // ✅ Extract first sentence for recommendation_header
      const firstSentenceMatch = rawRecommendations.match(/^([\s\S]*?)(?=\n?\d+\.\s)/);
      if (firstSentenceMatch) {
        this.recommendation_header = firstSentenceMatch[1].trim();
        rawRecommendations = rawRecommendations.slice(firstSentenceMatch[1].length).trim();
      } else {
        this.recommendation_header = 'Recommendations for Intervention';
      }

  
      this.recommendations = rawRecommendations;
  
      console.log('Data successfully received on result page:', state);
    } else {
      console.log('No data found in history state, redirecting to login.');
      this.router.navigate(['/login']);
    }
  }
  

  getFormattedAnalysis(): SafeHtml {
    const analysisText = this.interpretations?.analysis || '';
  
    const categories = [
      { key: 'Inattentive Result:', label: 'Inattentive Result' },
      { key: 'Hyperactive Impulsive Result:', label: 'Hyperactive/Impulsive Result' },
      { key: 'Oppositional Defiant Result:', label: 'Oppositional/Defiant Result' }
    ];
  
    const unwantedPhrases = [
      'Symptoms not clinically significant \\(Class: 0\\)',
      'Mild symptoms \\(Class: 1\\)',
      'Moderate symptoms \\(Class: 2\\)',
      'Severe symptoms \\(Class: 3\\)'
    ];
  
    const formattedSections = categories.map(({ key, label }) => {
      const regex = new RegExp(`${key}(.*?)(?=${categories.map(c => c.key).filter(k => k !== key).join('|')}|$)`, 's');
      const match = analysisText.match(regex);
  
      if (!match) return '';
  
      let content = match[1].trim();
  
      // Remove unwanted symptom description lines
      for (const phrase of unwantedPhrases) {
        const removeRegex = new RegExp(phrase, 'g');
        content = content.replace(removeRegex, '');
      }
  
      // Remove asterisks, trim extra newlines and normalize spacing
      content = content.replace(/\*/g, '').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  
      // Emphasize keywords
      content = content.replace(
        /(age|gender|grade level|family structure|screen access|screen usage patterns|content level|interactivity level|total access score|total frequency score)/gi,
        '<strong>$1</strong>'
      );
  
      const sentences: string[] = content
        .split(/(?<=\.)\s+/)
        .filter((p: string) => p.trim() !== '');

      const bulletPoints: string = sentences
        .map((p: string) => `<li>${p.trim()}</li>`)
        .join('');

  
      return `
        <div class="analysis-section">
          <h3>${label}</h3>
          <ul class="analysis-points">${bulletPoints}</ul>
        </div>
      `;
    });
  
    const formattedHtml = formattedSections.join('');
    return this.sanitizer.bypassSecurityTrustHtml(formattedHtml);
  }
  
  
  

  getFormattedRecommendations(): string {
    const text: string = this.recommendations || '';
  
    // Split the text by numbers like "1. ", "2. ", etc.
    const parts: string[] = text.split(/(?=\d+\.\s)/);
  
    const formatted: string = parts.map((part: string) => part.trim()).join('\n\n');
  
    return formatted;
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
