import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { switchMap, filter, catchError, take } from 'rxjs/operators';
import { RefreshTokenService } from '../../identity/services/refresh-token.service';
import { Store } from '@ngrx/store';
import { disconnectInit } from '../../identity/store/identity/identity.actions';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: RefreshTokenService, private store: Store) { }

  intercept(request: HttpRequest<Object>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = request;
    const token = this.tokenService.getToken();
    if(token != null) {
      authReq = this.addTokenHeader(request, token);
    }
    
    return next.handle(authReq).pipe(
      catchError(error => {
      if(error.status === 401) {
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if(!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getRefreshToken();

      if(token) {
        return this.tokenService.getRefreshTokenObservable().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.setTokens(token);
            this.refreshTokenSubject.next(token.token);
            
            return next.handle(this.addTokenHeader(request, token.token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.store.dispatch(disconnectInit())
            return throwError(err);
          })
        );
      } else {
        this.isRefreshing = false;
      }
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
}
