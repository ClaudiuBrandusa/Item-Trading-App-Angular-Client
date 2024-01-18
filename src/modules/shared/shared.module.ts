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
import { NotificationsComponent } from './components/notification/notifications/notifications.component';
import { NotificationComponent } from './components/notification/notification/notification.component';
import { PipeModule } from '../pipe/pipe.module';
import { DialogModule } from '../dialog/dialog.module';


@NgModule({
  declarations: [
    TitleComponent,
    ErrorComponent,
    NavbarComponent,
    NavbarButtonComponent,
    SearchBarComponent,
    MenuBarComponent,
    MenuButtonComponent,
    NotificationsComponent,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PipeModule,
    DialogModule
  ],
  exports: [
    DialogModule,
    PipeModule,
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
