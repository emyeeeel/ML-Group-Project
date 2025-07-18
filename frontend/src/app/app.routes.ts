import { Routes } from '@angular/router';
import { ChoiceComponent } from './shared/components/choice/choice.component';
import { AssessComponent } from './pages/assess/assess.component';
import { TestComponent } from './shared/components/test/test.component';

export const routes: Routes = [
    { path: '', component: ChoiceComponent },
    { path: 'assess', component: AssessComponent },
    { path: 'test', component: TestComponent },
];
