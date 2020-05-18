import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Class, ClassTime, Range, WeekType} from '../../../services/types/Class';
import {Plan, PlanType} from '../../../services/types/Plan';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MyScheduleService} from '../../../services/my-schedule.service';
import * as Moment from 'moment';
import {JsonHelper} from '../../../utils/json-helper';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Class & { time: ClassTime },
    private scheduleService: MyScheduleService,
  ) {
  }

  get taskFilter() {
    return (task: Plan) => (task.type === PlanType.HomeWork && task.data.className === this.data.name);
  }

  weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  newTaskForm = new FormGroup({
    content: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
  });

  ngOnInit() {
  }

  getWeek(t: ClassTime) {
    if (t.type === WeekType.Weeks) {
      return (t.weeks as number[]).join(', ') + ' 周';
    }
    let str = (t.weeks as Range).toString() + '周';
    if (t.type === WeekType.DoubleWeek) {
      str += '(双周)';
    } else if (t.type === WeekType.SingleWeek) {
      str += '(单周)';
    } else {
      str += '';
    }
    return str;
  }

  briefMap(plan: Plan) {
    return plan.humanizeTime;
    // TODO "下次课"具体化
  }

  addHomeWork() {
    const {content, time} = this.newTaskForm.value;
    const data = {
      title: this.data.name + '作业',
      brief: '',
      className: this.data.name,
      _time: time,
      content,
    };
    let newt;
    if (time === 'week') {
      const moment = Moment();
      moment.weekday(this.data.time.weekDay);
      moment.add(1, 'w');
      newt = moment.unix() * 1000;
    } else {
      newt = '下次课';
    }
    this.scheduleService.addPlan(JsonHelper.parseObject(Plan, {type: PlanType.HomeWork, time: newt, data}));
    this.newTaskForm.reset();
  }
}
