import {Injectable} from '@angular/core';
import {Plan, PlanType} from './types/Plan';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {removeFrom} from '../utils';

type PlanFilter = (Plan) => boolean;

const KEY_SCHEDULE = 'mySchedule';
const MOCK_PLANS: Plan[] = [
  {type: PlanType.Normal, time: '明天', data: {title: 'Test Plan', content: 'Test content'}},
  {type: PlanType.Normal, time: '后天', data: {title: 'Test Plan', content: 'Good job', finished: true}},
];

@Injectable({
  providedIn: 'root'
})
export class MyScheduleService {
  private plans = new BehaviorSubject(MOCK_PLANS);
  constructor() {
    if (localStorage.getItem(KEY_SCHEDULE)) {
      this.plans.next(JSON.parse(localStorage.getItem(KEY_SCHEDULE)));
    }
    this.plans.subscribe(value =>
      localStorage.setItem(KEY_SCHEDULE, JSON.stringify(value))
    );
  }
  public getSchedule(filter?: PlanFilter): Observable<Plan[]> {
    if (!filter) {return this.plans; }
    return this.plans.pipe(
      map(value => value.filter(filter))
    );
  }

  addPlan(plan: Plan) {
    this.plans.next(this.plans.value.concat(plan));
  }

  togglePlan(plan: Plan) {
    plan.data.finished = !plan.data.finished;
    this.plans.next(this.plans.value);
  }

  deletePlan(plan: Plan) {
    if (removeFrom(this.plans.value, plan)) { this.plans.next(this.plans.value); }
  }
}
