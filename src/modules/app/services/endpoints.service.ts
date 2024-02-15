import { Injectable } from '@angular/core';
import appConfig from '../../../assets/application-config.json'
import { APIOptions } from '../../shared/models/options/api-options.config'
import { IdentityEndpoints } from '../../shared/models/endpoints/identity-endpoints.config';
import { ItemEndpoints } from '../../shared/models/endpoints/item-endpoints.config';
import { InventoryEndpoints } from '../../shared/models/endpoints/inventory-endpoints.config';
import { TradeEndpoints } from '../../shared/models/endpoints/trade-endpoints.config';
import { WalletEndpoints } from '../../shared/models/endpoints/wallet-endpoints.config';
import { SignalREndpoints } from '../../shared/models/endpoints/signal-r-endpoints.config';

@Injectable()
export class EndpointsService {

  apiOptions: APIOptions;
  identityEndpoints: IdentityEndpoints;
  inventoryEndpoints: InventoryEndpoints;
  itemEndpoints: ItemEndpoints;
  tradeEndpoints: TradeEndpoints;
  walletEndpoints: WalletEndpoints;
  signalREndpoints: SignalREndpoints;

  constructor() {
    this.apiOptions = appConfig.APIOptions;

    this.identityEndpoints = appConfig.Endpoints.Identity;
    this.inventoryEndpoints = appConfig.Endpoints.Inventory;
    this.itemEndpoints = appConfig.Endpoints.Item;
    this.tradeEndpoints = appConfig.Endpoints.Trade;
    this.walletEndpoints = appConfig.Endpoints.Wallet;
    this.signalREndpoints = appConfig.Endpoints.SignalR;
  }

  getBasePath() {
    return this.apiOptions.Url;
  }

  // endpoints getters

  getIdentity() {
    return this.identityEndpoints;
  }

  getInventory() {
    return this.inventoryEndpoints;
  }

  getItem() {
    return this.itemEndpoints;
  }

  getTrade() {
    return this.tradeEndpoints;
  }

  getWallet() {
    return this.walletEndpoints;
  }

  getSignalR() {
    return this.signalREndpoints;
  }
}
