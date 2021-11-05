import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginRequest } from 'src/app/models/request/identity/loginRequest.model';
import { IdentityService } from './identity.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { EventData } from 'src/app/models/utils/event';
import { ConfigService } from '../../shared/services/config.service';
import { Interval } from 'src/app/models/utils/async-utils';

@Injectable()
export class LoginService extends IdentityService {

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService){
    super(http, configService, injector, eventBus);
  }

  private login_path = "";

  async login(form: FormGroup) {
    let model = this.form2LoginRequest(form);

    await this.WaitUntilIsLoaded();

    this.http.post(this.login_path, model).subscribe(response => {
      this.setTokens(response);
    }, err => {})
  }

  private form2LoginRequest(form: FormGroup) {
    var model = new LoginRequest();
    model.username = form.get('username').value;
    model.password = form.get('password').value;
    return model;
  }

  protected async LoadEndpoints() {
    await Interval(() => this.identityEndpoints == null, 10, 1000);
    if(this.identityEndpoints == null)
      return;

    this.login_path = this.base_path + this.identityEndpoints.login;
  }
}
