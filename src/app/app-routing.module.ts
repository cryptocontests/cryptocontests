import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateContestComponent } from './components/create-contest/create-contest.component';

const routes: Routes = [
  {
    path: 'contests',
    component: DashboardComponent,
    children: [
      {
        path: 'create',
        component: CreateContestComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/contests',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/contests'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
