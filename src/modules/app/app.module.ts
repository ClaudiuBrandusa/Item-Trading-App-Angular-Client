import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { IdentityModule } from 'src/modules/identity/identity.module';
import { EndpointsService } from './services/endpoints.service';
import { ItemModule } from 'src/modules/item/item.module';
import { IndexModule } from 'src/modules/index/index.module';
import { InventoryModule } from 'src/modules/inventory/inventory.module';
import { TradesModule } from 'src/modules/trades/trades.module';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { SignalRService } from '../shared/services/signal-r.service';
import { ViewReferenceDirective } from './directives/view-reference.directive';
import { ModalManagerComponent } from "../../standalone/modal-manager/modal-manager.component";
import { WarningPopupComponent } from '../../standalone/popups/warning/warning-popup.component';
import { StoreModule, provideStore } from '@ngrx/store';
import { ModalReducer } from '../../standalone/modal-manager/store/modal.reducer';
import { NotificationReducer } from '../shared/store/notification/notification.reducer';
import { provideEffects } from '@ngrx/effects';
import * as notificationEffects from '../shared/store/notification/notification.effects';

export function tokenGetter() {
  return localStorage.getItem("token");
}

export function refreshTokenGetter() {
  return localStorage.getItem("refreshToken");
}

@NgModule({
  declarations: [
    AppComponent,
    ViewReferenceDirective
  ],
  providers: [EndpointsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    SignalRService,
    provideEffects(notificationEffects),
    provideStore()
  ],
  exports: [AppRoutingModule],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IdentityModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        disallowedRoutes: []
      }
    }),
    ItemModule,
    IndexModule,
    InventoryModule,
    TradesModule,
    ModalManagerComponent,
    WarningPopupComponent,
    StoreModule.forFeature("notification", NotificationReducer),
    StoreModule.forFeature("modal", ModalReducer),
    StoreModule.forRoot({})
  ]
})
export class AppModule { }
