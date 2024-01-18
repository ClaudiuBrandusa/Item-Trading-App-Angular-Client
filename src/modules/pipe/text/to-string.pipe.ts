import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'toString'
})
export class ToString implements PipeTransform {
  transform(text: number, ...args: any[]) {
    return text.toString()
  }
}