import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IdentityModule } from './modules/identity/identity.module';
import { SharedModule } from './modules/shared/shared.module';

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
    ReactiveFormsModule
  ],
  providers: [],
  exports: [AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
