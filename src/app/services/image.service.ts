/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  //Image Service
  //This is the Service Take the image processing including uploading image to firebase
  //set encodingType before uplaoding the image on firebase

  private groupPhotoOption: CameraOptions;

  constructor(
    private camera: Camera,
    private afstorage: AngularFireStorage,
    private loading: LoadingService,
    private alertCtrl: AlertController,
    public angularDb: AngularFireDatabase,
  ) {
    this.groupPhotoOption = {
      quality: 100,
      targetHeight: 530,
      targetWidth: 530,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true
    }
  }

  setGroupPhotoProfile(groupId, sourceType) {
    return new Promise((resolve, reject) => {
      this.groupPhotoOption.sourceType = sourceType;
      this.camera.getPicture(this.groupPhotoOption).then((imageData) => {
        let url = "data:image/jpeg;base64," + imageData;
        let imgBlob = this.imgURItoBlob(url);
        let metadata = {
          'contentType': imgBlob.type
        };
        this.loading.showPro();
        const ref = this.afstorage.ref('/groupsMessage/' + groupId + this.generateFilename())
        const task = ref.put(imgBlob, metadata)
        task.snapshotChanges().pipe(
          finalize(async () => {
            ref.getDownloadURL().subscribe((url) => {
              resolve(url);
              this.loading.hidePro();
            });

          })
        ).subscribe()
      })

    })
  }
  setGroupPhoto(groupId, sourceType) {
    this.groupPhotoOption.sourceType = sourceType;
    this.camera.getPicture(this.groupPhotoOption).then((imageData) => {
      let url = "data:image/jpeg;base64," + imageData;
      let imgBlob = this.imgURItoBlob(url);
      let metadata = {
        'contentType': imgBlob.type
      };
      this.loading.showPro();
      const ref = this.afstorage.ref('/groups/' + this.generateFilename())
      const task = ref.put(imgBlob, metadata)
      task.snapshotChanges().pipe(
        finalize(async () => {
          ref.getDownloadURL().subscribe((url) => {
            groupId.img = url;
            this.loading.hidePro();
            this.showAlert('Photo', 'Your profile groups has been updated')
          })
        })
      ).subscribe()

    })

    // })
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

  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"],
    })
    await alert.present();
  }
}
