import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabelListComponent } from './components/template-list/template-list.component';
import { TemplateDetailComponent } from './components/template-detail/template-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/labels', pathMatch: 'full' },
  { path: 'labels', component: LabelListComponent },
  { path: 'labels/:id', component: TemplateDetailComponent },
  { path: 'labels/add', component: TemplateDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
