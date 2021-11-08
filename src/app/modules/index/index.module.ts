import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    MainPageComponent
  ]
})
export class IndexModule { }
