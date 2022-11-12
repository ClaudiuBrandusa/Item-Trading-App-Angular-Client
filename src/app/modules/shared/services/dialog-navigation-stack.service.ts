import { Injectable } from '@angular/core';
import { Stack } from 'src/app/models/utils/stack';

@Injectable({
  providedIn: "root"
})
export class DialogNavigationStackService {

  // here we keep the id of the navigated pages
  private stack = new Stack<string>();

  constructor() { }

  navigate(dialogPageId: string) {
    this.stack.add(dialogPageId);
    // adds the page that is previous to the current one
    // in short terms, the current page is not in the stack
  }

  back() {
    return this.stack.pop();
    // returns the id of the previous page
  }

  isRoot() {
    return !this.stack.hasMoreThanOneElements();
    // root means that there is at least one element in the stack
  }

  clear() {
    this.stack.clear();
    // empties the navigation stack
  }

  current() {
    return this.stack.peek();
  }
}
