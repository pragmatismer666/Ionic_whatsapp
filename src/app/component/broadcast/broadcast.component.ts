/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { LoadingService } from './../../services/loading.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss'],
})
export class BroadcastComponent implements OnInit {
  //broadcast ID 
  broadcastId: any

  constructor(
    private router: Router,
    private navParams: NavParams,
    private popoverController: PopoverController,
    public afDB: AngularFireDatabase,
    private navCtrl: NavController,
    public loading: LoadingService
  ) {
    // get the broadcast ID
    this.broadcastId = this.navParams.get("broadcastId");
    // console.log(this.broadcastId)
  }

  ngOnInit() { }

  // this handel the navigaion to the broadcast info page
  broadcastInfo() {
    // before it proceed will be close the popOver controller
    this.eventFromPopover();
    // the router page
    this.router.navigate(['/broadcast-info', { 'broadcastId': this.broadcastId }]);
  }
  // close popOver function
  eventFromPopover() {
    this.popoverController.dismiss();
  }

  // this will delete the conversation content;
  async deleteBroadcast() {
    // before it proceed will be close the popOver controller
    this.eventFromPopover()
    // before it proceed loading service will show 
    this.loading.show()
    // this. handle the database from firebase  query methode
    await this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('key').equalTo(this.broadcastId).once('value', snap => {
      // convert to object valuse
      var res = snap.val();
      if (res != null) {
        let store = Object.keys(res)
        this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove();
      }
    }).then(() => {
      this.afDB.database.ref('groups').child(this.broadcastId).remove();
      //hide the loading service
      this.loading.hide();
      // pop back
      this.navCtrl.pop();
    })
  }

}
