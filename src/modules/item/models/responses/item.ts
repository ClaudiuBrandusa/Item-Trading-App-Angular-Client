export class Item {
  id: string = "";
  name: string = "";
  description: string = "";

  public constructor(init?:Partial<Item>) {
    Object.assign(this, init);
  }
}