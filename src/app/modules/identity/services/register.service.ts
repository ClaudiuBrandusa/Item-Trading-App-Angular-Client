import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from 'src/app/models/request/identity/registerRequest.model';
import { ConfigService } from '../../shared/services/config.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { IdentityService } from './identity.service';

@Injectable()
export class RegisterService extends IdentityService {

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService) {
    super(http, configService, injector, eventBus);
  }

  private register_path = "";

  async register(form: FormGroup) {
    let model = this.form2RegisterRequest(form);

    await this.WaitUntilIsLoaded();
    
    this.http.post(this.register_path, model).subscribe(response => {
      if(this.setTokens(response)) {
        let router = this.injector.get(Router);
        router.navigate([""]);
      }
    }, err => {
      // something went wrong
    })
  }

  private form2RegisterRequest(form: FormGroup) {
    var model = new RegisterRequest();
    model.username = form.get('username').value;
    model.email = form.get('email').value;
    model.password = form.get('password').value;
    model.confirmPassword = form.get('confirm_password').value;
    return model;
  }

  protected async LoadEndpoints() {
    await this.WaitUntilIsLoaded();

    if(this.endpointsModel == null)
      return;

    this.register_path = this.base_path + this.endpointsModel.register;
  }
}
