import { Component, HostListener, OnInit } from '@angular/core';
import ArmorPieceData from '../../../assets/armor-pieces.json';
import SmithingTemplateData from '../../../assets/smithing-templates.json';
import TrimMaterialData from '../../../assets/trim-materials.json';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.css']
})
export class StudioComponent implements OnInit {

  constructor() { }

  public armorPieceData = ArmorPieceData;
  public smithingTemplateData = SmithingTemplateData;
  public trimMaterialData = TrimMaterialData;

  public helmetAssets: Map<string, string> = new Map<string, string>();
  public chestplateAssets: Map<string, string> = new Map<string, string>();
  public leggingsAssets: Map<string, string> = new Map<string, string>();
  public bootsAssets: Map<string, string> = new Map<string, string>();

  public smithingTemplates: Map<string, string> = new Map<string, string>();
  public trimMaterials: Map<string, string> = new Map<string, string>();
  
  public menuList:HTMLElement[];
  public screenWidth: number;

  // @HostListener('window:resize', ['$event']) onResize() {
  //   this.screenWidth = window.innerWidth;
  //   if (this.screenWidth > 1100) {
  //     for (let menu of this.menuList) {
  //       menu!.style.display = 'none'
  //       menu!.style.bottom = '';
  //     }
  //   }
  // }

  ngOnInit(): void {

    this.populateArmorPieces();
    this.populateSmithingTemplates();
    this.populateTrimMaterials();

    this.setMenuList();

  }

  populateArmorPieces() {
    let armorTypes = Object.keys(this.armorPieceData);
    let armorMaterialsMap = Object.values(this.armorPieceData);

    for(let i = 0; i < armorMaterialsMap.length; i++) {
      let armorMaterial = Object.keys(armorMaterialsMap[i]);
      let armorMaterialAssets = Object.values(armorMaterialsMap[i]);

      for(let j = 0; j < armorMaterialAssets.length; j++) {
        switch(armorTypes[i]) {
          case 'helmet':
            this.helmetAssets.set(armorMaterial[j], armorMaterialAssets[j])
            break;
          case 'chestplate':
            this.chestplateAssets.set(armorMaterial[j], armorMaterialAssets[j])
            break;
          case 'leggings':
            this.leggingsAssets.set(armorMaterial[j], armorMaterialAssets[j])
            break;
          case 'boots':
            this.bootsAssets.set(armorMaterial[j], armorMaterialAssets[j])
            break;
          }
      }
    }
  };

  populateSmithingTemplates() {
    let templateNames = Object.keys(this.smithingTemplateData);
    let templateAssets = Object.values(this.smithingTemplateData);

    for(let i = 0; i < templateNames.length; i++) {
      this.smithingTemplates.set(templateNames[i], templateAssets[i]);
    }
  }

  populateTrimMaterials() {
    let trimMaterialNames = Object.keys(this.trimMaterialData);
    let trimMaterialAssets = Object.values(this.trimMaterialData);

    for(let i = 0; i < trimMaterialNames.length; i++) {
      this.trimMaterials.set(trimMaterialNames[i], trimMaterialAssets[i]);
    }
  }

  openMenu() {
    let menu = document.getElementById('helmetMenu');

    menu!.style.display = 'block';
    menu!.classList.add('fixed')


    // let menu = document.getElementById(currentMenu); 
    // this.screenWidth = window.innerWidth;

    // if(this.screenWidth > 1100) {
    //   menu!.style.display = 'block'
    //   menu?.classList.add('fixed')
    //   menu!.scrollTop = 0;
    // } else {
    //   menu!.style.display = 'block'
    //   menu!.scrollTop = 0;
    //   menu!.style.bottom = '0px';
    // }  
  }

  setMenuList() {
    let helmetMenu = document.getElementById('helmetMenu'); 
    this.menuList = [helmetMenu!];
  }
  
  closeMenu(event:Event) {
    let clickedElement = (event.target) as HTMLElement
    this.screenWidth = window.innerWidth;

    for(let menu of this.menuList) {
      if(clickedElement.id === '') {
        menu!.style.display = 'none';
      }
    }
  }


}
