/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { StatusService } from './../../services/status.service';
import { Platform, NavController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-status',
  templateUrl: './show-status.page.html',
  styleUrls: ['./show-status.page.scss'],
})
export class ShowStatusPage implements OnInit {

  status: any;
  id: any;

  storyId: any;
  username: any;
  image: any;
  timecounter
  imagePost: any
  date: any;
  progress = 0;
  constructor(
    private statusBar: StatusBar,
    private platform: Platform,
    private element: ElementRef,
    private navCtrl: NavController,
    private actRouter: ActivatedRoute,
    public statusService: StatusService
  ) {
    this.storyId = this.actRouter.snapshot.paramMap.get('storyId')
    this.username = this.actRouter.snapshot.paramMap.get('username')
    this.image = this.actRouter.snapshot.paramMap.get('image')
    this.imagePost = this.actRouter.snapshot.paramMap.get('imagePost');
    this.date = this.actRouter.snapshot.paramMap.get('date')
  }

  ngOnInit() {
    this.statusService.view(this.storyId);

    // Count the interval of status progress Bar
    setInterval(() => {
      this.progress += .1;
    }, 1000)
    setTimeout(() => {
      // then After completed Pop Back
      this.navCtrl.pop()
    }, 10500)
  }

  //Back Button
  back() {
    this.navCtrl.pop();
  }






}
