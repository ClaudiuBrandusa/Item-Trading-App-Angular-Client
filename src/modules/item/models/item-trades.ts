export class ItemTrades {
  itemId: string = "";
  tradeIds: Array<string>;

  public constructor(init?:Partial<ItemTrades>) {
    Object.assign(this, init);
  }
}