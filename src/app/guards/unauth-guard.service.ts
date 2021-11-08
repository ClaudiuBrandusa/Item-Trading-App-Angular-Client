import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RefreshTokenService } from '../modules/identity/services/refresh-token.service';

@Injectable()
export class UnauthGuardService implements CanActivate {

  constructor(private router: Router, private refreshTokenService: RefreshTokenService) { }

  canActivate() {
    if(this.refreshTokenService.isLoggedIn()) {    
      this.router.navigate([""]);
      return false;
    }
    
    return true;
  }
}
