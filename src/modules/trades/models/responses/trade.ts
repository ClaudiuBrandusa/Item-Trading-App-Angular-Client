import { TradeItem } from "../trade-item";

export class Trade {
  tradeId: string = "";
  creationDate: Date;
  respondedDate: Date | null;
  receiverName: string;
  senderName: string;
  response: boolean | undefined;
  items: Array<TradeItem>;

  public constructor(init?:Partial<Trade>) {
    Object.assign(this, init);
  }
}