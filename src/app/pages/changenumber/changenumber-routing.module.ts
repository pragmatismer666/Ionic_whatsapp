import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangenumberPage } from './changenumber.page';

const routes: Routes = [
  {
    path: '',
    component: ChangenumberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangenumberPageRoutingModule {}
