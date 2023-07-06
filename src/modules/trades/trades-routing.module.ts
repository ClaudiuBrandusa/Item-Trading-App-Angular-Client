import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/modules/app/guards/auth-guard.service';
import { TradesPageComponent } from './components/trades-page/trades-page.component';
import { TradeRoutes } from './enums/trade-routes';
import { SelectTradeReceiverDialogComponent } from './components/select-trade-receiver-dialog/select-trade-receiver-dialog.component';
import { SelectItemsForTradeDialogComponent } from './components/select-items-for-trade-dialog/select-items-for-trade-dialog.component';
import { TradeDetailsDialogComponent } from './components/trade-details-dialog/trade-details-dialog.component';
import { CancelTradeDialogComponent } from './components/cancel-trade-dialog/cancel-trade-dialog.component';
import { RespondTradeDialogComponent } from './components/respond-trade-dialog/respond-trade-dialog.component';
import { createTradeGuard } from './guards/create-trade.guard';
import { selectedTradeGuard } from './guards/selected-trade.guard';

const routes: Routes = [{
  path: TradeRoutes.Base,
  component: TradesPageComponent,
  canActivate: [AuthGuardService],
  children: [
  {
    path: TradeRoutes.Create,
    canActivate: [createTradeGuard],
    children: [
      { path: TradeRoutes.SelectReceiver, component: SelectTradeReceiverDialogComponent },
      {
        path: TradeRoutes.SelectItems,
        component: SelectItemsForTradeDialogComponent
      },
    ]
  },
  {
    path: TradeRoutes.Details,
    canActivate: [selectedTradeGuard],
    component: TradeDetailsDialogComponent
  },
  {
    path: TradeRoutes.Cancel,
    component: CancelTradeDialogComponent
  },
  {
    path: TradeRoutes.Respond,
    component: RespondTradeDialogComponent
  }] 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradesRoutingModule {}