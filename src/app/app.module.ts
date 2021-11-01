import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IdentityModule } from './modules/identity/identity.module';
import { SharedModule } from './modules/shared/shared.module';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from './guards/authguard.service';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EventBusService } from './modules/shared/services/event-bus.service';
import { ConfigService } from './modules/shared/services/config.service';
import { RefreshTokenOptions } from './models/configs/refresh-token-options.config';

export function tokenGetter() {
  return localStorage.getItem("token");
}

export function refreshTokenGetter() {
  return localStorage.getItem("refreshToken");
}

@NgModule({
  declarations: [
    AppComponent
  ],
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
        allowedDomains: ["localhost:5000"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [AuthGuardService, EventBusService, ConfigService,
    {
      provide: RefreshTokenOptions,
      deps: [ConfigService],
      useFactory: (configService: ConfigService) => refreshTokenOptionsFactory(configService)
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService],
      useFactory: (configService: ConfigService) => configureServicesFactory(configService)
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true } ],
  exports: [AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

// factory functions

export function configureServicesFactory(configService: ConfigService) {
  return () => configService.load();
}

export function refreshTokenOptionsFactory(configService: ConfigService) {
  let options = new RefreshTokenOptions(); 
  options.silentRefreshIntervalInSeconds = (<any>configService.app_config).refreshTokenOptions.silentRefreshIntervalInSeconds;
  return options;
}