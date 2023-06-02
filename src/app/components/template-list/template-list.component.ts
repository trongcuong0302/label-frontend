import { Component, OnInit } from '@angular/core';
import { Label } from 'src/app/models/label.model';
import { Router } from '@angular/router';
import { Template } from 'src/app/models/template.model';
import { TemplateService } from 'src/app/services/template.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class LabelListComponent implements OnInit {
  total = 1;
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  searchTemplateName = '';
  sortField: string | null = '';
  sortOrder: string | null = '';

  templateList: Template[] = [];
  labelNameList = [];

  constructor (
    private templateService: TemplateService,
    private modal: NzModalService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.loadTemplateList(this.pageIndex, this.pageSize, null, null, '');
  }


  loadTemplateList(pageIndex: number, pageSize: number, sortField: string | null, sortOrder: string | null, searchTemplate: string): void {
    this.loading = true;
    let filter = [
      {field: "pageIndex", value: pageIndex, operator: "pagination"},
      {field: "pageSize", value: pageSize, operator: "pagination"},
      {field: sortField, value: sortOrder, operator: "sort"},
      {field: "templateName", value: searchTemplate, operator: "includes"}
    ];

    this.templateService.getAllTemplate(filter).subscribe({
      next: (resp) => {
        this.total = resp.total;
        this.templateList = resp.data;
        this.loading = false;
      },
      error: (err) => console.log(err.error)
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort} = params;
    const currentSort = sort.find(item => item.value !== null);
    this.sortField = (currentSort && currentSort.key) || null;
    this.sortOrder = (currentSort && currentSort.value) || null;
    this.loadTemplateList(pageIndex, pageSize, this.sortField, this.sortOrder, this.searchTemplateName);
  }

  confirmDelete(templateId: any, templateName: string): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this template: ${templateName}?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => this.deleteTemplate(templateId)
    });
  }

  deleteTemplate(templateId: any): void {
    this.templateService.deleteTemplateById(templateId)
      .subscribe({
        next: (res) => {
          this.loadTemplateList(this.pageIndex, this.pageSize, this.sortField, this.sortOrder, '');
        },
        error: (err) => console.log(err.error)
        
      });
  }

  addTemplate(): void {
    this.router.navigate(['labels/add']);
  }

  searchTemplate(templateName: any): void {
    this.searchTemplateName = templateName;
    this.loadTemplateList(this.pageIndex, this.pageSize, this.sortField, this.sortOrder, this.searchTemplateName);
  }

}
