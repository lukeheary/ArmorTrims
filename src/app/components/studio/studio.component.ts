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

  public currentHelmetConfiguration: Map<string, string> = new Map<string, string>();
  public currentChestplateConfiguration: Map<string, string> = new Map<string, string>();
  public currentLeggingsConfiguration: Map<string, string> = new Map<string, string>();
  public currentBootsConfiguration: Map<string, string> = new Map<string, string>();

  public currentHelmetConfigurationAsset:string;
  public currentChestplateConfigurationAsset:string;
  public currentLeggingsConfigurationAsset:string;
  public currentBootsConfigurationAsset:string;

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

    this.setCurrentConfigurations();

    this.populateArmorPieces();
    this.populateSmithingTemplates();
    this.populateTrimMaterials();

    this.setMenuList();
    this.reset();

  }

  setCurrentConfigurations() {
    let keys = ['smithingTemplate', 'armorMaterial', 'trimMaterial', 'configurationAsset'];

    for(let i = 0; i < keys.length; i++) {
      this.currentHelmetConfiguration.set(keys[i], "None");
      this.currentChestplateConfiguration.set(keys[i], "None");
      this.currentLeggingsConfiguration.set(keys[i], "None");
      this.currentBootsConfiguration.set(keys[i], "None");
    }
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

    let armorMaterialHelmetMenu = document.getElementById('armorMaterialHelmetMenu'); 
    let armorMaterialChestplateMenu = document.getElementById('armorMaterialChestplateMenu'); 
    let armorMaterialLeggingsMenu = document.getElementById('armorMaterialLeggingsMenu'); 
    let armorMaterialBootsMenu = document.getElementById('armorMaterialBootsMenu'); 

    let trimMaterialHelmetMenu = document.getElementById('trimMaterialHelmetMenu'); 
    let trimMaterialChestplateMenu = document.getElementById('trimMaterialChestplateMenu'); 
    let trimMaterialLeggingsMenu = document.getElementById('trimMaterialLeggingsMenu'); 
    let trimMaterialBootsMenu = document.getElementById('trimMaterialBootsMenu'); 

    this.menuList = [
      smithingTemplateMenu_Helmet!, 
      smithingTemplateMenu_Chestplate!, 
      smithingTemplateMenu_Leggings!,
      smithingTemplateMenu_Boots!,
      armorMaterialHelmetMenu!,
      trimMaterialHelmetMenu!, 
      trimMaterialChestplateMenu!,
      trimMaterialLeggingsMenu!,
      trimMaterialBootsMenu!,
      armorMaterialChestplateMenu!, 
      armorMaterialLeggingsMenu!, 
      armorMaterialBootsMenu!, 
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

    this.updateConfiguration(option, type);

    if (type.startsWith('smithingTemplate')) {
      templateAsset = this.smithingTemplates.get(option)!;
    }

    if (type.startsWith('trimMaterial')) {
      templateAsset = this.trimMaterials.get(option)!;
    }

    switch(type) {
      case 'armorMaterialHelmet':
        templateAsset = this.helmetAssets.get(option)!;
        break;
      case 'armorMaterialChestplate':
        templateAsset = this.chestplateAssets.get(option)!;
        break;
      case 'armorMaterialLeggings':
        templateAsset = this.leggingsAssets.get(option)!;
        break;
      case 'armorMaterialBoots':
        templateAsset = this.bootsAssets.get(option)!;
        break;
    }

    image!.setAttribute('src', templateAsset)
    text!.innerHTML = option;
  }

  updateConfiguration(option:string, type:string) {
    if(type.includes('Helmet')) {
      this.currentHelmetConfiguration = this.updateConfigurationLogic(option, type, 'Helmet', this.currentHelmetConfiguration);
      this.currentHelmetConfigurationAsset = this.currentHelmetConfiguration.get('configurationAsset')!;

    } else if(type.includes('Chestplate')) {
      this.currentChestplateConfiguration = this.updateConfigurationLogic(option, type, 'Chestplate', this.currentChestplateConfiguration);
      this.currentChestplateConfigurationAsset = this.currentChestplateConfiguration.get('configurationAsset')!;

    } else if(type.includes('Leggings')) {
      this.currentLeggingsConfiguration = this.updateConfigurationLogic(option, type, 'Leggings', this.currentLeggingsConfiguration);
      this.currentLeggingsConfigurationAsset = this.currentLeggingsConfiguration.get('configurationAsset')!;

    } else if(type.includes('Boots')) {
      this.currentBootsConfiguration = this.updateConfigurationLogic(option, type, 'Boots', this.currentBootsConfiguration);
      this.currentBootsConfigurationAsset = this.currentBootsConfiguration.get('configurationAsset')!;
    }
  }


  updateConfigurationLogic(option:string, type:string, armor:string, configuration:Map<string, string>) {
    let assetPath = '';

    if(type.includes('smithingTemplate')) {
      configuration.set('smithingTemplate', option);
    } else if (type.includes('armorMaterial')) {
      configuration.set('armorMaterial', option);
    } else if (type.includes('trimMaterial')) {
      configuration.set('trimMaterial', option);
    }

    let smithingTemplate = configuration.get('smithingTemplate');
    let armorMaterial = configuration.get('armorMaterial');
    let trimMaterial = configuration.get('trimMaterial');

    if (smithingTemplate !== 'None' && armorMaterial !== 'None' && trimMaterial !== 'None') {
      assetPath = 'assets/' + armor.toLowerCase() + '/' +  smithingTemplate + '_' + armorMaterial + '_' + trimMaterial + '.png';
      configuration.set('configurationAsset', assetPath);
    } else if (armorMaterial !== 'None' && (smithingTemplate === 'None' || trimMaterial === 'None')) {
      assetPath = 'assets/' + armor.toLowerCase() + '/' + armorMaterial + '_' + armor + '.png';
      configuration.set('configurationAsset', assetPath);
    } else if (smithingTemplate === 'None' && armorMaterial === 'None' && trimMaterial === 'None') {
      assetPath = 'none.png';
    }

    return configuration;
  }

  reset() {
    this.setCurrentConfigurations();

    this.currentHelmetConfigurationAsset = '';
    this.currentChestplateConfigurationAsset = '';
    this.currentLeggingsConfigurationAsset = '';
    this.currentBootsConfigurationAsset = '';

    let armor = ['Helmet', 'Chestplate', 'Leggings', 'Boots'];
    let slots = ['smithingTemplate', 'armorMaterial', 'trimMaterial']
    for(let i = 0; i < armor.length; i++) {
      for(let j = 0; j < slots.length; j++) {
        let image = document.getElementById(slots[j] + armor[i] + "Image");
        let text = document.getElementById(slots[j] + armor[i] + "Text");

        if (j === 1) {
          image!.setAttribute('src', 'assets/armor-pieces/no_' + armor[i].toLowerCase() + '.png');
        } else {
          image!.setAttribute('src', 'none' + armor[i].toLowerCase() + '.png');
        }
        text!.innerHTML = 'None';
      }
    }
  }
}
