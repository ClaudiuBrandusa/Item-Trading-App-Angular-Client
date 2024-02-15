import { StackNode } from "./stack-node";

export class Stack<T> {
  private top: StackNode<T>;

  add(value: T) {
    let tmp = new StackNode<T>(value);

    tmp.next = this.top;
    this.top = tmp;
  }

  peek() {
    return this.top?.value;
  }

  pop() {
    if(this.top == null)
      return null;
    let result = this.top?.value;
    this.top = this.top.next;

    return result;
  }

  clear() {
    while(this.peek() != null || this.peek() != undefined)
      this.pop();
  }

  hasMoreThanOneElements() {
    return !!this.top && !!this.top.next;
  }
}