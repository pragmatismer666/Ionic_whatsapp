/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from './../../services/data.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { WebrtcService } from '../../services/webrtc.service';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
})
export class CallPage implements OnInit {

  // topVideoFrame = 'partner-video';
  userId: string;
  // partnerId: string;
  // myEl: HTMLMediaElement;
  // partnerEl: HTMLMediaElement;

  call;

  constructor(
    public webRTC: WebrtcService,
    public elRef: ElementRef,
    public dataService: DataService,
    private router: Router,
    private callNumber: CallNumber,
    private afDB: AngularFireDatabase,
    private toast: ToastController
  ) {
    //invoke the current user ID pass to the variable userId
    this.userId = firebase.auth().currentUser.uid
  }

  //Initialize when first enter the view
  ngOnInit() {
    // then load the data from the firebase 
    this.dataService.call(this.userId).valueChanges().subscribe((call) => {
      this.call = [];
      // let make list forEach of item from the list
      call.forEach((callData) => {
        // make the tempData to an Object to whole the data
        let tempData = <any>{};
        // pass to the tempData
        tempData = callData;
        // also find user Info with his userId
        this.dataService.getUser(callData.userId).valueChanges().subscribe((user) => {
          // pass all data to the tempData
          tempData.nikeName = user.nikeName;
          tempData.img = user.img;
          tempData.userId = user.userId;
          tempData.phoneNumber = user.phoneNumber
        })
        this.call.unshift(tempData);
      })
      // }
    })

    // this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    // this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');
    // this.webRTC.init(this.userId, this.myEl, this.partnerEl);

  }

  // call() {
  //   this.webRTC.call(this.partnerId);
  //   this.swapVideo('my-video');
  // }

  // swapVideo(topVideo: string) {
  //   this.topVideoFrame = topVideo;
  // }

  // make the router to the calling list
  callList() {
    this.router.navigateByUrl('/calllist')
  }


  // router to the video call
  videoCall(item) {
    this.router.navigate(["/calling", { 'image': item.img, 'name': item.nikeName, 'userId': item.userId }])
  }

  // make a dial call
  callPhoneNumber(item) {
    this.callNumber.callNumber(`${item.phoneNumber}`, true).then(() => {
      //pass the info to each make call
      this.afDB.list('/accounts/' + firebase.auth().currentUser.uid + '/call/').push({
        date: new Date().toString(),
        userId: firebase.auth().currentUser.uid,
        type: 'calling',
        icon: 'call',
        call: 'call'
      }).then(() => {
        this.afDB.list('/accounts/' + this.userId + '/call/').push({
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'calling',
          icon: 'call',
          call: 'misscall'
        })
      })
      //if something goes wrong, the toast notification will handel
    }).catch(err => this.something());
  }

  // toast notification
  async something() {
    const toast = await this.toast.create({
      message: 'Something going wrong.',
      duration: 2000
    });
    toast.present();
  }

}
