import {Component, OnInit} from '@angular/core';
import {TodoService} from "./services/todo.service";

@Component({
  selector: 'app-todos',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  constructor(public srv: TodoService) {
  }

  ngOnInit(): void {
  }

}
