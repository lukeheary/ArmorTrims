import { Component, OnInit } from '@angular/core';
import SmithingTemplateData from '../../../assets/smithing-templates.json';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor() { }

  public smithingTemplateData = SmithingTemplateData;

  // public smithingTemplates: Map<string, string> = new Map<string, string>();

  public templateObjects = new Array();


  ngOnInit(): void {
    this.populateSmithingTemplates();
  }

  populateSmithingTemplates() {
    let templateNames = Object.keys(this.smithingTemplateData['Assets']);
    let templateAssets = Object.values(this.smithingTemplateData['Assets']);
    let templateStructures = Object.values(this.smithingTemplateData['Structures']);
    let templateContainers = Object.values(this.smithingTemplateData['Containers']);


    for(let i = 0; i < templateNames.length; i++) {
      if(templateNames[i] !== 'None' && templateNames[i] !== '') {
        let templateObject = new SmithingTemplate;
        templateObject.name = templateNames[i]
        templateObject.asset = templateAssets[i]
        templateObject.structure = templateStructures[i]
        templateObject.container = templateContainers[i]

        this.templateObjects.push(templateObject)
      }
    }
  }
}

class SmithingTemplate {
  public name:string;
  public asset:string;
  public structure:string;
  public container:string;
  public quantity:string;
  public chance:string;
}
