import { ReportComponent } from './pages/report/report.component';
import { Routes } from '@angular/router';
import { FormComponent } from './pages/form/form.component';
import { SuccessComponent } from './pages/success/success.component';

export const routes: Routes = [
    { path: 'form', component: FormComponent },
    { path: 'success', component: SuccessComponent },
    { path: 'report', component: ReportComponent },
    { path: '**', pathMatch: 'full', redirectTo: '/form' }
];
