import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginRequest } from 'src/app/models/request/identity/loginRequest.model';
import { IdentityService } from './identity.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { ConfigService } from '../../shared/services/config.service';
import { Router } from '@angular/router';

@Injectable()
export class LoginService extends IdentityService {

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router){
    super(http, configService, injector, eventBus, router);
  }

  private login_path = "";

  async login(form: FormGroup) {
    let model = this.form2LoginRequest(form);

    await this.waitUntilIsLoaded();

    this.http.post(this.login_path, model).subscribe(response => {
      if(this.setTokens(response)) {
        let router = this.injector.get(Router);
        router.navigate([""]);
      }
    }, err => {})
  }

  private form2LoginRequest(form: FormGroup) {
    var model = new LoginRequest();
    model.username = form.get('username').value;
    model.password = form.get('password').value;
    return model;
  }

  protected async LoadEndpoints() {
    await this.waitUntilIsLoaded();

    // if it's still not loaded
    if(this.endpointsModel == null)
      return; // then something went wrong

    this.login_path = this.base_path + this.endpointsModel.login;
  }
}
