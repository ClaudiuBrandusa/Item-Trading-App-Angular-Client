export class MessageNotification {
  id: number;
  title: string;
  description: string;
  dateTime: Date;
  isError = false;
  static currentId = 0;

  public constructor(init?:Partial<MessageNotification>) {
    Object.assign(this, init);
  }
}