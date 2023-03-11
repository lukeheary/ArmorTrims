import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  toggleComponents(component:string) {
    let studio = document.getElementById('studio');
    let table = document.getElementById('table');
    let privacy = document.getElementById('privacy');
    let legal = document.getElementById('legal');
    let terms = document.getElementById('terms');

    studio!.classList.add('hidden');
    table!.classList.add('hidden');
    privacy!.classList.add('hidden');
    legal!.classList.add('hidden');
    terms!.classList.add('hidden');

    let componentDiv = document.getElementById(component);
    componentDiv!.classList.remove('hidden');
    componentDiv!.classList.add('block');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
