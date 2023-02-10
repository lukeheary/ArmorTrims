import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudioComponent } from './components/studio/studio.component';

import {environment} from '../environments/environment';
import firebase from 'firebase/compat/app';

if(window.location.hostname != "localhost") {
  firebase.initializeApp(environment.firebaseConfig);
}

@NgModule({
  declarations: [
    AppComponent,
    StudioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
