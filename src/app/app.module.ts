import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudioComponent } from './components/studio/studio.component';

import {environment} from '../environments/environment';
import firebase from 'firebase/compat/app';
import { TableComponent } from './components/table/table.component';
import { FooterComponent } from './components/footer/footer.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { HeaderComponent } from './components/header/header.component';
import { LegalComponent } from './components/legal/legal.component';
import { TermsComponent } from './components/terms/terms.component';

if(window.location.hostname != "localhost") {
  firebase.initializeApp(environment.firebaseConfig);
}

@NgModule({
  declarations: [
    AppComponent,
    StudioComponent,
    TableComponent,
    FooterComponent,
    PrivacyComponent,
    HeaderComponent,
    LegalComponent,
    TermsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
