import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { IdentityRoutingModule } from './identity-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { IdentityDialogComponent } from './identity-dialog/identity-dialog.component';
import { NavigationHeaderComponent } from './components/navigation-header/navigation-header.component';
import { CurrentIdentityPageService } from './services/current-identity-page.service';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    IdentityDialogComponent,
    NavigationHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IdentityRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    IdentityRoutingModule
  ],
  providers: [CurrentIdentityPageService]
})
export class IdentityModule { }
