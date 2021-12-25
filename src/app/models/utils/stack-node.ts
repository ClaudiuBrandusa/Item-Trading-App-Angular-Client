export class StackNode<T> {
    value: T;
    next: StackNode<T>;

    constructor(val: T) {
        this.value = val;
    }
}