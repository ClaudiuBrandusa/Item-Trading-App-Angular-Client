import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from 'src/modules/identity/models/requests/login-request.model';
import { IdentityService } from './identity.service';
import { EndpointsService } from '../../app/services/endpoints.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { AuthenticationResponse } from '../models/responses/authentication.response';
import { connectInit } from '../store/identity/identity.actions';

@Injectable()
export class LoginService extends IdentityService {

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected navigationService: NavigationService, private store: Store){
    super(http, endpointsService, navigationService);
    this.login_path = this.base_path + this.endpointsModel.login;
  }

  private login_path = "";

  login(model: LoginRequest) {
    return this.http.post<AuthenticationResponse>(this.login_path, model);
  }
  
  protected onTokenSet(authenticationResponse: AuthenticationResponse) {
    this.store.dispatch(connectInit(authenticationResponse));
    this.redirectToDefaultPage();
  }
}
