import {Injectable} from '@angular/core';
import {Plan, PlanType} from './types/Plan';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {removeFrom} from '../utils';
import {JsonHelper} from '../utils/json-helper';

type PlanFilter = (Plan) => boolean;

const SYNC_KEY = 'Schedule';
const KEY_SETTING = 'MyScheduleSetting';
const MOCK_PLANS: Plan[] = JsonHelper.parseArray(Plan, [
  {type: PlanType.Normal, time: Date.now() + 10, priority: 3, data: {title: 'Test Plan', content: 'Test content'}},
  {type: PlanType.Normal, time: Date.now(), priority: 3, data: {title: 'Test Plan2', content: 'Test content'}},
  {type: PlanType.Normal, time: '后天', data: {title: 'Test Plan', content: 'Good job', finished: true}},
]);

class Setting {
  plans = MOCK_PLANS;

  static afterParse(obj: Setting) {
    obj.plans = JsonHelper.parseArray(Plan, obj.plans);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MyScheduleService {
  private settings = new BehaviorSubject(new Setting());

  get plans(): Observable<Plan[]> {
    return this.settings.pipe(map(value => value.plans));
  }

  constructor() {
    if (localStorage.getItem(KEY_SETTING)) {
      // this.settings.next(JsonHelper.parseObject(Setting, localStorage.getItem(KEY_SETTING)));
    }
    this.settings.subscribe(value =>
      localStorage.setItem(KEY_SETTING, JsonHelper.jsonStringify(Setting, value))
    );
  }

  public updateSetting(obj: Partial<Setting>) {
    this.settings.next(Object.assign(this.settings.value, obj));
  }

  addPlan(plan: Plan) {
    this.updateSetting({plans: this.settings.value.plans.concat(plan)});
  }

  togglePlan(plan: Plan) {
    plan.data.finished = !plan.data.finished;
    this.updateSetting({});
  }

  deletePlan(plan: Plan) {
    if (removeFrom(this.settings.value.plans, plan)) {
      this.updateSetting({});
    }
  }
}
