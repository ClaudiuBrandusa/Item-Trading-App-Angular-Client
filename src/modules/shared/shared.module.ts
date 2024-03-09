import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './components/title/title.component';
import { ErrorComponent } from './components/error/error.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarButtonComponent } from './components/navbar/navbar-button/navbar-button.component';
import { SearchBarComponent } from './components/navbar/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { MenuButtonComponent } from './components/menu-bar/menu-button/menu-button.component';
import { PageNavigationService } from './services/page-navigation.service';
import { PipeModule } from '../pipe/pipe.module';
import { DialogModule } from '../dialog/dialog.module';
import { NotificationModule } from '../notification/notification.module';
import { DefaultPageComponent } from './components/default-page/default-page.component';


@NgModule({
  declarations: [
    TitleComponent,
    ErrorComponent,
    DefaultPageComponent,
    NavbarComponent,
    NavbarButtonComponent,
    SearchBarComponent,
    MenuBarComponent,
    MenuButtonComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PipeModule,
    DialogModule,
    NotificationModule
  ],
  exports: [
    DialogModule,
    PipeModule,
    DefaultPageComponent,
    ErrorComponent,
    TitleComponent,
    NavbarComponent,
    SearchBarComponent,
    MenuBarComponent,
    MenuButtonComponent
  ]
})
export class SharedModule {
  constructor(_: PageNavigationService) {}
 }
