
/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/

import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requestinfo',
  templateUrl: './requestinfo.page.html',
  styleUrls: ['./requestinfo.page.scss'],
})
export class RequestinfoPage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }
  
  back(){
    this.navCtrl.pop();
  }
}
