import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'replaceOverMaxWithPlus'
})
export class ReplaceOverMaxWithPlusPipe implements PipeTransform {
  transform(number: Number, maxLimit: Number, ...args: any[]) {
    if (number > maxLimit) return maxLimit + '+';

    return number;
  }
}