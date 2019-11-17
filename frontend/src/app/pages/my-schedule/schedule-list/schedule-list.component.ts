import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {MyScheduleService} from '../../../services/my-schedule.service';
import {Plan, humanizeTime} from '../../../services/types/Plan';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit {
  @Input() filter: (Plan) => boolean;
  @Input() briefMap: (Plan) => string = (plan => plan.data.brief);
  @ContentChild(TemplateRef, {read: TemplateRef, static: false}) content: TemplateRef<Plan>;
  @Input() contentTemplate: TemplateRef<Plan>;
  get template() {
    return this.contentTemplate || this.content;
  }
  data: Observable<Plan[]>;

  constructor(private s: MyScheduleService) { }
  ngOnInit() {
    this.data = this.s.getSchedule(this.filter);
  }

  toggleTask(item: Plan) {
    this.s.togglePlan(item);
  }

  deletePlan(plan: Plan) {
    this.s.deletePlan(plan);
  }

  humanize(time) {
    return humanizeTime(time);
  }
}
