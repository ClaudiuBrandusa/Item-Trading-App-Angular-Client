export class ModifiedNotification {
  category: string;
  content: any;

  public constructor(init?:Partial<ModifiedNotification>) {
    Object.assign(this, init);
  }
}