import { TradeBaseData } from "./trade-base-data";
import { TradeItem } from "./trade-item";

export class CurrentTrade extends TradeBaseData {
  tradeItems: Array<TradeItem> = new Array<TradeItem>();

  public constructor(init?:Partial<CurrentTrade>) {
    super(init);
    Object.assign(this, init);
  }
}