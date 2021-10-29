import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./pages/verify/verify.module').then(m => m.VerifyPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'initia',
    loadChildren: () => import('./pages/initia/initia.module').then(m => m.InitiaPageModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'do-chat',
    loadChildren: () => import('./pages/do-chat/do-chat.module').then(m => m.DoChatPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'chatsetting',
    loadChildren: () => import('./pages/chatsetting/chatsetting.module').then(m => m.ChatsettingPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'changenumber',
    loadChildren: () => import('./pages/changenumber/changenumber.module').then(m => m.ChangenumberPageModule)
  },
  {
    path: 'security',
    loadChildren: () => import('./pages/security/security.module').then(m => m.SecurityPageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./pages/update/update.module').then(m => m.UpdatePageModule)
  },
  {
    path: 'userpage',
    loadChildren: () => import('./pages/userpage/userpage.module').then(m => m.UserpagePageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactPageModule)
  },
  {
    path: 'newgroup',
    loadChildren: () => import('./pages/newgroup/newgroup.module').then(m => m.NewgroupPageModule)
  },
  {
    path: 'show-status',
    loadChildren: () => import('./pages/show-status/show-status.module').then(m => m.ShowStatusPageModule)
  },
  {
    path: 'group-chat',
    loadChildren: () => import('./pages/group-chat/group-chat.module').then(m => m.GroupChatPageModule)
  },
  {
    path: 'group-info',
    loadChildren: () => import('./pages/group-info/group-info.module').then(m => m.GroupInfoPageModule)
  },
  {
    path: 'group-info-edite',
    loadChildren: () => import('./pages/group-info-edite/group-info-edite.module').then(m => m.GroupInfoEditePageModule)
  },
  {
    path: 'calling',
    loadChildren: () => import('./pages/calling/calling.module').then( m => m.CallingPageModule)
  },
  {
    path: 'broadcast',
    loadChildren: () => import('./pages/broadcast/broadcast.module').then( m => m.BroadcastPageModule)
  },
  {
    path: 'newbroadcast',
    loadChildren: () => import('./pages/newbroadcast/newbroadcast.module').then( m => m.NewbroadcastPageModule)
  },
  {
    path: 'broadcast-info',
    loadChildren: () => import('./pages/broadcast-info/broadcast-info.module').then( m => m.BroadcastInfoPageModule)
  },
  {
    path: 'addmembers',
    loadChildren: () => import('./pages/addmembers/addmembers.module').then( m => m.AddmembersPageModule)
  },
  {
    path: 'requestinfo',
    loadChildren: () => import('./pages/requestinfo/requestinfo.module').then( m => m.RequestinfoPageModule)
  },
  {
    path: 'accountinfo',
    loadChildren: () => import('./pages/accountinfo/accountinfo.module').then( m => m.AccountinfoPageModule)
  },
  {
    path: 'calllist',
    loadChildren: () => import('./pages/calllist/calllist.module').then( m => m.CalllistPageModule)
  },
  {
    path: 'delete-account',
    loadChildren: () => import('./pages/delete-account/delete-account.module').then( m => m.DeleteAccountPageModule)
  },
  {
    path: 'enlarge-image',
    loadChildren: () => import('./pages/enlarge-image/enlarge-image.module').then( m => m.EnlargeImagePageModule)
  },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
