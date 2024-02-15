import { ModalConfig } from "../../modules/app/models/modal-config";
import { RemoveTradeItemPopupComponent } from "../../modules/trades/components/remove-trade-item-popup/remove-trade-item-popup.component";
import { SetTradeItemQuantityAndPriceDialogComponent } from "../../modules/trades/components/set-trade-item-quantity-and-price-dialog/set-trade-item-quantity-and-price-dialog.component";
import { TradePopupNames } from "../../modules/trades/enums/trade-popup-names";
import { PopupNames } from "../popups/enums/popup-names";
import { WarningPopupComponent } from "../popups/warning/warning-popup.component";

export const modalConfigs: ModalConfig[] = [
  {
    name: TradePopupNames.SetItemQuantityAndPrice,
    component: SetTradeItemQuantityAndPriceDialogComponent
  },
  {
    name: TradePopupNames.RemoveItem,
    component: RemoveTradeItemPopupComponent
  },
  {
    name: PopupNames.Warning,
    component: WarningPopupComponent
  }
];