export class TradesSearchOptions {
  selectedFilterValue: string = "All"
  showRespondedTrades: boolean = false;

  public constructor(init?:Partial<TradesSearchOptions>) {
    Object.assign(this, init);
  }
}