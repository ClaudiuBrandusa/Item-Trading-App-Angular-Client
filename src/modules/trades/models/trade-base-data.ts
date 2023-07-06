export class TradeBaseData {
  tradeId: string = "";
  isSentTrade: boolean = false;
  isRespondedTrade: boolean = false;

  public constructor(init?:Partial<TradeBaseData>) {
    Object.assign(this, init);
  }
}