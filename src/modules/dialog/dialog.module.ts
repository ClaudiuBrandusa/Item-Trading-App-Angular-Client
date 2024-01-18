import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogBodyComponent } from './components/dialog-body/dialog-body.component';
import { PipeModule } from '../pipe/pipe.module';
import { DialogTemplateComponent } from './components/dialog-template/dialog-template.component';
import { SmallDialogComponent } from './components/small-dialog/small-dialog.component';
import { MediumDialogComponent } from './components/medium-dialog/medium-dialog.component';
import { HugeDialogComponent } from './components/huge-dialog/huge-dialog.component';
import { ButtonComponent } from './components/button/button.component';
import { DarkBackgroundComponent } from './components/dark-background/dark-background.component';



@NgModule({
  declarations: [
    DialogBodyComponent,
    DialogTemplateComponent,
    SmallDialogComponent,
    MediumDialogComponent,
    HugeDialogComponent,
    ButtonComponent,
    DarkBackgroundComponent
  ],
  imports: [
    CommonModule,
    PipeModule
  ],
  exports: [
    DialogBodyComponent,
    DialogTemplateComponent,
    SmallDialogComponent,
    MediumDialogComponent,
    HugeDialogComponent,
    ButtonComponent,
    DarkBackgroundComponent
  ]
})
export class DialogModule { }
