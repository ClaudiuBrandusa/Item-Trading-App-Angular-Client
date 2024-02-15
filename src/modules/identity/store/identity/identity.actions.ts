import { createAction } from "@ngrx/store";
import { AuthenticationResponse } from "../../models/responses/authentication.response";
import { LoginRequest } from 'src/modules/identity/models/requests/login-request.model';
import { RegisterRequest } from 'src/modules/identity/models/requests/register-request.model';

export enum IdentityActionType {
  ConnectInit = "identity_connect_initiated",
  Connected = "identity_connected",
  LoginInit = "identity_login_initiated",
  RegisterInit = "identity_register_initiated",
  DisconnectInit = "identity_diconnect_initiated",
  Disconnected = "identity_disconnected"
}

export const connectInit = createAction(IdentityActionType.ConnectInit, (response: AuthenticationResponse) => ({ response }));

export const connected = createAction(IdentityActionType.Connected);

export const loginInit = createAction(IdentityActionType.LoginInit, (request: LoginRequest) => ({ request }));

export const registerInit = createAction(IdentityActionType.RegisterInit, (request: RegisterRequest) => ({ request }));

export const disconnectInit = createAction(IdentityActionType.DisconnectInit, (keepData = false) => ({ keepData }));

export const disconnected = createAction(IdentityActionType.Disconnected);