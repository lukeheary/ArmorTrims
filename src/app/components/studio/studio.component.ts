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
          case 'Helmet':
            this.helmetAssets.set(armorMaterial[j], armorMaterialAssets[j])
            break;
          case 'Chestplate':
            this.chestplateAssets.set(armorMaterial[j], armorMaterialAssets[j])
            break;
          case 'Leggings':
            this.leggingsAssets.set(armorMaterial[j], armorMaterialAssets[j])
            break;
          case 'Boots':
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

  openMenu(menuClicked:string) {
    let menu = document.getElementById(menuClicked);

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
    let smithingTemplateMenu_Helmet = document.getElementById('smithingTemplateHelmetMenu'); 
    let smithingTemplateMenu_Chestplate = document.getElementById('smithingTemplateChestplateMenu'); 
    let smithingTemplateMenu_Leggings = document.getElementById('smithingTemplateLeggingsMenu'); 
    let smithingTemplateMenu_Boots = document.getElementById('smithingTemplateBootsMenu'); 

    let helmetMaterialMenu = document.getElementById('helmetMaterialMenu'); 
    let chestplateMaterialMenu = document.getElementById('chestplateMaterialMenu'); 
    let leggingsMaterialMenu = document.getElementById('leggingsMaterialMenu'); 
    let bootsMaterialMenu = document.getElementById('bootsMaterialMenu'); 

    let trimMaterialHelmetMenu = document.getElementById('trimMaterialHelmetMenu'); 
    let trimMaterialChestplateMenu = document.getElementById('trimMaterialChestplateMenu'); 
    let trimMaterialLeggingsMenu = document.getElementById('trimMaterialLeggingsMenu'); 
    let trimMaterialBootsMenu = document.getElementById('trimMaterialBootsMenu'); 

    this.menuList = [
      smithingTemplateMenu_Helmet!, 
      smithingTemplateMenu_Chestplate!, 
      smithingTemplateMenu_Leggings!,
      smithingTemplateMenu_Boots!,
      helmetMaterialMenu!,
      trimMaterialHelmetMenu!, 
      trimMaterialChestplateMenu!,
      trimMaterialLeggingsMenu!,
      trimMaterialBootsMenu!,
      chestplateMaterialMenu!, 
      leggingsMaterialMenu!, 
      bootsMaterialMenu!, 
      ];
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

  clickOption(option:string, type:string) {
    let image = document.getElementById(type + "Image");
    let text = document.getElementById(type + "Text");
    let templateAsset = '';


    if (type.startsWith('smithingTemplate')) {
      templateAsset = this.smithingTemplates.get(option)!;
    }

    if (type.startsWith('trimMaterial')) {
      templateAsset = this.trimMaterials.get(option)!;
    }

    switch(type) {
      case 'helmetMaterial':
        templateAsset = this.helmetAssets.get(option)!;
        break;
      case 'chestplateMaterial':
        templateAsset = this.chestplateAssets.get(option)!;
        break;
      case 'leggingsMaterial':
        templateAsset = this.leggingsAssets.get(option)!;
        break;
      case 'bootsMaterial':
        templateAsset = this.bootsAssets.get(option)!;
        break;
    }

    image!.setAttribute('src', templateAsset)
    text!.innerHTML = option;
  }

}
