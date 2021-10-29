import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddmembersPage } from './addmembers.page';

const routes: Routes = [
  {
    path: '',
    component: AddmembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddmembersPageRoutingModule {}
