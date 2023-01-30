export class TradeItem {
  id: string = "";
  name: string = "";
  quantity: number = 0;
  price: number = 0;

  public constructor(init?:Partial<TradeItem>) {
    Object.assign(this, init);
  }
}