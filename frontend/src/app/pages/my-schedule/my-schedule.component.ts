import { Component, OnInit } from '@angular/core';
import {Plan} from '../../services/types/Plan';
import * as Moment from 'moment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MyScheduleService} from '../../services/my-schedule.service';

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.css']
})
export class MyScheduleComponent implements OnInit {
  newTaskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    priority: new FormControl(1, Validators.required),
    content: new FormControl(''),
    day: new FormControl(0, Validators.required),
    time: new FormControl('', Validators.required),
  });
  constructor(
    private s: MyScheduleService
  ) { }

  ngOnInit() {
  }

  todayHandler(data: Plan[]) {
    let ret = data.filter(value => value.exactTime.diff(Moment(), 'd') === 0);
    // debugger;
    ret = ret.sort((a, b) => a.exactTime.isSameOrBefore(b.exactTime) ? -1 : 0);
    return ret;
  }
  getBrief(data: Plan): string {
    const stars = '⭐'.repeat(data.priority);
    const time = data.exactTime.format('HH:MM');
    return ` ${time} ${stars}`;
  }
  addTask() {
    // TODO addTask
  }
}
