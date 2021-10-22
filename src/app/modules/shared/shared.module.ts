import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './components/title/title.component';
import { DialogComponent } from './components/dialog/dialog.component';



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
