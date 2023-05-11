import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabelListComponent } from './components/label-list/label-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/labels', pathMatch: 'full' },
  { path: 'labels', component: LabelListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
