import { TradeItem } from "./trade-item";

export class CurrentTrade {
  tradeId: string = "";
  tradeItems: Array<TradeItem>;
  isSentTrade: Boolean = false;
  isRespondedTrade: Boolean = false;

  public constructor(init?:Partial<CurrentTrade>) {
    Object.assign(this, init);
  }
}