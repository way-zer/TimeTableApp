import {Component, ContentChildren, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {CdkDragSortEvent, moveItemInArray} from '@angular/cdk/drag-drop';
import {SortableItemDirective} from './sortable-item.directive';

@Component({
  selector: 'app-sortable-ui',
  templateUrl: './sortable-ui.component.html',
  styleUrls: ['./sortable-ui.component.css']
})
export class SortableUIComponent {
  @Input() sortList: string[] = [];
  @Output() sortListChange = new EventEmitter<string[]>();
  $children: QueryList<SortableItemDirective>;

  @ContentChildren(SortableItemDirective) set children(v: QueryList<SortableItemDirective>) {
    this.$children = v;
    if (!this.sortList || !this.sortList.length) {
      this.sortList = v.map(value => value.title);
    }
  }

  constructor() {
  }

  getTemplate(title: string) {
    return this.$children.find(item => item.title === title).ref;
  }

  handleDrop(event: CdkDragSortEvent<string>) {
    moveItemInArray(this.sortList, event.previousIndex, event.currentIndex);
    this.sortListChange.emit(this.sortList);
  }
}
