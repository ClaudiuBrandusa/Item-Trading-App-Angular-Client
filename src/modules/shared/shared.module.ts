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
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { MenuButtonComponent } from './components/menu-bar/menu-button/menu-button.component';
import { SmallDialogComponent } from './components/dialog/small-dialog/small-dialog.component';
import { MediumDialogComponent } from './components/dialog/medium-dialog/medium-dialog.component';
import { HugeDialogComponent } from './components/dialog/huge-dialog/huge-dialog.component';
import { PageNavigationService } from './services/page-navigation.service';
import { DefaultDialogComponent } from './components/default-dialog/default-dialog.component';
import { DarkBackgroundComponent } from './components/dark-background/dark-background.component';
import { StoreModule, provideStore } from '@ngrx/store';



@NgModule({
  declarations: [
    DialogComponent,
    TitleComponent,
    ErrorComponent,
    ButtonComponent,
    NavbarComponent,
    NavbarButtonComponent,
    SearchBarComponent,
    MenuBarComponent,
    MenuButtonComponent,
    SmallDialogComponent,
    MediumDialogComponent,
    HugeDialogComponent,
    DefaultDialogComponent,
    DarkBackgroundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forRoot({})
  ],
  exports: [
    ErrorComponent,
    DialogComponent,
    TitleComponent,
    ButtonComponent,
    NavbarComponent,
    SearchBarComponent,
    MenuBarComponent,
    MenuButtonComponent,
    SmallDialogComponent,
    MediumDialogComponent,
    HugeDialogComponent,
    DefaultDialogComponent,
    DarkBackgroundComponent
  ],
  providers: [
    provideStore()
  ]
})
export class SharedModule {
  constructor(_: PageNavigationService) {}
 }
