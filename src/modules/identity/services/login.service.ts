import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginRequest } from 'src/modules/identity/models/requests/login-request.model';
import { IdentityService } from './identity.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { catchError, throwError } from 'rxjs';
import { EndpointsService } from '../../app/services/endpoints.service';
import { NavigationService } from '../../shared/services/navigation.service';

@Injectable()
export class LoginService extends IdentityService {

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService, protected navigationService: NavigationService){
    super(http, endpointsService, eventBus, navigationService);
    this.login_path = this.base_path + this.endpointsModel.login;
  }

  private login_path = "";

  login(form: FormGroup) {
    let model = this.form2LoginRequest(form);

    return this.http.post(this.login_path, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  private form2LoginRequest(form: FormGroup) {
    var model = new LoginRequest();
    model.username = form.get('username')?.value;
    model.password = form.get('password')?.value;
    return model;
  }
}
