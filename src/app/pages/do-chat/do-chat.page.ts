/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { UserService } from './../../services/user.service';
import { DataService } from './../../services/data.service';
import { PopoverController, IonContent, ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { ChatmoreComponent } from './../../component/chatmore/chatmore.component';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { AngularFireObject, AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { EventService } from 'src/app/services/event.service';
import { ChatService } from 'src/app/services/chat.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';




@Component({
  selector: 'app-do-chat',
  templateUrl: './do-chat.page.html',
  styleUrls: ['./do-chat.page.scss'],
})
export class DoChatPage implements OnInit {

  list: AngularFireList<any>;

  playAudio = false;

  message: any;
  userId: any;
  @ViewChild('IonContent', { static: true }) IonContent: IonContent
  users: AngularFireObject<any>;
  onlineStatus = 'Online';
  messagesToShow = [];
  user: any;
  image: any;
  nikeName: any;
  status: any;
  isOnline: any;
  lastSeen: any;
  calling = true;
  currentUsername;
  sender: any;
  isBlock;
  blocks;
  me: any;
  currentUserId;
  isLoading = true;
  phoneNumber: any;
  recording = false;
  private chatPhotoOption: CameraOptions;


  statusRecord: string;
  audioFile: MediaObject;

  constructor(
    private popoverController: PopoverController,
    public dataService: DataService,
    private camera: Camera,
    public eventService: EventService,
    public router: Router,
    private nativeAudio: NativeAudio,
    private streamingMedia: StreamingMedia,
    public chatService: ChatService,
    private actRoute: ActivatedRoute,
    public ngZone: NgZone,
    private callNumber: CallNumber,
    private toast: ToastController,
    private afDB: AngularFireDatabase,
    private file: File,
    private media: Media,
    private afstorage: AngularFireStorage,
    private alertController: AlertController,
    private actionSheet: ActionSheetController,
    public loading: LoadingService,
    public userService: UserService,
  ) {
    // load sound effect fro the message sent
    this.nativeAudio.preloadSimple('send', 'assets/audio/send.wav');

    // set the current userId pass to veriable 
    this.currentUserId = firebase.auth().currentUser.uid;

    // option for the photo::: it handle thw quality of the image
    this.chatPhotoOption = {
      quality: 100,
      targetHeight: 530,
      targetWidth: 530,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true
    }
    // get the userId
    this.userId = this.actRoute.snapshot.paramMap.get('userId')
    // this.me = this.actRoute.snapshot.paramMap.get('me')
    setTimeout(() => {
      this.scrollToBottom()
    }, 10);
    // get messaging chat from chat Service
    this.eventService.subscribe('messages', () => {
      this.messagesToShow = [];
      this.ngZone.run(() => {
        this.readMessage();
        this.readMessageSender();
        this.messagesToShow = this.chatService.buddymessages;
        this.isLoading = false;
      })
    })
  }


  ngOnInit() {
    //Initialize the enterise of the app

    // Load the, if there is any unread message make it to read message
    this.readMessage();
    // get conversation equal to the userId has been pass,
    // this part may handle for view message and unread
    this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once("value", snap => {
      // make to the object values
      let me = snap.val();
      this.me = me.me;
    });
    // read the sender Message
    this.readMessageSender()
    // let invoke the user database from the firebase 
    // this will fet the data from the firebase
    this.dataService.getUser(this.userId).valueChanges().subscribe((user) => {
      this.user = user;
      this.nikeName = user.nikeName;
      this.isOnline = user.status;
      this.image = user.img;
      this.status = user.status;
      this.phoneNumber = user.phoneNumber;
      this.userId = user.userId;
      this.dataService.userBock(firebase.auth().currentUser.uid).valueChanges().subscribe((blocks) => {
        this.isBlock = _.findKey(blocks, block => {
          return block = firebase.auth().currentUser.uid;
        })
        // Block the user condition
        // if the condition is true,
        // you can send any things else
        if (this.isBlock) {
          this.isBlock = true;
        } else {
          this.isBlock = false;
        }
      })
      // this part handle for the current user 
      this.dataService.userBocks(firebase.auth().currentUser.uid).valueChanges().subscribe((blocks) => {
        this.blocks = _.findKey(blocks, block => {
          return block = this.userId;
        })
        if (this.blocks) {
          this.blocks = true;
        } else {
          this.blocks = false;
        }
      })
    })
  }

  //when message send scroll to the bottom
  scroll() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 10)
  }

  // Update messagesRead when user lefts this page.
  ionViewWillLeave() {
    this.eventService.destroy('chat:received');
  }
  // load the chat conversation methode
  ionViewDidLeave() {
    // load this from event Service provider
    this.eventService.subscribe('messages', () => { });
    // update the read and unread message
    this.readMessage();
    // read the sender mesages
    this.readMessageSender();
  }

  //When enter the pages first load the chat and 
  ionViewDidEnter() {
    this.readMessageSender();
    this.chatService.getMessage(this.userId);
    // after loaded scroll to the bottom 
    setTimeout(() => {
      this.scrollToBottom()
    }, 500)
  }

  readMessage() {
    // this is an Object 
    var updateRead = {
      read: 'read'
    }
    // this handle find the user equal to the userId
    this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once("value", snap => {
      //make it object Values
      var res = snap.val();
      // Obejct fine the key
      let key = Object.keys(res)
      this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(key[0]).once("value", value => {
        let me = value.val();
        if (me.me == 'you') {
          this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
            var res = snapshot.val();
            if (res != null) {
              let key = Object.keys(res)
              // if the user is unread message make to read Message,,
              this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(key[0]).update({ read: 'read' })
            }
          }).then(() => {
            // then pass ot the current user
            this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
              var res = snapshot.val();
              if (res != null) {
                let key = Object.keys(res)
                this.afDB.database.ref('conversations').child(this.userId).child(key[0]).update(updateRead)
              }
            })
          })
        }
        else if (me.me = ! 'me') {
          this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
            var res = snapshot.val();
            if (res != null) {
              let key = Object.keys(res)
              this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(key[0]).update(updateRead)
            }
          }).then(() => {
            this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
              var res = snapshot.val();
              if (res != null) {
                let key = Object.keys(res)
                this.afDB.database.ref('conversations').child(this.userId).child(key[0]).update(updateRead)
              }
            })
          })

        }
      });
    })


  }

  readMessageSender() {
    var updateRead = {
      read: 'read'
    }
    // get the current data enter the message  throught base on the user
    this.afDB.database.ref('messages').child(this.userId).child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
      var res = snapshot.val();
      if (res != null) {
        let key = Object.keys(res)
        for (let i = 0; i < key.length; i++) {
          this.afDB.database.ref('messages').child(this.userId).child(firebase.auth().currentUser.uid).child(key[i]).update(updateRead)
        }
      }
    }).then(() => {
      this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
        var res = snapshot.val();
        if (res != null) {
          let key = Object.keys(res)
          for (let i = 0; i < key.length; i++) {
            this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).child(key[i]).update(updateRead)
          }
        }
      })
    })

  }

  // animation when typing user
  animateMessage(message) {
    setTimeout(() => {
      var tick = message.querySelector('.tick');
      tick.classList.remove('tick-animation');
    }, 500);
  }

  // more option from do-chat pages
  // the popOver view the component from component 
  async more(ev: any) {
    const popover = await this.popoverController.create({
      component: ChatmoreComponent,
      cssClass: 'my-custom-class',
      event: ev,
      componentProps: { userId: this.userId },
      translucent: true
    });
    return await popover.present();
  }
  // router pass ot the contact page alone with the userId
  viewcontact() {
    this.router.navigate(['/contact', { 'userId': this.userId }])
  }

  // handle a send message to User
  // if it has been blocked, it can't send message
  sendMessage() {
    // the condition methode for blocked
    if (this.isBlock) {
      // if is true the actionSheet will present
      this.actionUnblock()
    } else {
      // if not blocked it allow to send message to user
      this.sendNewMessage(this.message).then(() => {
        // when send is completed then scroll to the bottom
        setTimeout(() => {
          this.scrollToBottom()
        }, 10)
        // aslo clear the message box
        this.message = '';
      })
    }
  }

  //send the photo to the user, is and choosen methode 
  async sendPhoto() {
    const alert = await this.actionSheet.create({
      header: "Send Photo  Message",
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            //Upload the image and return pormise
            this.uploadPhotoMessage(this.camera.PictureSourceType.CAMERA).then((url) => {
              this.sendNewPhoto(url);
            })
          },
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            // Upload the image and retunr pormise
            this.uploadPhotoMessage(this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
              //process photo massge on the database
              this.sendNewPhoto(url);
            })
          },
        },
        {
          text: 'Cancel',
          icon: 'help-circle',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    })
    alert.present();
  }

  // delete option weather delete from every one or from you, alone with key of message 
  async optionDelete(key) {
    const alert = await this.actionSheet.create({
      header: 'Delete Message from ' + this.nikeName,
      buttons: [
        {
          text: 'delete from me',
          handler: () => {
            this.deleteForMe(key)
          }
        },
        {
          text: 'delete from everyone',
          handler: () => {
            this.deleteForEveryOne(key)
          }
        },
        {
          text: 'cancel',
          handler: () => {
          }
        },
      ]
    })
    await alert.present();
  }
  // this function handle the delete from me message // alone with key of message able delete
  async optionDeleteForMe(key) {
    const alert = await this.actionSheet.create({
      header: 'Delete Message from ' + this.nikeName,
      buttons: [
        {
          text: 'delete from me',
          handler: () => {
            this.deleteForMe(key)
          }
        },
        {
          text: 'cancel',
          handler: () => {
          }
        },

      ]

    })
    await alert.present();
  }

  //send message to user
  sendNewMessage(message) {
    if (this.userId) {
      var promise = new Promise((resolve, reject) => {
        // is an object // able send message
        var messages = {
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'text',
          message: message,
          read: 'unread',
        };
        //send to coversation
        var conversation = {
          userId: this.userId,
          me: "me",
          view: 'chat',
          message: message,
          type: 'text',
          read: 'unread',
          date: new Date().toString(),
        }

        //send to coversation
        var convasation = {
          userId: firebase.auth().currentUser.uid,
          message: message,
          me: "you",
          type: 'text',
          view: 'chat',
          read: 'unread',
          date: new Date().toString(),
        }
        // sedn the message
        this.afDB.database.ref('/messages').child(firebase.auth().currentUser.uid).child(this.userId).push(messages).then((snap) => {
          var keys = snap.key;
          snap.update({
            key: keys
          })
          this.afDB.database.ref('/messages/').child(this.userId).child(firebase.auth().currentUser.uid).push(messages).then((snap) => {
            snap.update({
              key: keys
            })
            //clear the message
            message = "";
            // for the conversation 
            resolve(true);
            message = '';
            this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
              var res = snapshot.val();
              if (res != null) {
                let store = Object.keys(res)
                this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove().then(() => {
                  //send the conversation to the user base on the ID
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                    // find the other user base on the user recieve
                    this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
                      var res = snapshot.val()
                      if (res != null) {
                        let store = Object.keys(res)
                        this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }).catch((err) => {
                          reject(err);
                        })
                      } else {
                        this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                          resolve(true);
                        })
                      }

                    }).catch((err) => {
                      reject(err);
                    })
                  })

                }).catch((err) => {
                  reject(err);
                })
              } else {
                this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                  this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                    var res = snapshot.val();
                    if (res != null) {
                      let store = Object.keys(res)
                      this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                        this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                          resolve(true);
                        })
                      }).catch((err) => {
                        reject(err);
                      })
                    } else {
                      this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                        resolve(true);
                      })
                    }
                  }).catch((err) => {
                    reject(err);
                  })
                })
              }
            }).catch((err) => {
              reject(err);
            })
          })
        }).then(() => {
          // after send message is completed play the sound
          this.nativeAudio.play('send')
        })
      })
      return promise;
    }
  }

  //send message photo to user alone with url of photo
  sendNewPhoto(url) {
    if (this.userId) {
      var promise = new Promise((resolve, reject) => {
        var messages = {
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'image',
          message: url,
          read: 'unread',
        };
        var conversation = {
          userId: this.userId,
          message: url,
          me: "me",
          type: 'image',
          view: 'chat',
          date: new Date().toString(),
          read: 'unread',
        }
        var convasation = {
          userId: firebase.auth().currentUser.uid,
          message: url,
          me: "you",
          view: 'chat',
          date: new Date().toString(),
          type: 'image',
          read: 'unread',
        }
        this.afDB.database.ref('/messages').child(firebase.auth().currentUser.uid).child(this.userId).push(messages).then((snap) => {
          var keys = snap.key;
          snap.update({
            key: keys
          }).then(() => {
            this.afDB.database.ref('/messages/').child(this.userId).child(firebase.auth().currentUser.uid).push(messages).then((snap) => {
              snap.update({
                key: keys
              })
              // for the conversation 
              resolve(true);
              //message = '';
              this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                var res = snapshot.val();
                if (res != null) {
                  let store = Object.keys(res)
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove().then(() => {
                    //send the conversation to the user base on the ID
                    this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                      // find the other user base on the user recieve
                      this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
                        var res = snapshot.val()
                        if (res != null) {
                          let store = Object.keys(res)
                          this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                            this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                              resolve(true);
                            })
                          }).catch((err) => {
                            reject(err);
                          })
                        } else {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }

                      }).catch((err) => {
                        reject(err);
                      })
                    })

                  }).catch((err) => {
                    reject(err);
                  })
                } else {
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                    this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                      var res = snapshot.val();
                      if (res != null) {
                        let store = Object.keys(res)
                        this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }).catch((err) => {
                          reject(err);
                        })
                      } else {
                        this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                          resolve(true);
                        })
                      }
                    }).catch((err) => {
                      reject(err);
                    })
                  })
                }
              }).catch((err) => {
                reject(err);
              })
            })
          })

        }).then(() => {
          // play the when completed send
          this.nativeAudio.play('send')
        })
      })
      return promise;
    }
  }
  // send audio message to user alone with thw url of the audio
  sendNewAudio(url) {
    if (this.userId) {
      var promise = new Promise((resolve, reject) => {
        var messages = {
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'audio',
          audio: url,
          read: 'unread',
        };
        var conversation = {
          userId: this.userId,
          audio: url,
          type: 'audio',
          me: "me",
          view: 'chat',
          date: new Date().toString(),
          read: 'unread',
        }
        var convasation = {
          userId: firebase.auth().currentUser.uid,
          audio: url,
          me: "you",
          view: 'chat',
          date: new Date().toString(),
          type: 'audio',
          read: 'unread',
        }
        this.afDB.database.ref('/messages').child(firebase.auth().currentUser.uid).child(this.userId).push(messages).then((snap) => {
          var keys = snap.key;
          snap.update({
            key: keys
          }).then(() => {
            this.afDB.database.ref('/messages/').child(this.userId).child(firebase.auth().currentUser.uid).push(messages).then((snap) => {
              snap.update({
                key: keys
              })
              // for the conversation 
              resolve(true);
              //message = '';
              this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                var res = snapshot.val();
                if (res != null) {
                  let store = Object.keys(res)
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove().then(() => {
                    //send the conversation to the user base on the ID
                    this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                      // find the other user base on the user recieve
                      this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
                        var res = snapshot.val()
                        if (res != null) {
                          let store = Object.keys(res)
                          this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                            this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                              resolve(true);
                            })
                          }).catch((err) => {
                            reject(err);
                          })
                        } else {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }
                      }).catch((err) => {
                        reject(err);
                      })
                    })
                  }).catch((err) => {
                    reject(err);
                  })
                } else {
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                    this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                      var res = snapshot.val();
                      if (res != null) {
                        let store = Object.keys(res)
                        this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }).catch((err) => {
                          reject(err);
                        })
                      } else {
                        this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                          resolve(true);
                        })
                      }
                    }).catch((err) => {
                      reject(err);
                    })
                  })
                }
              }).catch((err) => {
                reject(err);
              })
            })
          })
        }).then(() => {
          this.nativeAudio.play('send')
        })
      })
      return promise;
    }
  }

  //play voice from the database
  play(audioUrl) {
    let options: StreamingAudioOptions = {
      successCallback: () => { },
      errorCallback: (e) => { this.presentToast() },
      initFullscreen: false
    };
    // the streaming media hanlde the audio URL convert to native audio play
    this.streamingMedia.playAudio(`${audioUrl}`, options);
  }

  // toast present to notify for something going wrong
  async presentToast() {
    const toast = await this.toast.create({
      message: 'Something going wrong.',
      duration: 1000
    });
    toast.present();
  }
  // scroll to the bottom
  scrollToBottom() {
    this.IonContent.scrollToBottom(100)
  }
  // this handle the upload to the firebase 
  // it handle the selection from the image after will be upload to firebase storage 
  // also will be return the download url
  uploadPhotoMessage(sourceType) {
    return new Promise((resolve, reject) => {
      this.chatPhotoOption.sourceType = sourceType;
      this.camera.getPicture(this.chatPhotoOption).then((imageData) => {
        let url = "data:image/jpeg;base64," + imageData;
        let imgBlob = this.imgURItoBlob(url);
        let metadata = {
          'contentType': imgBlob.type
        };
        alert(url)
        this.loading.showPro();
        const ref = this.afstorage.ref('/Messaging/' + firebase.auth().currentUser.uid + this.generateFilename())
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
  // this handle the record the voice modern
  record() {
    // then create a new file to store the audio
    this.audioFile = this.media.create(this.file.externalDataDirectory + `${this.userId}.mp3`);
    // then  start the recorde
    this.audioFile.startRecord()
    // this.statusRecord = "Recording..."
    this.recording = true;
  }
  stopRec() {
    // stop the record
    this.audioFile.stopRecord()
    // this.statusRecord = "Stopped..."
    this.recording = false;
    //uplaod to firebase storage
    this.uploadRec().then((url) => {
      // pass url to the send maessage
      this.sendNewAudio(url)
    })
  }

  // upload the recording voice to firebase
  // it handle the selection from the audio after will be upload to firebase storage 
  // also will be return the download url
  uploadRec() {
    return new Promise((resolve) => {
      const metadata = {
        contentType: 'audio/mp3',
      };
      let fileName = `${this.userId}.mp3`
      this.file.readAsDataURL(this.file.externalDataDirectory, fileName).then((file) => {
        this.loading.showPro();
        const ref = this.afstorage.ref('/audio/' + '/chat/' + this.generateFilenameAudio())
        const task = ref.putString(file, firebase.storage.StringFormat.DATA_URL)
        task.snapshotChanges().pipe(
          finalize(async () => {
            ref.getDownloadURL().subscribe((audioUrl) => {
              resolve(audioUrl);
              this.loading.hidePro();
              // after uploaded completed,,:: then delete from the delete local storage
              this.file.removeFile(this.file.externalDataDirectory, fileName);
            })
          })
        ).subscribe()
      })
    })
  }

  // generate the random Name return to the jpg
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  // generate the random Name return to the mp3
  generateFilenameAudio() {
    var length = 4;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".mp3";
  }

  // reduce the quality of the image using Blob convert to data
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

  // this handle for the conversation delete for only user
  deleteForMe(key) {
    this.loading.show();
    this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).orderByChild('key').equalTo(key).once('value', snapKey => {
      var res = snapKey.val();
      let store = Object.keys(res)
      this.loading.hide();
      this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).child(store[0]).remove()
    })
  }

  // this handel for the deleting for everyone 
  deleteForEveryOne(key) {
    this.loading.show();
    this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).orderByChild('key').equalTo(key).once('value', snapKey => {
      var res = snapKey.val();
      let store = Object.keys(res);
      this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).child(store[0]).remove();

      this.afDB.database.ref('messages').child(this.userId).child(firebase.auth().currentUser.uid).orderByChild('key').equalTo(key).once('value', snapKeys => {
        var ress = snapKeys.val();
        let store = Object.keys(ress)
        this.afDB.database.ref('messages').child(this.userId).child(firebase.auth().currentUser.uid).child(store[0]).remove();
        this.loading.hide()
      })
    }).then(() => {

    })
  }

  // route to the view info page
  viewInfo() {
    this.router.navigate(['/user-info', { 'userId': this.userId }])
  }
  //enlarge the image
  enlargeImage(image) {
    this.router.navigate(['enlarge-image/', { 'image': image }])
  }
  // option to block the user
  async option() {
    // if is already block make to unblock
    if (this.isBlock == true) {
      const actionShet = await this.actionSheet.create({
        header: 'Select option',
        buttons: [
          {
            text: 'UnBlock ' + this.nikeName,
            handler: () => {
              this.unblockUser()
            }
          },
          {
            text: 'Report ' + this.nikeName,
            handler: () => {
              this.router.navigate(['report/', { 'userId': this.userId }])
            }
          },
          {
            text: 'Cancel',
            handler: () => { }
          }
        ]
      })
      actionShet.present();
      // if is not block make to block the user
    } else if (!this.isBlock) {
      const actionShet = await this.actionSheet.create({
        header: 'Select option',
        buttons: [
          {
            text: 'Block ' + this.nikeName,
            handler: () => {
              this.blockUser();
            }
          },
          {
            text: 'Report ' + this.nikeName,
            handler: () => {
              this.router.navigate(['report/', { 'userId': this.userId }])
            }
          },
          {
            text: 'Cancel',
            handler: () => { }
          }
        ]
      })
      actionShet.present();
    }
  }

  // user Block Function
  blockUser() {
    this.loading.show()
    this.userService.block(this.currentUserId, this.userId).then(() => {
      this.loading.hide();
    })
  }
  // User UnBlock Funtion
  unblockUser() {
    this.loading.show()
    this.userService.unblock(this.currentUserId, this.userId).then(() => {
      this.loading.hide();
    })
  }

  // Send Message option
  sendMessageOption() {
    if (!this.isBlock) {
      this.toastBlock();
      this.message = '';
    } else {
      this.actionUnblock();
    }

  }

  // his handle if the has been block
  async toastBlock() {
    const block = await this.toast.create({
      header: 'Blocked',
      message: "Your can't send a message.",
      duration: 1000,
      position: "middle"
    })
    block.present();
  }

  // when empty the input, will handle the option decide?
  async messageOption() {
    const block = await this.toast.create({
      header: 'Empty',
      message: "Type your message .",
      duration: 1000,
      position: "middle"
    })
    block.present();
  }

  // message option to unblock the user
  async actionUnblock() {
    const actionShet = await this.actionSheet.create({
      header: 'Unblock ' + this.nikeName + ' to send a message.',
      buttons: [
        {
          text: 'UnBlock',
          handler: () => {
            this.unblockUser()
          }
        },
        {
          text: 'Cancel',
          handler: () => {

          }
        }
      ]
    })
    actionShet.present();
  }

  // for the photo option to unblock
  async sendPhotoOption() {
    const actionShet = await this.actionSheet.create({
      header: 'Unblock ' + this.nikeName + ' to send a photo.',
      buttons: [
        {
          text: 'UnBlock',
          handler: () => {
            this.unblockUser()
          }
        },
        {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    })
    actionShet.present();

  }

  //route to the video call
  videoCall() {
    this.router.navigate(["/calling", { 'image': this.image, 'name': this.nikeName, 'userId': this.userId }])
  }

  //dial call
  callPhoneNumber() {
    this.callNumber.callNumber(`${this.phoneNumber}`, true).then(() => {
      this.afDB.list('/accounts/' + firebase.auth().currentUser.uid + '/call/').push({
        date: new Date().toString(),
        userId: this.userId,
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
    }).catch(err => this.something());
  }

  // if somthing goes wrong toast will handle the function
  async something() {
    const toast = await this.toast.create({
      message: 'Something going wrong.',
      duration: 2000
    });
    toast.present();
  }
}
