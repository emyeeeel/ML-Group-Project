import { Routes } from '@angular/router';
import { AssessComponent } from './pages/assess/assess.component';
import { LoginComponent } from './pages/login/login.component';
import { ResultComponent } from './pages/result/result.component'; 

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'assess', 
    component: AssessComponent 
  },
  { 
    path: 'result', 
    component: ResultComponent 
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
];