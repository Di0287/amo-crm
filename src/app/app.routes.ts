import { Routes } from '@angular/router';
import {Page404Component} from './componets/page-404/page-404.component';
import {LeadsComponent} from './componets/leads/leads.component';
import {LeadAddComponent} from './componets/leads/lead-add/lead-add.component';
import {LeadEditComponent} from './componets/leads/lead-edit/lead-edit.component';
import {LeadsStatusComponent} from './componets/leads/lead-status/leads-status.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'leads',
    pathMatch: 'full'
  },
  {
    path:'leads',
    component: LeadsComponent,
  },
  {
    path:'leads/add',
    component: LeadAddComponent,
  },
  {
    path:'leads/stages',
    component: LeadsStatusComponent,
  },
  {
    path:'leads/:id',
    component: LeadEditComponent,
  },
  {
    path: '**',
    component: Page404Component,
  }
];
