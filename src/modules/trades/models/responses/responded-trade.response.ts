export class RespondedTradeResponse {
  id: string;
  senderId: string;
  senderName: string;
  receivedDate: Date;
  responseDate: Date;
  response: boolean | undefined;

  public constructor(init?:Partial<RespondedTradeResponse>) {
    Object.assign(this, init);
  }
}