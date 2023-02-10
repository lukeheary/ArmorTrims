import { Component, AfterViewInit } from '@angular/core';

import 'firebase/compat/analytics'
import 'firebase/compat/storage'

import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ArmorTrims';

  ngAfterViewInit() {
    if(window.location.hostname != "localhost") {
      firebase.analytics().logEvent('page_load');
    }
  }
}
