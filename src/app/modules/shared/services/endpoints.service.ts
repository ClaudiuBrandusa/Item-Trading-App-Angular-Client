import { Injectable } from '@angular/core';
import { APIOptions } from 'src/app/models/configs/options/api-options.config';
import { IdentityEndpoints } from 'src/app/models/configs/endpoints/identity-endpoints.config';
import { Interval} from 'src/app/models/utils/async-utils';
import { ConfigService } from './config.service';
import { InventoryEndpoints } from 'src/app/models/configs/endpoints/inventory-endpoints.config';
import { ItemEndpoints } from 'src/app/models/configs/endpoints/item-endpoints.config';
import { TradeEndpoints } from 'src/app/models/configs/endpoints/trade-endpoints.config';
import { WalletEndpoints } from 'src/app/models/configs/endpoints/wallet-endpoints.config';

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
