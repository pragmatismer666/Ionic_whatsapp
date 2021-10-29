/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { AlertController } from '@ionic/angular';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingService } from 'src/app/services/loading.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {


  userId: any;
  image: any;
  nikeName: any;
  usernameUpdate: any;

  public name: FormGroup;


  constructor(
    private router: Router,
    private dataService: DataService,
    public angularDb: AngularFireDatabase,
    private loading: LoadingService,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private afstorage: AngularFireStorage,
    private camera: Camera,

  ) {
    this.name = this.formBuilder.group({
      updateName: new FormControl('', Validators.compose([
        Validators.minLength(3),
        Validators.required,
      ])),
    });
    // this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    // if already open an account
    // or get the current account
    this.dataService.getCurrentUser(firebase.auth().currentUser.uid).valueChanges().subscribe((user) => {
      this.image = user.img;
      this.nikeName = user.nikeName;
    })

  }

  // this handle fi already authenticate will be exit the app
  update() {
    this.loading.show();
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid).once("value").then((profile) => {
      if (profile.val()) {
        this.angularDb.object("accounts/" + firebase.auth().currentUser.uid).update({
          nikeName: this.nikeName
        }).then(() => {
          this.loading.hide()
          this.router.navigateByUrl("/home")
        })
      }
    })

  }

  //handle the camera option
  async cameraOption() {
    const alert = await this.alertCtrl.create({
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
    })
    await alert.present();
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

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"],
    })
    await alert.present();
  }

  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
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

}
