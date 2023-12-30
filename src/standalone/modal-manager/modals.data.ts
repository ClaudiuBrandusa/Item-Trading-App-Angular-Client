import { ModalConfig } from "../../modules/app/models/modal-config";
import { RemoveTradeItemPopupComponent } from "../../modules/trades/components/remove-trade-item-popup/remove-trade-item-popup.component";
import { SetTradeItemQuantityAndPriceDialogComponent } from "../../modules/trades/components/set-trade-item-quantity-and-price-dialog/set-trade-item-quantity-and-price-dialog.component";
import { TradePopupsNames } from "../../modules/trades/enums/trade-popups-names";

export const modalConfigs: ModalConfig[] = [
  {
    name: TradePopupsNames.SetItemQuantityAndPrice,
    component: SetTradeItemQuantityAndPriceDialogComponent
  },
  {
    name: TradePopupsNames.RemoveItem,
    component: RemoveTradeItemPopupComponent
  }
];