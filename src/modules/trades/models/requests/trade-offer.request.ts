import { TradeItem } from "../trade-item";

export class TradeOfferRequest {
  targetUserId: string = "";
  items: Array<TradeItem> = new Array<TradeItem>();

  public constructor(init?:Partial<TradeOfferRequest>) {
    Object.assign(this, init);
  }
}