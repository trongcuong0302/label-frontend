import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CorsInterceptor } from './cors.intercepter';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxBarcodeModule } from 'ngx-barcode';

import { AppComponent } from './app.component';
import { LabelListComponent } from './components/label-list/label-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LabelListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NzInputModule,
    NzFormModule,
    FormsModule,
    NzButtonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzSelectModule,
    DragDropModule,
    NgxBarcodeModule
  ],
  providers: [
    //{ provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
