import { Routes } from '@angular/router';
import { ChoiceComponent } from './shared/components/choice/choice.component';
import { AssessComponent } from './pages/assess/assess.component';
import { TestComponent } from './shared/components/test/test.component';
import { SignInComponent } from './shared/components/sign-in/sign-in.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'assess', component: AssessComponent },
    { path: 'test', component: TestComponent },
];
