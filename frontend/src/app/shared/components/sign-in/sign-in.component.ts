import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  gameIdInput: string = '';
  gameIdMatched: boolean = false;

  constructor(private router: Router) {}

  onEnterClick() {
    if (this.gameIdInput === '11022') {
      this.gameIdMatched = true;
    } else {
      alert('Invalid Game PIN');
    }
  }

  onSubmit(){
    this.router.navigate(['/assess']);
  }
}
