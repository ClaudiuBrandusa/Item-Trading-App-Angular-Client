import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './title/title.component';
import { DialogComponent } from './dialog/dialog.component';



@NgModule({
  declarations: [
    DialogComponent,
    TitleComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DialogComponent,
    TitleComponent
  ]
})
export class SharedModule { }
