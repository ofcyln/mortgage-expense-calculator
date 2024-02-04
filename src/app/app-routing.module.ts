import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { CalculateComponent } from './components/calculate/calculate.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/calculate',
    pathMatch: 'full',
  },
  { path: 'calculate', component: CalculateComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
