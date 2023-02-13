export class TradesSearchOptions {
  selectedFilterValue: string;
  showRespondedTrades: boolean;

  public constructor(init?:Partial<TradesSearchOptions>) {
    Object.assign(this, init);
  }
}