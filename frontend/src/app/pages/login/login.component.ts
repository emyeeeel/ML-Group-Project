import { Component } from '@angular/core';
import { SignInComponent } from "../../shared/components/sign-in/sign-in.component";

@Component({
  selector: 'app-login',
  imports: [SignInComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
