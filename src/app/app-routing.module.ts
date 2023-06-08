import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateListComponent } from './components/template-list/template-list.component';
import { TemplateDetailComponent } from './components/template-detail/template-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/templates', pathMatch: 'full' },
  { path: 'templates', component: TemplateListComponent },
  { path: 'templates/:id', component: TemplateDetailComponent },
  { path: 'templates/add', component: TemplateDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
