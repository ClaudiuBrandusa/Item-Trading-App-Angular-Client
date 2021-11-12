import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './components/title/title.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ErrorComponent } from './components/error/error.component';
import { ButtonComponent } from './components/button/button.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarButtonComponent } from './components/navbar/navbar-button/navbar-button.component';
import { SearchBarComponent } from './components/navbar/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DialogComponent,
    TitleComponent,
    ErrorComponent,
    ButtonComponent,
    NavbarComponent,
    NavbarButtonComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ErrorComponent,
    DialogComponent,
    TitleComponent,
    ButtonComponent,
    NavbarComponent,
    SearchBarComponent
  ]
})
export class SharedModule { }
