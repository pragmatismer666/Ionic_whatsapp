/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Router } from '@angular/router';
import { DataService } from './../../services/data.service';
import { LoadingService } from './../../services/loading.service';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/database';
import { ImageService } from './../../services/image.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as _ from 'lodash';
import * as firebase from 'firebase';



@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {

  userId: any;

  userStory: any;

  currentPostStory;

  image;
  public storypost: any;

  constructor(
    private actionSheetController: ActionSheetController,
    public imageService: ImageService,
    private camera: Camera,
    public angularDb: AngularFireDatabase,
    public loading: LoadingService,
    public dataService: DataService,
    private router: Router
  ) {
    this.currentPostStory = true;
  }

  ngOnInit() {
    this.dataService.getCurrentUser(firebase.auth().currentUser.uid).valueChanges().subscribe((user) => {
      this.userId = firebase.auth().currentUser.uid
      this.image = user.img;
    })
    // get the current status from firebase database
    this.dataService.getStoryCurrent(firebase.auth().currentUser.uid).once("value", snap => {
      let Data = snap.val();
      this.userStory = Data.image
      if (Data.postBy == this.userId) {
        this.currentPostStory = false;
      }
    })

    this.dataService.getStory().valueChanges().subscribe((storylist) => {
      this.storypost = [];
      storylist.slice(-1,)
      storylist.forEach((post) => {
        let tempData = <any>{};

        tempData = post;
        //let get the user Info
        this.dataService.getUser(tempData.postBy).valueChanges().subscribe((user) => {
          tempData.userId = user.userId,
            tempData.avatar = user.img,
            tempData.name = user.nikeName
        })
        /* ===================== check the like list ========================*/
        this.dataService.getview(tempData.key).valueChanges().subscribe((likes) => {
          tempData.likes = likes.length;

          //====== check weather like or not ============//
          let isView = _.findKey(likes, view => {
            return view == firebase.auth().currentUser.uid;
          })
          // let do some logic
          if (isView) {
            tempData.isView = true;
          } else {
            tempData.isView = false;
          }
        });
        this.storypost.unshift(tempData);
      })
    })
  }

  async postStory() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.imageService.setGroupPhotoProfile(this.userId, this.camera.PictureSourceType.CAMERA).then((url) => {
              this.send(url)
            })
          }
        }, {
          text: 'Gallery',
          icon: 'images',
          role: 'cancel',
          handler: () => {
            this.imageService.setGroupPhotoProfile(this.userId, this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
              this.send(url)
            })
          }

        }]
    });

    await actionSheet.present();
  }

//Post the status 
  send(url) {
    var promise = new Promise((resolve, reject) => {
      this.angularDb.database.ref('/story').push({
        date: new Date().toString(),
        postBy: firebase.auth().currentUser.uid,
        image: url
      }).then((success) => {
        resolve(true);
        let timelineId = success.key;
        success.update({
          key: timelineId
        })
        this.loading.hidePro();
      })
    })
    return promise
  }

  //View the Story posted
  viewStory(story) {
    this.router.navigate(['show-status/', { 'storyId': story.key, 'username': story.name, 'image': story.avatar, 'imagePost': story.image, 'date': story.date }])
  }

  //View the Story posted
  viewStoryCurrent(story) {
    this.router.navigate(['show-status/', { 'storyId': story.key, 'username': story.name, 'image': story.avatar, 'imagePost': story.image, 'date': story.date }])
  }

  // this handle when the user already view the status then we can't pass the storyId Key
  viewStoryView(story) {
    this.router.navigate(['show-status/', { 'username': story.name, 'image': story.avatar, 'imagePost': story.image, 'date': story.date }])

  }

}
