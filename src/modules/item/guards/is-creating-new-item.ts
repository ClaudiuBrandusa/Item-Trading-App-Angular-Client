import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { ItemService } from "../services/item.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { ItemRoutes } from "../enums/item-routes";

@Injectable({
  providedIn: 'root'
})
export class IsCreatingNewItemGuard implements CanActivate {
  constructor(private itemService: ItemService, private navigationService: NavigationService) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.itemService.isCreatingNewItem) {
      this.navigationService.redirect(ItemRoutes.Base);
      return false; 
    }
    
    return true;
  }
}