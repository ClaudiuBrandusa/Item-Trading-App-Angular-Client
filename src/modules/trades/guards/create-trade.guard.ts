import { inject } from "@angular/core";
import { map, take } from "rxjs";
import { TradeRoutes } from "../enums/trade-routes";
import { NavigationService } from "../../shared/services/navigation.service";
import { Store } from "@ngrx/store";
import { TradeState } from "../store/trade/trade.state";
import { selectTradeCreationStatus } from "../store/trade/trade.selector";

export const createTradeGuard = () => {
  const navigationService = inject(NavigationService);
  const store = inject(Store<TradeState>);

  return store.select(selectTradeCreationStatus).pipe(
    take(1),
    map(lastValue => {
      if (!lastValue) {
        navigationService.redirect(TradeRoutes.Base);
        return false;
      }
      return true;
    })
  );
}