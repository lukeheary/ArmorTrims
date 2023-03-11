import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  toggleHome() {
    let studio = document.getElementById('studio');
    let table = document.getElementById('table');
    studio!.classList.remove('hidden');
    table!.classList.remove('hidden');

    let privacy = document.getElementById('privacy');
    let legal = document.getElementById('legal');
    privacy!.classList.add('hidden');
    legal!.classList.add('hidden');
  }

  support() {
    if(window.location.hostname != "localhost") {
      firebase.analytics().logEvent('support', {});
    }
  }

  contact() {
    if(window.location.hostname != "localhost") {
      firebase.analytics().logEvent('contact', {});
    }
  }

  server() {
    if(window.location.hostname != "localhost") {
      firebase.analytics().logEvent('server', {});
    }
  }
}
