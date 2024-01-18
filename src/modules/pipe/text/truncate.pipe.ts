import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'truncate'  
})
export class TruncatePipe implements PipeTransform {
  transform(text: string, characterLimit: number, ...args: any[]) {
    if (text.length < characterLimit) return text;

    return text.slice(0, characterLimit) + "...";
  }
}