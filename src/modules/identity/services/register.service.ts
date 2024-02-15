import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from 'src/modules/identity/models/requests/register-request.model';
import { EndpointsService } from '../../app/services/endpoints.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { IdentityService } from './identity.service';
import { Store } from '@ngrx/store';
import { AuthenticationResponse } from '../models/responses/authentication.response';
import { connectInit } from '../store/identity/identity.actions';

@Injectable()
export class RegisterService extends IdentityService {

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected navigationService: NavigationService, private store: Store) {
    super(http, endpointsService, navigationService);
    this.register_path = this.base_path + this.endpointsModel.register;
  }

  private register_path = "";

  register(model: RegisterRequest) {
    return this.http.post<AuthenticationResponse>(this.register_path, model);
  }
  
  protected onTokenSet(authenticationResponse: AuthenticationResponse) {
    this.store.dispatch(connectInit(authenticationResponse));
    this.redirectToDefaultPage();
  }
}
