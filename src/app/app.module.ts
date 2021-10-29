import { CountryCodeService } from './services/country-code.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Media } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { SuperTabs, SuperTabsModule } from '@ionic-super-tabs/angular';
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule, } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { IonicHeaderParallaxModule } from 'ionic-header-parallax';

import * as firebase from 'firebase';
import { SettingComponent } from './component/setting/setting.component';
import { ChatmoreComponent } from './component/chatmore/chatmore.component';
import { GroupoptComponent } from './component/groupopt/groupopt.component';
import { BroadcastComponent } from './component/broadcast/broadcast.component';
import { CallPageModule } from './pages/call/call.module';
import { ChatPageModule } from './pages/chat/chat.module';
import { StatusPageModule } from './pages/status/status.module';
import { CameraPageModule } from './pages/camera/camera.module';
import { PhoneService } from './services/phone.service';
import { AlertService } from './services/alert.service';
import { LoginService } from './services/login.service';
import { WebrtcService } from './services/webrtc.service';
import { AudioService } from './services/audio.service';
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { EventService } from './services/event.service';
import { StatusService } from './services/status.service';
import { LoadingService } from './services/loading.service';
import { DataService } from './services/data.service';
import { environment } from 'src/environments/environment.prod';



// for the camera site user to be provider
firebase.initializeApp(environment.firebaseConfig)
@NgModule({
  declarations: [AppComponent, SettingComponent, ChatmoreComponent, GroupoptComponent, BroadcastComponent],
  entryComponents: [],
  imports: [BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicHeaderParallaxModule,
    AngularFireStorageModule,
    AppRoutingModule,
    CallPageModule,
    ChatPageModule,
    StatusPageModule,
    CameraPageModule,
  ],
  providers: [
    AngularFireAuthModule,
    AngularFireModule,
    AngularFireAuth,
    StatusBar,
    SplashScreen,
    Camera,
    Media,
    NativeAudio,
    StreamingMedia,
    CallNumber,
    File,
    SuperTabs,
    Network,
    PhoneService,
    AlertService,
    LoginService,
    WebrtcService,
    UserService,
    CountryCodeService,
    ChatService,
    AudioService,
    EventService,
    StatusService,
    LoadingService,
    DataService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
