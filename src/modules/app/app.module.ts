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
import { SharedModule } from 'src/modules/shared/shared.module';
import { EndpointsService } from './services/endpoints.service';
import { ItemModule } from 'src/modules/item/item.module';
import { IndexModule } from 'src/modules/index/index.module';
import { InventoryModule } from 'src/modules/inventory/inventory.module';
import { TradesModule } from 'src/modules/trades/trades.module';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { SignalRService } from '../shared/services/signal-r.service';
import { ViewReferenceDirective } from './directives/view-reference.directive';
import { provideEffects } from '@ngrx/effects';
import * as itemEffects from '../item/store/item.effects';
import { ModalManagerComponent } from "../../standalone/modal-manager/modal-manager.component";

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
    provideEffects(itemEffects)
  ],
  exports: [AppRoutingModule],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
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
    ModalManagerComponent
  ]
})
export class AppModule { }
