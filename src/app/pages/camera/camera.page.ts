/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingService } from './../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { finalize } from 'rxjs/operators';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  private cameraStatus: CameraOptions;

  constructor(
    private camera: Camera,
    private loading: LoadingService,
    private afstorage: AngularFireStorage,
    public angularDb: AngularFireDatabase

  ) {
    this.cameraStatus = {
      quality: 100,
      targetHeight: 530,
      targetWidth: 530,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true
    }
  }

  ngOnInit() {

  }

  // selete from the gallery part
  galleryOption() {
    this.uploadPhotoStatus(this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
      this.send(url)
    })

  }

  // selete from the camera part
  cameraOption() {
    this.uploadPhotoStatus(this.camera.PictureSourceType.CAMERA).then((url) => {
      this.send(url)
    })

  }

  // this handle the upload to the firebase 
  // it handle the selection from the image after will be upload to firebase storage 
  // also will be return the download url
  uploadPhotoStatus(sourceType) {
    return new Promise((resolve) => {
      this.cameraStatus.sourceType = sourceType;
      this.camera.getPicture(this.cameraStatus).then((imageData) => {
        let url = "data:image/jpeg;base64," + imageData;
        let imgBlob = this.imgURItoBlob(url);
        let metadata = {
          'contentType': imgBlob.type
        };
        this.loading.showPro();
        const ref = this.afstorage.ref('/status/' + firebase.auth().currentUser.uid + this.generateFilename())
        const task = ref.put(imgBlob, metadata)
        task.snapshotChanges().pipe(
          finalize(async () => {
            ref.getDownloadURL().subscribe((url) => {
              resolve(url);
              this.loading.hidePro();
            })
          })
        ).subscribe()
      })
    })
  }

  // set the random name
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  //reduce the quality of the image
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

  // post the story 
  send(url) {
    var promise = new Promise((resolve) => {
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

}
