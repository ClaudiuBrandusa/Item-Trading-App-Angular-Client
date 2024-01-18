import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IdentityRoutingModule } from './identity-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { IdentityDialogComponent } from './components/identity-dialog/identity-dialog.component';
import { NavigationHeaderComponent } from './components/navigation-header/navigation-header.component';
import { CurrentIdentityPageService } from './services/current-identity-page.service';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { FoundUserComponent } from './components/found-user/found-user.component';
import { provideEffects } from '@ngrx/effects';
import { UserReducer } from './store/user/user.reducer';
import * as userEffects from './store/user/user.effects';
import * as identityEffects from '../identity/store/identity/identity.effects';
import { StoreModule } from '@ngrx/store';
import { IdentityReducer } from './store/identity/identity.reducer';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    IdentityDialogComponent,
    NavigationHeaderComponent,
    FoundUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IdentityRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forFeature("user", UserReducer),
    StoreModule.forFeature("identity", IdentityReducer)
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    IdentityRoutingModule,
    FoundUserComponent
  ],
  providers: [
    CurrentIdentityPageService,
    LoginService,
    RegisterService,
    provideEffects(userEffects),
    provideEffects(identityEffects)
  ]
})
export class IdentityModule { }
