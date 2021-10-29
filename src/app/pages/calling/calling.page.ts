/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { LoadingService } from './../../services/loading.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import * as firebase from 'firebase';

declare var apiRTC: any

@Component({
  selector: 'app-calling',
  templateUrl: './calling.page.html',
  styleUrls: ['./calling.page.scss'],
})
export class CallingPage implements OnInit {


  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;

  session;
  webRTCClient;
  incomingCallId = 0;
  myCallId;
  status;
  calleeId;
  image;
  name;
  userId

  constructor(
    private navCtrl: NavController,
    private actRoute: ActivatedRoute,
    private nativeAudio: NativeAudio,
    private toastController: ToastController,
    public angularDb: AngularFireDatabase,
    public loading: LoadingService
  ) {
    this.nativeAudio.preloadSimple('calling', 'assets/audio/PhoneRinging.wav');
    // this.InitializeApiRTC();
    this.image = this.actRoute.snapshot.paramMap.get('image')
    this.name = this.actRoute.snapshot.paramMap.get('name')
    this.userId = this.actRoute.snapshot.paramMap.get('userId');

  }


  ngOnInit() {
    // let update who on the calling 


    // this.dataService.groups(this.groupId).remove();
    this.nativeAudio.play('calling')

    setTimeout(() => {
      this.presentToast()
    }, 5000);
  }

  InitializeApiRTC() {
    //apiRTC initialization
    apiRTC.init({
      apiKey: "819abef1fde1c833e0601ec6dd4a8226",
      // apiCCId : "2",
      onReady: (e) => {
        this.sessionReadyHandler(e);
      }
    });
  }

  sessionReadyHandler(e) {
    this.myCallId = apiRTC.session.apiCCId;
    this.InitializeControls();
    this.AddEventListeners();
    this.InitializeWebRTCClient();
  }

  InitializeControlsForHangup() {
    this.showCall = true;
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
  }

  RemoveMediaElements(callId) {
    this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }


  InitializeWebRTCClient() {
    this.webRTCClient = apiRTC.session.createWebRTCClient({
      status: "status" //Optionnal
    });
    /*    this.webRTCClient.setAllowMultipleCalls(true);
        this.webRTCClient.setVideoBandwidth(300);
        this.webRTCClient.setUserAcceptOnIncomingCall(true);*/
  }

  InitializeControls() {
    this.showCall = true;
    this.showAnswer = false;
    this.showHangup = false;
    this.showReject = false;
  }

  InitializeControlsForIncomingCall() {
    this.showCall = false;
    this.showAnswer = true;
    this.showReject = true;
    this.showHangup = true;

  }

  AddEventListeners() {
    apiRTC.addEventListener("userMediaSuccess", (e) => {
      this.showStatus = true;
      this.showMyVideo = true;

      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "mini", 'miniElt-' + e.detail.callId, {
        width: "128px",
        height: "96px"
      }, true);

    });

    apiRTC.addEventListener("userMediaError", (e) => {
      this.InitializeControlsForHangup();
      this.status = this.status + "<br/> The following error has occurred <br/> " + e;
    });

    apiRTC.addEventListener("incomingCall", (e) => {
      this.InitializeControlsForIncomingCall();
      this.incomingCallId = e.detail.callId;
    });

    apiRTC.addEventListener("hangup", (e) => {
      if (e.detail.lastEstablishedCall === true) {
        this.InitializeControlsForHangup();
      }
      this.status = this.status + "<br/> The call has been hunged up due to the following reasons <br/> " + e.detail.reason;
      this.RemoveMediaElements(e.detail.callId);
    });

    apiRTC.addEventListener("remoteStreamAdded", (e) => {
      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote", 'remoteElt-' + e.detail.callId, {
        width: "300px",
        height: "225px"
      }, false);
    });

    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      // console.log("webRTC Client Created");
      this.webRTCClient.setAllowMultipleCalls(true);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);

      /*      this.InitializeControls();
            this.AddEventListeners();*/

      //this.MakeCall("729278");
    });

  }

  //end the call
  endCall() {
    
    this.loading.show()
    this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/call/').push({
      date: new Date().toString(),
      userId: this.userId,
      type: 'calling',
      icon: 'videocam',
      call: 'call'
    }).then(() => {
      this.angularDb.list('/accounts/' + this.userId + '/call/').push({
        date: new Date().toString(),
        userId: firebase.auth().currentUser.uid,
        type: 'calling',
        icon: 'videocam',
        call: 'misscall'
      }).then(() => {
        this.nativeAudio.stop('calling')
        this.navCtrl.pop();
        this.loading.hide();
      });
    })
  }

  //present the toast notification
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'If not working on your phone will be updated on next version? send your Bugs.',
      duration: 2000
    });
    toast.present();
  }

}
