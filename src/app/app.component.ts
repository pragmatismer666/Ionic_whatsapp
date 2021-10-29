/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/

import { Component } from '@angular/core';
import { StatusService } from './services/status.service';


import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  darkMode

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public statusService: StatusService
  ) {
    this.initializeApp();
    this.darkMode = window.localStorage.getItem('dark');

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkDarkTheme()
      this.splashScreen.hide();
      this.statusService.offlineStatus();
    });
  }

  checkDarkTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      document.body.classList.toggle('dark');
      this.statusBar.styleBlackTranslucent();
    } else if (this.darkMode) {
      document.body.classList.toggle('dark');
      this.statusBar.styleBlackTranslucent();
    } else {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#054D44');
    }
  }
}
