import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserpagePage } from './userpage.page';

const routes: Routes = [
  {
    path: '',
    component: UserpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserpagePageRoutingModule {}
