import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradesPageComponent } from './components/trades-page/trades-page.component';
import { TradesRoutingModule } from './trades-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TradesListComponent } from './components/trades-list/trades-list.component';
import { TradeComponent } from './components/trade/trade.component';
import { TradeDetailsDialogComponent } from './components/trade-details-dialog/trade-details-dialog.component';
import { TradesService } from './services/trades.service';
import { SelectTradeReceiverDialogComponent } from './components/select-trade-receiver-dialog/select-trade-receiver-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdentityModule } from '../identity/identity.module';
import { SelectItemsForTradeDialogComponent } from './components/select-items-for-trade-dialog/select-items-for-trade-dialog.component';
import { ItemModule } from '../item/item.module';
import { SelectedTradeItemComponent } from './components/selected-trade-item/selected-trade-item.component';
import { SelectedTradeItemsListComponent } from './components/selected-trade-items-list/selected-trade-items-list.component';
import { SetTradeItemQuantityAndPriceDialogComponent } from './components/set-trade-item-quantity-and-price-dialog/set-trade-item-quantity-and-price-dialog.component';
import { RemoveTradeItemPopupComponent } from './components/remove-trade-item-popup/remove-trade-item-popup.component';
import { RespondTradeDialogComponent } from './components/respond-trade-dialog/respond-trade-dialog.component';
import { CancelTradeDialogComponent } from './components/cancel-trade-dialog/cancel-trade-dialog.component';
import { TradeReducer } from './store/trade/trade.reducer';
import { StoreModule } from '@ngrx/store';
import * as tradeEffects from './store/trade/trade.effects';
import * as lockedAmountEffects from '../inventory/store/locked-amount/locked-amount.effects';
import { provideEffects } from '@ngrx/effects';
import { TradeItemReducer } from './store/trade-item/trade-item.reducer';
import { InventoryModule } from '../inventory/inventory.module';
import { LockedInventoryItemAmountReducer } from '../inventory/store/locked-amount/locked-amount.reducer';
import { TradeItemTagComponent } from './components/trade-item-tag/trade-item-tag.component';
import { TradeItemTagsComponent } from './components/trade-item-tags/trade-item-tags.component';
import { TradeItemSidebarFilterComponent } from './components/trade-item-sidebar-filter/trade-item-sidebar-filter.component';



@NgModule({
  declarations: [
    TradesPageComponent,
    TradesListComponent,
    TradeComponent,
    TradeDetailsDialogComponent,
    SelectTradeReceiverDialogComponent,
    SelectItemsForTradeDialogComponent,
    SelectedTradeItemComponent,
    SelectedTradeItemsListComponent,
    SetTradeItemQuantityAndPriceDialogComponent,
    RemoveTradeItemPopupComponent,
    RespondTradeDialogComponent,
    CancelTradeDialogComponent,
    TradeItemTagComponent,
    TradeItemTagsComponent,
    TradeItemSidebarFilterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    IdentityModule,
    ItemModule,
    InventoryModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature("trade", TradeReducer),
    StoreModule.forFeature("trade-item", TradeItemReducer),
    StoreModule.forFeature("locked-amount", LockedInventoryItemAmountReducer)
  ],
  exports: [
    TradesRoutingModule
  ],
  providers: [
    TradesService,
    provideEffects(tradeEffects),
    provideEffects(lockedAmountEffects)
  ]
})
export class TradesModule { }
