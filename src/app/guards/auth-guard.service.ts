import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RefreshTokenService } from '../modules/identity/services/refresh-token.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private jwtHelper: JwtHelperService, private refreshTokenService: RefreshTokenService) { }

  async canActivate() {
    const token = localStorage.getItem("token");

    if(token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    if(this.refreshTokenService.canRefreshTokens())
    {
      await this.refreshTokenService.refreshTokens();

      if(this.refreshTokenService.isLoggedIn)
        return true;
    }

    this.router.navigate(["login"]);
    return false;
  }
}
