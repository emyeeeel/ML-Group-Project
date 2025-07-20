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
      this.interpretations = state.interpretations;
      this.scores = state.scores;
      console.log('Data successfully received on result page:', state);
    } else {
      console.log('No data found in history state, redirecting to login.');
      this.router.navigate(['/login']);
    }
  }

  getFormattedAnalysis(): SafeHtml {
    const analysisText = this.interpretations?.analysis || '';
    const formattedText = analysisText.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }

  backToStart(): void {
    this.router.navigate(['/login']);
  }
}