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
import { EventDialogComponent } from './components/event-dialog/event-dialog.component';
import { SmallDialogComponent } from './components/dialog/small-dialog/small-dialog.component';
import { MediumDialogComponent } from './components/dialog/medium-dialog/medium-dialog.component';
import { HugeDialogComponent } from './components/dialog/huge-dialog/huge-dialog.component';
import { BaseDialogComponent } from './components/dialog/base-dialog/base-dialog.component';
import { BackNextDialogComponent } from './components/dialogs/back-next-dialog/back-next-dialog.component';
import { DialogNavigationStackService } from './services/dialog-navigation-stack.service';
import { DialogNavigationService } from './services/dialog-navigation.service';
import { PageNavigationService } from './services/page-navigation.service';



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
    EventDialogComponent,
    SmallDialogComponent,
    MediumDialogComponent,
    HugeDialogComponent,
    BaseDialogComponent,
    BackNextDialogComponent
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
    SearchBarComponent,
    MenuBarComponent,
    MenuButtonComponent,
    EventDialogComponent,
    SmallDialogComponent,
    MediumDialogComponent,
    HugeDialogComponent,
    BackNextDialogComponent
  ],
  providers: [DialogNavigationStackService, DialogNavigationService]
})
export class SharedModule {
  constructor(_: DialogNavigationService, __: PageNavigationService) {}
 }
