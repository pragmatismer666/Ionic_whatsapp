import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatsettingPage } from './chatsetting.page';

const routes: Routes = [
  {
    path: '',
    component: ChatsettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsettingPageRoutingModule {}
