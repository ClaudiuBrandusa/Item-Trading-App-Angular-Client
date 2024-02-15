import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaceOverMaxWithPlusPipe } from './numbers/replace-over-max-with-plus.pipe';
import { TruncatePipe } from './text/truncate.pipe';
import { ToString } from './text/to-string.pipe';


@NgModule({
  declarations: [
    ReplaceOverMaxWithPlusPipe,
    TruncatePipe,
    ToString
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReplaceOverMaxWithPlusPipe,
    TruncatePipe,
    ToString
  ]
})
export class PipeModule { }
