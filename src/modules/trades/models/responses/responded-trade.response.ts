export class RespondedTradeResponse {
  id: string;
  senderId: string;
  senderName: string;
  receivedDate: Date;
  responseDate: Date;
  response: boolean | undefined;
}