export class NavigationHistory {
  id: number;
  route: string;

  public constructor(init?:Partial<NavigationHistory>) {
    Object.assign(this, init);
  }
}