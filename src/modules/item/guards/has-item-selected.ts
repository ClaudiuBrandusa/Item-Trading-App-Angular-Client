import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { ItemService } from "../services/item.service";
import { ItemRoutes } from "../enums/item-routes";
import { NavigationService } from "../../shared/services/navigation.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HasItemSelectedGuard implements CanActivate {
  constructor(private itemService: ItemService, private navigationService: NavigationService) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.itemService.getSelectedItemId()) {
      this.navigationService.redirect(ItemRoutes.Base);
      return false; 
    }

    return true;
  }

}