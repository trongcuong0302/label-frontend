import { Component, OnInit } from '@angular/core';
import { CdkDragEnd } from "@angular/cdk/drag-drop";
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Label } from 'src/app/models/label.model';
import { Template } from 'src/app/models/template.model';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss']
})
export class TemplateDetailComponent implements OnInit {
  isUpdated = false;
  templateId: string = '';
  zplCode: string = '';
  dpmm: number = 8;
  dpmmList: number[] = [6,8,12,24];

  labelName: string= '';
  shouldShowTemplate: boolean = false;
  templateName: string = '';
  templateList: Template[] = [];
  template: Template = {text: [], barcode: []};
  labelNameList = ['Barcode','Shipment'];

  widthBoundary: number = 610;
  heightBoundary: number = 407;
  widthLabel: number = 3;
  heightLabel: number = 2;

  textTemplates: Template['text'] = [];
  textLabel = {textDescription: '',textSize: 0, textFont: '', textContent: '', positionX: 0, positionY: 0};
  textDescription: string = 'Value';
  textSize: number = 21;
  sizeList: number[] = [];
  textFont: string = 'monospace';
  fontList: string[] = ['monospace'];
  textContent: string = 'Value';
  position = {x: 0, y: 0};
  isTextChoosen: boolean = false;
  isBarcodeChoosen: boolean = false;

  barcodeTemplate: Template['barcode'] = [];
  barcodeLabel = {bcValue: '',bcType: '', bcHeight: 0, bcWidth: 0, bcTextSize: 0, bcTextFont: '', positionX: 0, positionY: 0};
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
    private notification: NzNotificationService,
    private templateService: TemplateService,
    private route: ActivatedRoute,
    private router: Router) {
    }

  ngOnInit(): void {
    if(this.route.snapshot.params["id"] !== "add") {
      this.isUpdated = true;
      this.getTemplate(this.route.snapshot.params["id"]);
    }
    this.initSizeList();
  }


  initSizeList(): void {
    let i = 1;
    this.sizeList.push(11);
    while(i<20) {
      this.sizeList.push(i*10 + 11);
      i+=2;
    }
  }

  loadTemplateList(labelName: string): void {
    let filter = [{labelName: labelName}];
    this.templateService.getAllTemplate(filter).subscribe({
      next: (resp) => {
        this.templateList = resp.data;
        if(this.templateList.length) {
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

  getTemplate(id: any): void {
    this.templateService.getATemplate(id).subscribe({
      next: (resp) => {
        this.templateId = id;
        this.template = resp.data;
        this.dpmm = this.template.dpmm!;
        this.heightLabel = this.template.height!;
        this.widthLabel = this.template.width!;
        this.barcodeTemplate = this.template.barcode;
        this.textTemplates = this.template.text;
        this.templateName = this.template.templateName!;
        this.labelName = this.template.labelName!;
        this.zplCode = this.template.zplCode!;
        this.onChangeDensity();
      },
      error: (err) => console.log(err.error)
    });
  }

  onChangeWidthBoundary(event: any) {
    this.widthBoundary = event*this.dpmm*25.4+2; // 342 = 216 * 1.583 = 2.25 * (6*25.4) / 96
  }

  onChangeHeightBoundary(event: any) {
    this.heightBoundary = event*this.dpmm*25.4+2;
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

    this.templateService.generateATemplate(data)
      .subscribe({
        next: (res) => {
          this.zplCode = res.data;
        },
        error: (err) => console.log(err.error.message)
      });
  }

  copyZpl = async () => {
    try {
      await navigator.clipboard.writeText(this.zplCode);
      this.notification.create('success','','ZPL code copied to clipboard');
    } catch (err) {
      this.notification.create('error','','ZPL code cannot be copied to clipboard');
    }
  }

  getTextLabel() {
    return {textDescription: this.textDescription, textSize: this.textSize, textFont: this.textFont, textContent: this.textContent, positionX: this.position.x, positionY: this.position.y};
  }

  addTextLabel(): void {
    let text = this.getTextLabel();
    text.textDescription = "Value";
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
        this.textTemplates.splice(index!, 1);
        this.textLabel = {textDescription: '',textSize: 0, textFont: '', textContent: '', positionX: 0, positionY: 0};
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
    this.textDescription = text.textDescription;
    this.textSize = text.textSize;
    this.textFont = text.textFont;
    this.textContent = text.textContent;
    this.position = {x: this.textTemplates[index].positionX!, y: this.textTemplates[index].positionY!};
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
    this.position = {x: this.barcodeTemplate[index].positionX!, y: this.barcodeTemplate[index].positionY!};
    this.isTextChoosen = false;
    this.isBarcodeChoosen = true;
    
  }

  onDragEnd(event: CdkDragEnd, item: any, index: number): void {
    if(item.textDescription){
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
      let index = this.textTemplates?.indexOf(this.textLabel);
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

  getTemplateData() {
    this.generateZpl();
    const data = {
      templateName: this.templateName,
      labelName: this.labelName,
      dpmm: this.dpmm,
      height: this.heightLabel,
      width: this.widthLabel,
      barcode: this.barcodeTemplate,
      text: this.textTemplates,
      zplCode: this.zplCode
    }
    return data;
  }

  addTemplate(): void {
    const data = this.getTemplateData();
    this.templateService.postATemplate(data)
      .subscribe({
        next: (res) => {
          this.router.navigate(['..'])
        },
        error: (err) => console.log(err.error)
      });
  }

  updateTemplate(): void {
    const data = this.getTemplateData();
    this.templateService.updateTemplateById(this.templateId, data)
      .subscribe({
        next: (res) => {
          this.router.navigate(['..'])
        },
        error: (err) => console.log(err.error)
      });
  }

}
