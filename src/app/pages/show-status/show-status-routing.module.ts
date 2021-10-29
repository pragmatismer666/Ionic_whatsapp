import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowStatusPage } from './show-status.page';

const routes: Routes = [
  {
    path: '',
    component: ShowStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowStatusPageRoutingModule {}
