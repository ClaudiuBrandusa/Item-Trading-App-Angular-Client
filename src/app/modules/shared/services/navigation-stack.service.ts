import { Injectable } from '@angular/core';
import { Stack } from 'src/app/models/utils/stack';

@Injectable({
  providedIn: "root"
})
export class NavigationStackService {

  // here we keep the id of the navigated pages
  private stack = new Stack<string>();

  constructor() { }

  navigate(pageId: string) {
    this.stack.add(pageId);
    // adds the page that is previous to the current one
    // in short terms, the current page is not in the stack
  }

  back() {
    return this.stack.pop();
    // returns the id of the previous page
  }

  isRoot() {
    let current = this.current();
    return current == null || current == undefined;
    // root means that there is no history in the navigation stack
  }

  clear() {
    this.stack.clear();
    // empties the navigation stack
  }

  current() {
    return this.stack.peek();
  }
}
