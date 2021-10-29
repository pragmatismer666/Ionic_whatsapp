import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoChatPage } from './do-chat.page';

const routes: Routes = [
  {
    path: '',
    component: DoChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoChatPageRoutingModule {}
