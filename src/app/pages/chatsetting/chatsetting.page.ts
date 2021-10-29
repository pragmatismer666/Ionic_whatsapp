/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-chatsetting',
  templateUrl: './chatsetting.page.html',
  styleUrls: ['./chatsetting.page.scss'],
})
export class ChatsettingPage implements OnInit {

  darkMode: any = true;


  constructor(
    private toast: ToastController,
    private platform: Platform,
    private statusBar: StatusBar
  ) { }

  ngOnInit() {
    this.darkMode = false;
  }

  // this handle the themes toogel changing to default to dark mode
  cambio() {
    if (this.darkMode = !this.darkMode) {
      document.body.classList.toggle('dark');
      // pass to the local stoage 
      window.localStorage.setItem('dark', this.darkMode);
      let get = window.localStorage.getItem('dark')
      this.platform.ready().then(() => {
        // then intialize the statusBar to the black
        this.statusBar.styleBlackTranslucent();
      })
    } else {
      //clear the local storage
      window.localStorage.clear()
      //remove the local storage
      window.localStorage.removeItem('dark');
      this.platform.ready().then(() => {
        // then intialize the statusBar to the default one
        this.statusBar.backgroundColorByHexString('#054D44');
      })
      let get = window.localStorage.getItem('dark')
    }
  }


  //pop a notification
  async toastShow() {
    const toast = await this.toast.create({
      message: 'Oops, This feature is not availabe on this version.',
      duration: 3000,
      position: "top"
    });
    toast.present();
  }



}
