import { ContestDetailComponent } from './components/contest-detail/contest-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateContestComponent } from './components/create-contest/create-contest.component';
import { ContestGridComponent } from './components/contest-grid/contest-grid.component';

const routes: Routes = [
  {
    path: 'contests',
    component: DashboardComponent,
    children: [
      {
        path: ':phase',
        component: ContestGridComponent
      },
      {
        path: '',
        redirectTo: 'ongoing',
        pathMatch: 'full'
      }
    ],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'contest/create',
    component: CreateContestComponent
  },
  {
    path: 'contest/:id',
    component: ContestDetailComponent
    /*   children: [
      {
        path: 'participation/:id'
      }
    ] */
  },
  {
    path: '',
    redirectTo: '/contests/ongoing',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/contests/ongoing'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
