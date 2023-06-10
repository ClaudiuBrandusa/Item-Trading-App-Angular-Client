import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RefreshTokenService } from 'src/modules/identity/services/refresh-token.service';
import { NavigationService } from '../../shared/services/navigation.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private navigationService: NavigationService, private jwtHelper: JwtHelperService, private refreshTokenService: RefreshTokenService) { }

  async canActivate() {
    const token = this.refreshTokenService.getToken();

    if(token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    if(this.refreshTokenService.canRefreshTokens())
    {
      await this.refreshTokenService.refresh();

      if(this.refreshTokenService.isLoggedIn)
        return true;
    }

    //this.router.navigate(["login"]);
    this.navigationService.redirect("login");
    return false;
  }
}
