import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  gameIdInput: string = '';
  gameIdMatched: boolean = false;

  user: User = {
    name: '',
    age: null
  };

  constructor(private router: Router) {}

  onEnterClick() {
    if (this.gameIdInput === '11022') {
      this.gameIdMatched = true;
    } else {
      alert('Invalid Game PIN');
    }
  }

  onSubmit() {
    console.log(this.user);
    localStorage.setItem('user', JSON.stringify(this.user));
    console.log('User saved to local storage');
    this.router.navigate(['/assess']);
  }
}
