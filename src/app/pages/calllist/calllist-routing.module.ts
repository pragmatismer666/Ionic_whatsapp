import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalllistPage } from './calllist.page';

const routes: Routes = [
  {
    path: '',
    component: CalllistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalllistPageRoutingModule {}
