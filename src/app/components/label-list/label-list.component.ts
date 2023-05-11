import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CdkDragEnd } from "@angular/cdk/drag-drop";

import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Label } from 'src/app/models/label.model';
import { Template } from 'src/app/models/template.model';
import { LabelService } from 'src/app/services/label.service';

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.component.html',
  styleUrls: ['./label-list.component.scss']
})
export class LabelListComponent implements OnInit {
  zplcode: string = '';
  dpmm: number = 8;

  labelName: string= '';
  shouldShowTemplate: boolean = false;
  templateName: string = '';
  templateNameList: Label['templateName'][] = [];
  labelNameList = ['Barcode','Shipment'];

  widthBoundary: number = 610;
  heightBoundary: number = 407;
  widthLabel: number = 3;
  heightLabel: number = 2;

  textTemplates: Template['text'][] = [];
  textLabel: Template['text'];
  textName: string = 'Value';
  textSize: number = 21;
  textFont: string = 'monospace';
  textContent: string = 'Value';
  position = {x: 0, y: 0};
  isTextChoosen: boolean = false;
  isBarcodeChoosen: boolean = false;

  barcodeTemplate: Template['barcode'][] = [];
  barcodeLabel: Template['barcode'];
  bcValue: string = 'Value';
  bcType: string = 'Code128';
  bcHeight: number = 50;
  bcWidth: number = 2;
  bcTextSize: number = 21;
  bcTextFont: string = 'monospace';
  margin = 0;
  marginTop = 0;
  marginBottom = 0;
  marginLeft = 0;
  marginRight = 0;

  constructor (
    private labelService: LabelService
    ) {}

  ngOnInit(): void {
  }


  loadTemplateList(labelName: string): void {
    let filter = [{labelType: labelName}];
    this.labelService.getAllTemplate(filter).subscribe({
      next: (resp) => {
        this.templateNameList = resp.data;
        if(this.templateNameList.length) {
          this.shouldShowTemplate = true;
        }
      },
      error: (err) => console.log(err.error)
    });
  }

  onChangeLabel(event: any): void {
    this.shouldShowTemplate = false;
    this.labelName = event;
    this.loadTemplateList(this.labelName);
  }

  onChangeTemplate(event: any): void {
    this.templateName = event;
  }

  onChangeWidthBoundary(event: any) {
    this.widthBoundary = event*this.dpmm*25.4+1; // 342 = 216 * 1.583 = 2.25 * (6*25.4) / 96
  }

  onChangeHeightBoundary(event: any) {
    this.heightBoundary = event*this.dpmm*25.4+1;
  }

  onChangeDensity() {
    this.onChangeWidthBoundary(this.widthLabel);
    this.onChangeHeightBoundary(this.heightLabel);
  }
  
  generateZpl() {
    const data = {
      dpmm: this.dpmm,
      height: this.heightLabel,
      width: this.widthLabel,
      barcodeTemplates: this.barcodeTemplate,
      textTemplates: this.textTemplates
    };

    this.labelService.generateALabel(data)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => console.log(err.error.message)
      });
  }

  getTextLabel() {
    return {textName: this.textName, textSize: this.textSize, textFont: this.textFont, textContent: this.textContent, positionX: this.position.x, positionY: this.position.y};
  }

  addTextLabel(): void {
    let text = this.getTextLabel();
    text.textName = "Value";
    text.textContent= "Value";
    text.positionX = 0;
    text.positionY = 0;
    this.textTemplates.push(text);
  }

  remove(): void {
    if(this.isTextChoosen){
      this.isTextChoosen = false;
      let index = this.textTemplates.indexOf(this.textLabel);
      if (index !== -1) {
        this.textTemplates.splice(index, 1);
        this.textLabel = {textName: '',textSize: 0, textFont: '', textContent: '', positionX: 0, positionY: 0};
      }
    }

    if(this.isBarcodeChoosen) {
      this.isBarcodeChoosen = false;
      let index = this.barcodeTemplate.indexOf(this.barcodeLabel);
      if (index !== -1) {
        this.barcodeTemplate.splice(index, 1);
        this.barcodeLabel = {bcValue: '',bcType: '', bcHeight: 0, bcWidth: 0, bcTextSize: 0, bcTextFont: '', positionX: 0, positionY: 0};
      }
    }
  }

  activateTextLabel(text: any, index: number): void {
    if(!text.textContent) text.textContent= "Value";
    this.textLabel = text;
    this.textName = text.textName;
    this.textSize = text.textSize;
    this.textFont = text.textFont;
    this.textContent = text.textContent;
    this.position = {x: this.textTemplates[index]?.positionX!, y: this.textTemplates[index]?.positionY!};
    this.isTextChoosen = true;
    this.isBarcodeChoosen = false;
  }

  getBarcodeLabel() {
    return {bcValue: this.bcValue, bcType: this.bcType, bcHeight: this.bcHeight, bcWidth: this.bcWidth, bcTextSize: this.bcTextSize, bcTextFont: this.bcTextFont, positionX: this.position.x, positionY: this.position.y};
  }

  addBarcodeLabel(): void {
    let barcode = this.getBarcodeLabel();
    barcode.bcValue = "Value";
    barcode.positionX = 0;
    barcode.positionY = 0;
    this.barcodeTemplate.push(barcode);
  }

  activateBarcodeLabel(barcode: any, index: number): void {
    if(!barcode.bcValue) barcode.bcValue = "Value";
    this.barcodeLabel = barcode;
    this.bcValue = barcode.bcValue;
    this.bcType = barcode.bcType;
    this.bcHeight = barcode.bcHeight;
    this.bcWidth = barcode.bcWidth;
    this.bcTextSize = barcode.bcTextSize;
    this.bcTextFont = barcode.bcTextFont;
    this.position = {x: this.barcodeTemplate[index]?.positionX!, y: this.barcodeTemplate[index]?.positionY!};
    this.isTextChoosen = false;
    this.isBarcodeChoosen = true;
    
  }

  onDragEnd(event: CdkDragEnd, item: any, index: number): void {
    if(item.textName){
      this.activateTextLabel(item, index);
    }
    if(item.bcValue){
      this.activateBarcodeLabel(item, index);
    }
    this.position = event.source.getFreeDragPosition();
    if(this.position.x < 0) this.position.x = 0;
    if(this.position.y < 0) this.position.y = 0;
    this.changeText();
  }

  changeText(): void {
    if(this.isTextChoosen) {
      let text = this.getTextLabel();
      let index = this.textTemplates.indexOf(this.textLabel);
      if (index !== -1) {
        this.textLabel = text;
        this.textTemplates[index] = this.textLabel;
      }
    }

    if(this.isBarcodeChoosen) {
      let barcode = this.getBarcodeLabel();
      let index = this.barcodeTemplate.indexOf(this.barcodeLabel);
      if (index !== -1) {
        this.barcodeLabel = barcode;
        this.barcodeTemplate[index] = this.barcodeLabel;
      }
    }
  }

}
