import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import ArmorPieceData from '../../../assets/armor-pieces.json';
import SmithingTemplateData from '../../../assets/smithing-templates.json';
import TrimMaterialData from '../../../assets/trim-materials.json';
import DyeData from '../../../assets/dyes.json';
import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics'

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.css']
})
export class StudioComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) {}

  public armorPieceData = ArmorPieceData;
  public smithingTemplateData = SmithingTemplateData['Assets'];
  public trimMaterialData = TrimMaterialData;
  public dyeData = DyeData;

  public helmetAssets: Map<string, string> = new Map<string, string>();
  public chestplateAssets: Map<string, string> = new Map<string, string>();
  public leggingsAssets: Map<string, string> = new Map<string, string>();
  public bootsAssets: Map<string, string> = new Map<string, string>();

  public currentHelmetConfiguration: Map<string, string> = new Map<string, string>();
  public currentChestplateConfiguration: Map<string, string> = new Map<string, string>();
  public currentLeggingsConfiguration: Map<string, string> = new Map<string, string>();
  public currentBootsConfiguration: Map<string, string> = new Map<string, string>();

  public currentHelmetAsset:string;
  public currentChestplateAsset:string;
  public currentLeggingsAsset:string;
  public currentBootsAsset:string;

  public currentHelmetTrimAsset:string;
  public currentChestplateTrimAsset:string;
  public currentLeggingsTrimAsset:string;
  public currentBootsTrimAsset:string;

  public smithingTemplates: Map<string, string> = new Map<string, string>();
  public trimMaterials: Map<string, string> = new Map<string, string>();
  public dyes: Map<string, string> = new Map<string, string>();

  public menuList:HTMLElement[];

  public configurationUrl = ';'

  ngOnInit(): void {
    this.setCurrentConfigurations();

    this.populateArmorPieces();
    this.populateSmithingTemplates();
    this.populateTrimMaterials();
    this.populateDyes();

    this.setMenuList();
    this.reset();

    this.readQueryParams();
  }

  readQueryParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params) {
        const helmet = params['h'];
        const chestplate = params['c'];
        const leggings = params['l'];
        const boots = params['b'];
  
        this.setConfig(helmet, this.helmetAssets, 'Helmet');
        this.setConfig(chestplate, this.chestplateAssets, 'Chestplate');
        this.setConfig(leggings, this.leggingsAssets, 'Leggings');
        this.setConfig(boots, this.bootsAssets, 'Boots');
      }
    });
  }

  setConfig(config: string, assets: Map<string, string>, armor: string) {
    // TEST: http://localhost:4200/?h=6:3-6:1&c=1:4:5&l=1:3-8:1&b=2:4:3

    if(config) {
      let configArray = config.split(':');
      let templateIndex = Number(configArray[0]);
      let smithingTemplate = Array.from(this.smithingTemplates.keys())[templateIndex];
      this.clickOption(smithingTemplate, 'smithingTemplate' + armor);

      // ARMOR PIECES
      if(configArray[1].includes('-')) {
        let armorArray = configArray[1].split('-')
        let armorIndex = Number(armorArray[0]);
        let armorPiece = Array.from(assets.keys())[armorIndex];
        this.clickOption(armorPiece, 'armorMaterial' + armor);


        let dyeIndex = Number(armorArray[1]);
        let dye = Array.from(this.dyes.keys())[dyeIndex];
        this.clickOption(dye, 'leather' + armor);

      } else {
        let armorIndex = Number(configArray[1]);
        let armorPiece = Array.from(assets.keys())[armorIndex];
        this.clickOption(armorPiece, 'armorMaterial' + armor);
      }

      // TRIM MATERIALS
      let trimIndex = Number(configArray[2]);
      let trimMaterial = Array.from(this.trimMaterials.keys())[trimIndex];
      this.clickOption(trimMaterial, 'trimMaterial' + armor);
    }
  }

  generateConfigLink() {
    let link = ''
    if(window.location.hostname === "localhost") {
      link = 'http://localhost:4200/'
    } else {
      link = 'https://armortrims.com/';
    }

    link += '?' + this.getConfig(this.currentHelmetConfiguration, this.helmetAssets, 'h');
    link += '&' +this.getConfig(this.currentChestplateConfiguration, this.chestplateAssets, 'c');
    link += '&' +this.getConfig(this.currentLeggingsConfiguration, this.leggingsAssets, 'l');
    link += '&' +this.getConfig(this.currentBootsConfiguration, this.bootsAssets, 'b');

    this.configurationUrl = link;
  }

  getConfig(config: Map<string, string>, armorAssets: Map<string, string>, paramName: string) {

    let queryParam = ''

    let template = config.get('smithingTemplate')!;
    let armor = config.get('armorMaterial')!;
    let trim = config.get('trimMaterial')!;
    let dye = config.get('dyeColor')!;

    let templateIndex = Array.from(this.smithingTemplates.keys()).indexOf(template)
    let armorIndex = Array.from(armorAssets.keys()).indexOf(armor)
    let trimIndex = Array.from(this.trimMaterials.keys()).indexOf(trim)
    
    if(armor === 'Leather' && dye !== 'None') {
      let dyeIndex = Array.from(this.dyes.keys()).indexOf(dye)
      queryParam += paramName + '=' + templateIndex + ':' + armorIndex + '-' + dyeIndex + ':' + trimIndex;
    } else {
      queryParam += paramName + '=' + templateIndex + ':' + armorIndex + ':' + trimIndex;
    }

    return queryParam;
  }

  setCurrentConfigurations() {
    let keys = ['smithingTemplate', 'armorMaterial', 'trimMaterial', 'armorAsset', 'trimAsset', 'dyeColor'];

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

  populateDyes() {
    let dyeNames = Object.keys(this.dyeData);
    let dyeAssets = Object.values(this.dyeData);

    for(let i = 0; i < dyeNames.length; i++) {
      this.dyes.set(dyeNames[i], dyeAssets[i]);
    }
  }

  openMenu(menuClicked:string) {
    let menu = document.getElementById(menuClicked);
    menu!.style.display = 'block';
    menu!.classList.add('absolute')
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
  
  closeMenu() {
    for(let menu of this.menuList) {
      menu!.style.display = 'none';
    }
    this.resetMenus();
  }

  resetMenus() {
    // Make this less ugly
    let helmetOptions = document.getElementById("helmetOptions");
    let leatherHelmetColorOptions = document.getElementById("leatherHelmetColorOptions");
    helmetOptions?.classList.remove('hidden');
    leatherHelmetColorOptions?.classList.add('hidden');

    let chestplateOptions = document.getElementById("chestplateOptions");
    let leatherChestplateColorOptions = document.getElementById("leatherChestplateColorOptions");
    chestplateOptions?.classList.remove('hidden');
    leatherChestplateColorOptions?.classList.add('hidden');

    let leggingsOptions = document.getElementById("leggingsOptions");
    let leatherLeggingsColorOptions = document.getElementById("leatherLeggingsColorOptions");
    leggingsOptions?.classList.remove('hidden');
    leatherLeggingsColorOptions?.classList.add('hidden');

    let bootsOptions = document.getElementById("bootsOptions");
    let leatherBootsColorOptions = document.getElementById("leatherBootsColorOptions");
    bootsOptions?.classList.remove('hidden');
    leatherBootsColorOptions?.classList.add('hidden');

  }

  clickOption(option:string, type:string) {
    let image = document.getElementById(type + "Image");
    let text = document.getElementById(type + "Text");
    let templateAsset = '';

    if(option === 'Leather') {
      let options = ''
      let colorOptions = ''
      if(type.includes("Helmet")) {
        options = 'helmetOptions';
        colorOptions = 'leatherHelmetColorOptions';
        this.currentHelmetConfiguration.set('armorMaterial', 'Leather');
      } else if(type.includes("Chestplate")) {
        options = 'chestplateOptions';
        colorOptions = 'leatherChestplateColorOptions';
        this.currentChestplateConfiguration.set('armorMaterial', 'Leather');
      } else if(type.includes("Leggings")) {
        options = 'leggingsOptions';
        colorOptions = 'leatherLeggingsColorOptions';
        this.currentLeggingsConfiguration.set('armorMaterial', 'Leather');
      } else if(type.includes("Boots")) {
        options = 'bootsOptions';
        colorOptions = 'leatherBootsColorOptions';
        this.currentBootsConfiguration.set('armorMaterial', 'Leather');
      }

      let optionsDiv = document.getElementById(options);
      let colorOptionsDiv = document.getElementById(colorOptions);

      optionsDiv?.classList.add('hidden');
      colorOptionsDiv?.classList.remove('hidden')

    } else {
      this.updateConfiguration(option, type);
    }


    if (type.startsWith('smithingTemplate')) {
      templateAsset = this.smithingTemplates.get(option)!;
    } else if (type.startsWith('trimMaterial')) {
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

    if(option !== 'Leather') {
      this.closeMenu()
    }

    if (image && text) {
      image!.setAttribute('src', templateAsset)
      text!.innerHTML = option;
    }
  }

  updateConfiguration(option:string, type:string) {
    if(type.includes('Helmet')) {
      this.currentHelmetConfiguration = this.updateConfigurationLogic(option, type, 'Helmet', this.currentHelmetConfiguration);

      let armorAsset = this.currentHelmetConfiguration.get('armorAsset')!;
      let trimAsset = this.currentHelmetConfiguration.get('trimAsset')!;
      armorAsset !== 'None' ? this.currentHelmetAsset = armorAsset : this.currentHelmetAsset = ""
      trimAsset !== 'None' ? this.currentHelmetTrimAsset = trimAsset : this.currentHelmetTrimAsset = ""

    } else if(type.includes('Chestplate')) {
      this.currentChestplateConfiguration = this.updateConfigurationLogic(option, type, 'Chestplate', this.currentChestplateConfiguration);

      let armorAsset = this.currentChestplateConfiguration.get('armorAsset')!;
      let trimAsset = this.currentChestplateConfiguration.get('trimAsset')!;
      armorAsset !== 'None' ? this.currentChestplateAsset = armorAsset : this.currentChestplateAsset = ""
      trimAsset !== 'None' ? this.currentChestplateTrimAsset = trimAsset : this.currentChestplateTrimAsset = ""
      

    } else if(type.includes('Leggings')) {
      this.currentLeggingsConfiguration = this.updateConfigurationLogic(option, type, 'Leggings', this.currentLeggingsConfiguration);

      let armorAsset = this.currentLeggingsConfiguration.get('armorAsset')!;
      let trimAsset = this.currentLeggingsConfiguration.get('trimAsset')!;
      armorAsset !== 'None' ? this.currentLeggingsAsset = armorAsset : this.currentLeggingsAsset = ""
      trimAsset !== 'None' ? this.currentLeggingsTrimAsset = trimAsset : this.currentLeggingsTrimAsset = ""

    } else if(type.includes('Boots')) {
      this.currentBootsConfiguration = this.updateConfigurationLogic(option, type, 'Boots', this.currentBootsConfiguration);

      let armorAsset = this.currentBootsConfiguration.get('armorAsset')!;
      let trimAsset = this.currentBootsConfiguration.get('trimAsset')!;
      armorAsset !== 'None' ? this.currentBootsAsset = armorAsset : this.currentBootsAsset = ""
      trimAsset !== 'None' ? this.currentBootsTrimAsset = trimAsset : this.currentBootsTrimAsset = ""
    }

    this.generateConfigLink();
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

    // Event Code
    if(window.location.hostname != "localhost") {
      if(type.startsWith('smithingTemplate')) {
        let eventName = 'change_' + armor.toLowerCase() + '_template';
        firebase.analytics().logEvent(eventName, {
          'template': option
        });

      } else if(type.startsWith('armorMaterial')) {
        let eventName = 'change_' + armor.toLowerCase();
        firebase.analytics().logEvent(eventName, {
          'type': option
        });  

      } else if(type.startsWith('trimMaterial')) {
        let eventName = 'change_' + armor.toLowerCase() + '_trim';
        firebase.analytics().logEvent(eventName, {
          'material': option
        });
      }
    }

    let dyeColors = Array.from(this.dyes.keys());
    if(dyeColors.includes(option)) {
      configuration.set('dyeColor', option)
    }

    let smithingTemplate = configuration.get('smithingTemplate');
    let armorMaterial = configuration.get('armorMaterial');
    let trimMaterial = configuration.get('trimMaterial');

    // NO HELMET NO IMAGE
    if (armorMaterial === 'None') {
      configuration.set('armorAsset', "None");
      configuration.set('trimAsset', "None");

    // ON SMITHING TEMPLATE CHANGE
    } else if (type.startsWith('smithingTemplate')) {
      configuration.set('smithingTemplate', smithingTemplate!);

      if(smithingTemplate === 'None') {
        configuration.set('trimAsset', 'None')

      } else {

        if(trimMaterial !== 'None') {
          if(armor === 'Chestplate' && (armorMaterial === 'Golden' || armorMaterial === 'Diamond' || armorMaterial === 'Iron')) {
            assetPath = 'assets/trims/metalchestplates/' + smithingTemplate?.toLowerCase() + '/' +  smithingTemplate + '_' + trimMaterial + '.png'
            configuration.set('trimAsset', assetPath);
          } else {
            assetPath = 'assets/trims/' + armor.toLowerCase() + '/' + smithingTemplate?.toLowerCase() + '/' +  smithingTemplate + '_' + trimMaterial + '.png'
            configuration.set('trimAsset', assetPath);
          }
        }
      }
    
    // ON ARMOR MATERIAL CHANGE
    } else if (dyeColors.includes(option) || type.startsWith('armorMaterial')) {
      if(trimMaterial !== 'None') {
        assetPath = 'assets/trims/' + armor.toLowerCase() + '/' + smithingTemplate?.toLowerCase() + '/' +  smithingTemplate + '_' + trimMaterial + '.png'
        configuration.set('trimAsset', assetPath);
      }

      if(dyeColors.includes(option)) {
        option = option.replace(' ', '_');
        assetPath = 'assets/base-armor/' + armor.toLowerCase() + '/leather/' + option.toLowerCase() + '.png';
      } else {
        assetPath = 'assets/base-armor/' + armor.toLowerCase() + '/' + option.toLowerCase() + '.png';
      }
      configuration.set('armorAsset', assetPath);

    // ON TRIM MATERIAL CHANGE
    } else if (type.startsWith('trimMaterial')) {
      configuration.set('trimMaterial', option)
      if (trimMaterial === 'None') {
        configuration.set('trimAsset', 'None');
      } else {

        if(smithingTemplate !== 'None') {
          if(armor === 'Chestplate' && (armorMaterial === 'Golden' || armorMaterial === 'Diamond' || armorMaterial === 'Iron')) {
            assetPath = 'assets/trims/metalchestplates/' + smithingTemplate?.toLowerCase() + '/' +  smithingTemplate + '_' + trimMaterial + '.png'
            configuration.set('trimAsset', assetPath);
          } else {
            assetPath = 'assets/trims/' + armor.toLowerCase() + '/' + smithingTemplate?.toLowerCase() + '/' +  smithingTemplate + '_' + trimMaterial + '.png'
            configuration.set('trimAsset', assetPath);
          }
        }
      }
    }

    return configuration;
  }

  copyConfigurationUrl() {
    navigator.clipboard.writeText(this.configurationUrl);
    let button = document.getElementById('copyConfig');
    button!.innerHTML = "URL Copied!";

    setTimeout(function() {
      button!.innerHTML = "Copy Configuration URL";
    },1500)

    if(window.location.hostname != "localhost") {
      firebase.analytics().logEvent('copy_url', {});
    }
  }

  random() {
    if(window.location.hostname != "localhost") {
      firebase.analytics().logEvent('random', {});
    }

    let smithingTemplates = Object.keys(this.smithingTemplateData);
    let trimMaterials = Object.keys(this.trimMaterialData);
    let armorMaterials = Object.values(this.armorPieceData);

    let armorTypes = Object.keys(this.armorPieceData)

    for(let i = 0; i < armorTypes.length; i++) {
      let armorMaterial = Object.keys(armorMaterials[i]);

      var randomSmithingTemplateIndex = Math.floor(Math.random() * (smithingTemplates.length - 1));
      let randomSmithingTemplate = smithingTemplates[randomSmithingTemplateIndex];

      var randomArmorMaterialIndex = Math.floor(Math.random() * (armorMaterial.length - 1));
      let randomArmorMaterial = armorMaterial[randomArmorMaterialIndex];

      let randomDyeColor = '';
      if(randomArmorMaterial === 'Leather') {
        let dyeColors = Array.from(this.dyes.keys());
        var randomLeatherDyeColorIndex = Math.floor(Math.random() * (dyeColors.length + 1));
        randomDyeColor = dyeColors[randomLeatherDyeColorIndex];
      }

      var randomTrimMaterialIndex = Math.floor(Math.random() * (trimMaterials.length - 1));
      let randomTrimMaterial = trimMaterials[randomTrimMaterialIndex];

      if(i == 0) {
        // HELMET
        this.clickOption(randomSmithingTemplate, 'smithingTemplateHelmet');
        this.clickOption(randomArmorMaterial, 'armorMaterialHelmet');
        this.clickOption(randomTrimMaterial, 'trimMaterialHelmet');

        if(randomArmorMaterial === 'Leather') {
          this.clickOption(randomDyeColor, 'leatherHelmet');
        }

      } else if (i == 1) {
        // CHESTPLATE
        this.clickOption(randomSmithingTemplate, 'smithingTemplateChestplate');
        this.clickOption(randomArmorMaterial, 'armorMaterialChestplate');
        this.clickOption(randomTrimMaterial, 'trimMaterialChestplate');

        if(randomArmorMaterial === 'Leather') {
          this.clickOption(randomDyeColor, 'leatherChestplate');
        }

      } else if (i == 2) {
        // LEGGINGS
        this.clickOption(randomSmithingTemplate, 'smithingTemplateLeggings');
        this.clickOption(randomArmorMaterial, 'armorMaterialLeggings');
        this.clickOption(randomTrimMaterial, 'trimMaterialLeggings');

        if(randomArmorMaterial === 'Leather') {
          this.clickOption(randomDyeColor, 'leatherLeggings');
        }

      } else if (i == 3) {
        // BOOTS
        this.clickOption(randomSmithingTemplate, 'smithingTemplateBoots');
        this.clickOption(randomArmorMaterial, 'armorMaterialBoots');
        this.clickOption(randomTrimMaterial, 'trimMaterialBoots');

        if(randomArmorMaterial === 'Leather') {
          this.clickOption(randomDyeColor, 'leatherBoots');
        }
      } 
    }
  }

  resetEvent() {
    if(window.location.hostname != "localhost") {
      firebase.analytics().logEvent('clear_all', {});
    }
    this.reset();
  }

  reset() {
    this.setCurrentConfigurations();

    this.currentHelmetAsset = '';
    this.currentChestplateAsset = '';
    this.currentLeggingsAsset = '';
    this.currentBootsAsset = '';
  
    this.currentHelmetTrimAsset = '';
    this.currentChestplateTrimAsset = '';
    this.currentLeggingsTrimAsset = '';
    this.currentBootsTrimAsset = '';
    
    let armor = ['Helmet', 'Chestplate', 'Leggings', 'Boots'];
    let slots = ['smithingTemplate', 'armorMaterial', 'trimMaterial']
    for(let i = 0; i < armor.length; i++) {
      for(let j = 0; j < slots.length; j++) {
        let image = document.getElementById(slots[j] + armor[i] + "Image");
        let text = document.getElementById(slots[j] + armor[i] + "Text");

        if (j === 0) {
          image!.setAttribute('src', 'assets/smithing-templates/no_template.png');
        } else if (j === 1) {
          image!.setAttribute('src', 'assets/armor-pieces/no_' + armor[i].toLowerCase() + '.png');
        } else if (j === 2) {
          image!.setAttribute('src', 'assets/trim-materials/no_trim.png');
        }
        text!.innerHTML = 'None';
      }
    }

    this.generateConfigLink();
  }
}
