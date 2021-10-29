import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupInfoEditePage } from './group-info-edite.page';

const routes: Routes = [
  {
    path: '',
    component: GroupInfoEditePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupInfoEditePageRoutingModule {}
