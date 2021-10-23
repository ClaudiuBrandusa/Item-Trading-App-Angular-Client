import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthguardService implements CanActivate {

  constructor(private router: Router, private jwtHelper: JwtHelperService) { }

  canActivate() {
    const token = localStorage.getItem("token");

    if(token && !this.jwtHelper.isTokenExpired(token)) {
      console.log("not expired");
      return true;
    }

    this.router.navigate(["login"]);
    console.log("expired");
    return false;
  }
}
