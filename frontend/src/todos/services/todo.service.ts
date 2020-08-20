import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Todo} from './todo';
import {JsonHelper} from '../../utils/json-helper';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  data: BehaviorSubject<Todo[]> = new BehaviorSubject(
    JsonHelper.parseArray(Todo, [
      {title: '测试事项', likelyTime: 60 * 60, startTime: Date.now()},
      {title: '测试事项', likelyTime: 60 * 60, startTime: Date.now()},
    ]))

  constructor() {
  }
}
