export class TradesSearchOptions {
  selectedFilterValue: string = "All"
  showRespondedTrades: boolean = false;
  tradeItemIds: Array<string> = new Array<string>();

  public constructor(init?:Partial<TradesSearchOptions>) {
    Object.assign(this, init);
  }
}