import {Component, OnInit} from '@angular/core';
import {Plan, UNKNOWN_TIME} from '../../services/types/Plan';
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
    day: new FormControl('-1', Validators.required),
    time: new FormControl('', control => {
      if (this.newTaskForm && this.newTaskForm.value.day === '-1') {
        return null;
      }
      return Validators.required(control);
    }),
  });

  constructor(
    private s: MyScheduleService
  ) {
  }

  ngOnInit() {
  }

  todayHandler(data: Plan[]) {
    return data.filter(value => value.exactTime.diff(Moment(), 'd') === 0)
      .sort((a, b) => a.exactTime.isSameOrBefore(b.exactTime) ? -1 : 0);
  }

  todayBrief(data: Plan): string {
    const stars = '⭐'.repeat(data.priority);
    const time = data.exactTime.format('HH:MM');
    return ` ${time} ${stars}`;
  }

  unknownFilter(data: Plan[]) {
    return data.filter(value => value.time === UNKNOWN_TIME);
  }

  unknownBrief(data: Plan) {
    return '⭐'.repeat(data.priority);
  }

  allHandler(data: Plan[]) {
    return data.sort((a, b) => a.exactTime.isSameOrBefore(b.exactTime) ? -1 : 0);
  }

  addTask() {
    const {title, priority, content, day, time} = this.newTaskForm.value;
    const task = new Plan();
    task.data = {title, content};
    task.priority = priority;
    if ((+day) === -1) {
      task.time = UNKNOWN_TIME;
    } else {
      const moment = Moment();
      moment.add(+day, 'day');
      const sp = time.split(':');
      moment.hour(+sp[0]);
      moment.minute(+sp[1]);
    }
    this.s.addPlan(task);
  }
}
