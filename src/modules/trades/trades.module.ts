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
import { RemoveTradeItemDialogComponent } from './components/remove-trade-item-dialog/remove-trade-item-dialog.component';
import { RespondTradeDialogComponent } from './components/respond-trade-dialog/respond-trade-dialog.component';
import { CancelTradeDialogComponent } from './components/cancel-trade-dialog/cancel-trade-dialog.component';



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
    RemoveTradeItemDialogComponent,
    RespondTradeDialogComponent,
    CancelTradeDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    IdentityModule,
    ItemModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    TradesRoutingModule
  ],
  providers: [TradesService]
})
export class TradesModule { }
