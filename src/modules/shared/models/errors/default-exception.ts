export class DefaultException {
  message: string;
  body: any;

  public constructor(init?:Partial<DefaultException>) {
    Object.assign(this, init);
  }
}