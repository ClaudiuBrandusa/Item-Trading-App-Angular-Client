import { Injectable } from '@angular/core';
import { ConfigService } from '../../shared/services/config.service';
import { Interval } from '../../shared/utils/async-utils';
import { APIOptions } from '../../shared/models/options/api-options.config'
import { IdentityEndpoints } from '../../shared/models/endpoints/identity-endpoints.config';
import { ItemEndpoints } from '../../shared/models/endpoints/item-endpoints.config';
import { InventoryEndpoints } from '../../shared/models/endpoints/inventory-endpoints.config';
import { TradeEndpoints } from '../../shared/models/endpoints/trade-endpoints.config';
import { WalletEndpoints } from '../../shared/models/endpoints/wallet-endpoints.config';

@Injectable()
export class EndpointsService {

  apiOptions: APIOptions;
  identityEndpoints: IdentityEndpoints;
  inventoryEndpoints: InventoryEndpoints;
  itemEndpoints: ItemEndpoints;
  tradeEndpoints: TradeEndpoints;
  walletEndpoints: WalletEndpoints;

  constructor(private configService: ConfigService) {
    this.InitEndpoints();
   }

  private async InitOptions() {
    this.apiOptions = await this.configService.loadOptions<APIOptions>("APIOptions");
  }

  private async InitEndpoints() {
    this.InitOptions();

    this.identityEndpoints = await this.configService.loadOptions<IdentityEndpoints>("Endpoints:Identity");
    this.inventoryEndpoints = await this.configService.loadOptions<InventoryEndpoints>("Endpoints:Inventory");
    this.itemEndpoints = await this.configService.loadOptions<ItemEndpoints>("Endpoints:Item");
    this.tradeEndpoints = await this.configService.loadOptions<TradeEndpoints>("Endpoints:Trade");
    this.walletEndpoints = await this.configService.loadOptions<WalletEndpoints>("Endpoints:Wallet");
  }

  async GetBasePath() {
    if(this.apiOptions == null) {
      await Interval(() => !this.apiOptions, 50, 5000);

      if(this.apiOptions) {
        return this.apiOptions.Url;
      }

      return null;
    }

    return this.apiOptions.Url;
  }

  // endpoints getters

  async GetIdentity() {
    await Interval(() => this.identityEndpoints == null, 20, 2000);
    
    return this.identityEndpoints;
  }

  async GetInventory() {
    await Interval(() => this.inventoryEndpoints == null, 20, 2000);

    return this.inventoryEndpoints;
  }

  async GetItem() {
    await Interval(() => this.itemEndpoints == null, 20, 2000);

    return this.itemEndpoints;
  }

  async GetTrade() {
    await Interval(() => this.tradeEndpoints == null, 20, 2000);

    return this.tradeEndpoints;
  }

  async GetWallet() {
    await Interval(() => this.walletEndpoints == null, 20, 2000);

    return this.walletEndpoints;
  }
}
