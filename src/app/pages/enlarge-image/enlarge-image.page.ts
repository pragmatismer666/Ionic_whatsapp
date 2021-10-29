/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-enlarge-image',
  templateUrl: './enlarge-image.page.html',
  styleUrls: ['./enlarge-image.page.scss'],
})
export class EnlargeImagePage implements OnInit {

  image

  constructor(
    private actRouter: ActivatedRoute,
    private navCtrl: NavController,
  ) { 
    
    this.image = this.actRouter.snapshot.paramMap.get('image');
  }

  ngOnInit() {
  }

  close() {
    this.navCtrl.pop();
  }

}
