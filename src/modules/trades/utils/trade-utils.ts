import { Trade } from "../models/responses/trade";

export function getTradeReceiverOrSender(trade: Trade) {
  return trade.receiverName ?? trade.senderName;
}

export function getTradeTotalPrice(trade: Trade) {
  let totalPrice = 0;

  trade.items.forEach(tradeItem => totalPrice += tradeItem.price);

  return totalPrice;
}
