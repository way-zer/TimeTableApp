import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[appSortableItem]'
})
export class SortableItemDirective {
  @Input('appSortableItem') title: string;

  constructor(public readonly ref: TemplateRef<any>) {
  }

}
