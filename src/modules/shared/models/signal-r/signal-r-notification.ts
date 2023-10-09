export class SignalRNotification {
  type: string;
  content: object;

  public constructor(init?:Partial<SignalRNotification>) {
    Object.assign(this, init);
  }
}