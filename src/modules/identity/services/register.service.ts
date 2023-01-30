import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { RegisterRequest } from 'src/modules/identity/models/requests/registerRequest.model';
import { EndpointsService } from '../../app/services/endpoints.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { IdentityService } from './identity.service';

@Injectable()
export class RegisterService extends IdentityService {

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService, protected router: Router) {
    super(http, endpointsService, eventBus, router);
    this.register_path = this.base_path + this.endpointsModel.register;
  }

  private register_path = "";

  register(form: FormGroup) {
    let model = this.form2RegisterRequest(form);

    return this.http.post(this.register_path, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  private form2RegisterRequest(form: FormGroup) {
    var model = new RegisterRequest();
    model.username = form.get('username')?.value;
    model.email = form.get('email')?.value;
    model.password = form.get('password')?.value;
    model.confirmPassword = form.get('confirm_password')?.value;
    return model;
  }
}
