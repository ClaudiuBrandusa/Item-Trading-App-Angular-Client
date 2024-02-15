import { inject } from "@angular/core"
import { NavigationService } from "../../shared/services/navigation.service"
import { Store } from "@ngrx/store";
import { TradeState } from "../store/trade/trade.state";
import { selectCurrentTradeStatus } from "../store/trade/trade.selector";
import { map, take } from "rxjs";
import { TradeRoutes } from "../enums/trade-routes";

export const selectedTradeGuard = () => {
  const navigationService = inject(NavigationService);
  const store = inject(Store<TradeState>);

  return store.select(selectCurrentTradeStatus).pipe(
    take(1),
    map(lastValue => {
      if (!lastValue.tradeId) {
        navigationService.redirect(TradeRoutes.Base);
        return false;
      }
      return true;
    })
  );
}