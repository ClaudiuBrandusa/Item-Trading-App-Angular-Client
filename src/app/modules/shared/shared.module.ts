import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './components/title/title.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ErrorComponent } from './error/error.component';



@NgModule({
  declarations: [
    DialogComponent,
    TitleComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ErrorComponent,
    DialogComponent,
    TitleComponent
  ]
})
export class SharedModule { }
