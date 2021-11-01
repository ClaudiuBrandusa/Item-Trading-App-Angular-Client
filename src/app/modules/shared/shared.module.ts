import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './components/title/title.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ErrorComponent } from './components/error/error.component';
import { ButtonComponent } from './components/button/button.component';



@NgModule({
  declarations: [
    DialogComponent,
    TitleComponent,
    ErrorComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ErrorComponent,
    DialogComponent,
    TitleComponent,
    ButtonComponent
  ]
})
export class SharedModule { }
