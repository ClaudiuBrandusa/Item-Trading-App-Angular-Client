import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { TradesService } from "../services/trades.service";
import { TradeRoutes } from "../enums/trade-routes";
import { NavigationService } from "../../shared/services/navigation.service";

@Injectable({
  providedIn: 'root'
})
export class CreateTradeGuard implements CanActivate {
  constructor(private tradesService: TradesService, private navigationService: NavigationService) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.tradesService.getCreateTradeState()) {
      return this.navigationService.redirect(TradeRoutes.Base);
    }

    return true;
  }

}