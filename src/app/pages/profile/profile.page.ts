/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { LoadingService } from './../../services/loading.service';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ToastController, NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  userId: any
  nikeName: any;
  description: any;
  image: any;

  constructor(
    private alertCtrl: AlertController,
    public dataService: DataService,
    private camera: Camera,
    public angularDb: AngularFireDatabase,
    private toast: ToastController,
    public loading: LoadingService,
    private navCtrl: NavController,
    private afstorage: AngularFireStorage,


  ) {
    // te user id
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    // get the current user from firebase
    this.dataService.getCurrentUser(this.userId).valueChanges().subscribe((user) => {
      this.nikeName = user.nikeName;
      this.description = user.description;
      this.image = user.img;
    })
  }


  // change the name of profile
  async changeName() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Enter your name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Your name',
          value: this.nikeName
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            let name = data["name"];
            this.loading.show();
            firebase.database().ref("accounts/").child(this.userId).once("value").then((user) => {
              if (user.val()) {
                this.angularDb.object("accounts/" + this.userId).update({
                  nikeName: name
                }).then(() => {
                  this.loading.hide();
                  this.updateProfileToast()
                })
              }
            })

          }
        }
      ]
    });

    await alert.present();
  }

  // this notify the user when updated the profile
  async updateProfileToast() {
    const toast = await this.toast.create({
      message: 'Your profile has been update? Please refresh the page, to view what you update',
      duration: 4000,
      position: 'top'

    })
    toast.present()
  }

  //change the description
  async changeDescription() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Change description',
      inputs: [
        {
          name: 'description',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Your about',
          value: this.description
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            let description = data['description']
            this.loading.show();
            firebase.database().ref("accounts/").child(this.userId).once("value").then((user) => {
              if (user.val()) {
                this.angularDb.object("accounts/" + this.userId).update({
                  description: description,
                  dateDec: new Date().toString()
                }).then(() => {
                  this.loading.hide();
                  this.updateProfileToast()
                })
              }
            })
          }
        }
      ]
    });

    await alert.present();
  }

  // back button
  back() {
    this.navCtrl.pop();
  }

  // change the photo Option
  async cameraOption() {
    const actionSheet = await this.alertCtrl.create({
      header: 'Select Profile Picture',
      buttons: [
        {
          text: 'Camera',
          role: 'camera',
          handler: () => {
            this.profilePictureCamera()
          }
        },
        {
          text: 'Gallery',
          cssClass: 'secondary',
          role: 'gallery',
          handler: () => {
            this.profilePictureGallery()
          }
        },
      ]
    });
    await actionSheet.present();
  }

  //for update the profile picture 
  async profilePictureCamera() {
    const option: CameraOptions = {
      quality: 100,
      targetHeight: 530,
      targetWidth: 530,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true
    }
    try {
      // this handle the upload to the firebase 
      // it handle the selection from the image after will be upload to firebase storage 
      this.camera.getPicture(option).then((imageData) => {
        this.loading.showPro()
        let url = "data:image/jpeg;base64," + imageData;
        let imgBlob = this.imgURItoBlob(url);
        let metadata = {
          'contentType': imgBlob.type
        };
        const ref = this.afstorage.ref('/myProfile/' + firebase.auth().currentUser.uid)
        const task = ref.put(imgBlob, metadata)
        //this will be delete for ther existing one
        task.snapshotChanges().pipe(
          finalize(async () => {
            ref.getDownloadURL().subscribe((image) => {
              this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid).update({
                img: image
              }).then(() => {
                this.loading.hidePro();
                this.showAlert('Profile', 'Your profile picture has been updated')
              })
            });

          })
        ).subscribe()
      })
    } catch (error) {

    }
  }

  async profilePictureGallery() {
    const option: CameraOptions = {
      quality: 100,
      targetHeight: 530,
      targetWidth: 530,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true
    }
    try {
      // this handle the upload to the firebase 
      // it handle the selection from the image after will be upload to firebase storage 
      this.camera.getPicture(option).then((imageData) => {
        this.loading.showPro()
        let url = "data:image/jpeg;base64," + imageData;
        let imgBlob = this.imgURItoBlob(url);
        let metadata = {
          'contentType': imgBlob.type
        };
        const ref = this.afstorage.ref('/myProfile/' + firebase.auth().currentUser.uid + this.generateFilename())
        const task = ref.put(imgBlob, metadata)
        //this will be delete for ther existing one
        task.snapshotChanges().pipe(
          finalize(async () => {
            ref.getDownloadURL().subscribe((image) => {
              this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid).update({
                img: image
              }).then(() => {
                this.loading.hidePro();
                this.showAlert('Profile', 'Your profile picture has been updated')
              })
            });

          })
        ).subscribe()
      })
    } catch (error) {

    }
  }

  imgURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  //Show the Alert 
  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"],
    })
    await alert.present();
  }

  //Generate the random Name
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }


}
