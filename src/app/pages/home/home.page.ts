/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { StatusService } from './../../services/status.service';
import { SettingComponent } from './../../component/setting/setting.component';
import { CameraPage } from './../camera/camera.page';
import { CallPage } from './../call/call.page';
import { StatusPage } from './../status/status.page';
import { ChatPage } from './../chat/chat.page';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
// import { SuperTabs } from '@ionic-super-tabs/angular';
import { IonNav, PopoverController, Platform } from '@ionic/angular';
import { SuperTabChangeEventDetail } from '@ionic-super-tabs/core';
import { SuperTabs } from '@ionic-super-tabs/angular';
import { ScrollHideConfig } from '../../directives/header-scroll.directive';
import { Network } from '@ionic-native/network/ngx';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('superTabs', { static: false }) st: SuperTabs;

  activeTabIndex: number;
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 60 };



  tabs = 'chat'

  camera: any = CameraPage
  chat: any = ChatPage;
  status: any = StatusPage;
  calls: any = CallPage;

  constructor(
    private popoverController: PopoverController,
    private network: Network,
    private statusService: StatusService,
    private platform: Platform,

  ) {
    // calling the connetion to invoke 
    this.connection();
    this.platform.pause.subscribe(() => {
      this.statusService.offlineStatusLog();
    })
    this.platform.resume.subscribe(() => {
      this.statusService.onlineStatus();
    }) 

  }

  ngOnInit() {

  }
  // set the connection when the data offline   
  connection() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.statusService.offlineStatusLog();
    });
    disconnectSubscription.unsubscribe
    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.statusService.onlineStatus();
      setTimeout(() => {
        if (this.network.type === 'wifi') {
        }
      }, 3000);
    });
    connectSubscription.unsubscribe();
  }

  async showPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SettingComponent,
      cssClass: 'my-custom-class',
      event: ev,
      componentProps: { tabs: this.tabs },
      translucent: true
    });
    return await popover.present();
  }

  // this handle the swipebale tab
  onTabChange(ev: CustomEvent<SuperTabChangeEventDetail>) {
    this.activeTabIndex = ev.detail.index;

    switch (this.activeTabIndex) {
      case 0:
        this.tabs = 'camera'
        break;
      case 1:
        this.tabs = 'chat'
        break;
      case 2:
        this.tabs = 'status'
        break;
      case 3:
        this.tabs = 'calls'
        break;
    }
  }


}
