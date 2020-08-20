import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TodosRoutingModule} from './todos-routing.module';
import {TodoListComponent} from './todo-list.component';
import {NzButtonModule, NzListModule} from "ng-zorro-antd";


@NgModule({
  declarations: [TodoListComponent],
  imports: [
    CommonModule,
    TodosRoutingModule,
    NzListModule,
    NzButtonModule
  ]
})
export class TodosModule {
}
