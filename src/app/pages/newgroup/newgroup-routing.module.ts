import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewgroupPage } from './newgroup.page';

const routes: Routes = [
  {
    path: '',
    component: NewgroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewgroupPageRoutingModule {}
