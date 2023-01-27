import { Component, OnInit } from '@angular/core';
import ArmorPieceData from '../../assets/armor-pieces.json';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.css']
})
export class StudioComponent implements OnInit {

  constructor() { }

  public armorPieceData = ArmorPieceData;
  public armorPieceDataMap: Map<string, string> = new Map<string, string>();

  ngOnInit(): void {

    this.populateArmorPieces();
    this.populateSmithingTemplates();
    this.populateTrimMaterials();

  }

  populateArmorPieces() {

    let armorTypes = Object.keys(this.armorPieceData);
    let armorMaterialsMap = Object.values(this.armorPieceData);

    let armorPieces = []

    for(let i = 0; i < armorMaterialsMap.length; i++) {
      let armorMaterial = Object.keys(armorMaterialsMap[i]);
      let armorMaterialAssets = Object.values(armorMaterialsMap[i]);

      for(let j = 0; j < armorMaterialAssets.length; j++) {

        let armorPiece = new ArmorPiece;
        armorPiece.armorType = armorTypes[i];
        armorPiece.armorMaterial = armorMaterial[j];
        armorPiece.armorAsset = armorMaterialAssets[j];

        armorPieces.push(armorPiece);
      }
    }
    
    console.log(armorPieces);
  };

  populateSmithingTemplates() {

  }

  populateTrimMaterials() {

  }


}

export class ArmorPiece {
  public armorType: string;
  public armorMaterial: string;
  public armorAsset: string;

  // public iPhoneColorAssetMap: Map<string, string> = new Map<string, string>();
  // public siliconeCaseAssetMap: Map<string, string> = new Map<string, string>();
  // public leatherCaseAssetMap: Map<string, string> = new Map<string, string>();
  // public otherCaseOptionAssetMap: Map<string, string> = new Map<string, string>();

  // public siliconeCaseLinks: Map<string, string> = new Map<string, string>();
  // public leatherCaseLinks: Map<string, string> = new Map<string, string>();
  // public otherCaseLinks: Map<string, string> = new Map<string, string>();
}