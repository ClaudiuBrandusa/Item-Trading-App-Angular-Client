import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RefreshTokenService } from "../../services/refresh-token.service";
import { connectInit, connected, disconnectInit, disconnected, loginInit, registerInit } from "./identity.actions";
import { catchError, exhaustMap, from, map, of } from "rxjs";
import { SignalRService } from "../../../shared/services/signal-r.service";
import { handleDefaultException } from "../../../shared/store/notification/notification.actions";
import { LoginService } from "../../services/login.service";
import { AuthenticationResponse } from "../../models/responses/authentication.response";
import { RegisterService } from "../../services/register.service";

export const login = createEffect(
  (action$ = inject(Actions), service = inject(LoginService)) => {
    return action$.pipe(
      ofType(loginInit),
      exhaustMap(({ request }) =>
        service.login(request).pipe(
          map((response: AuthenticationResponse) => {
            service.setTokens(response);
            return connectInit(response);
          }
          ),
          catchError(error =>
            of(handleDefaultException('Error found at login', error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const register = createEffect(
  (action$ = inject(Actions), service = inject(RegisterService)) => {
    return action$.pipe(
      ofType(registerInit),
      exhaustMap(({ request }) =>
        service.register(request).pipe(
          map((response: AuthenticationResponse) => {
            service.setTokens(response);
            return connectInit(response);
          }
          ),
          catchError(error =>
            of(handleDefaultException('Error found at login', error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const connect = createEffect(
  (action$ = inject(Actions), service = inject(SignalRService)) => {
    return action$.pipe(
      ofType(connectInit),
      exhaustMap(({ response }) => 
        of(service.connect(response.token)).pipe(
          map(() =>
            connected()
          ),
          catchError(error =>
            of(handleDefaultException('Error found at disconnect user', error))
          )
        )
      )
    );
  },
  { functional: true }
);

export const disconnect = createEffect(
  (action$ = inject(Actions), service = inject(SignalRService), tokenService = inject(RefreshTokenService)) => {
    return action$.pipe(
      ofType(disconnectInit),
      exhaustMap(({ token, keepData }) =>
        from(service.disconnect(token)).pipe(
          map(() => {
            if (!keepData) tokenService.signOut();
            return disconnected();
          }),
          catchError(error =>
            of(handleDefaultException('Error found at disconnect user', error)))
        )
      )
    );
  },
  { functional: true }
);