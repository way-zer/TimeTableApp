import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {MyScheduleService} from '../../../services/my-schedule.service';
import {Plan} from '../../../services/types/Plan';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-schedule-list',
    templateUrl: './schedule-list.component.html',
    styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit {
    @Input() filter: (p: Plan) => boolean;
    @Input() handler: ((value: Plan[]) => Plan[]);
    @Input() briefMap: (Plan) => string = (plan => plan.data.brief);
    @ContentChild(TemplateRef, {read: TemplateRef, static: false}) content: TemplateRef<Plan>;
    @Input() contentTemplate: TemplateRef<Plan>;

    get template() {
        return this.contentTemplate || this.content;
    }

    data: Observable<Plan[]>;

    constructor(private s: MyScheduleService) {
    }

    ngOnInit() {
        this.data = this.s.plans;
        if (this.filter) {
            this.data = this.s.plans.pipe(
                map(value => value.filter(this.filter))
            );
        }
        if (this.handler) {
            this.data = this.data.pipe(
                map(this.handler)
            );
        }
    }

    toggleTask(item: Plan) {
        this.s.togglePlan(item);
    }

    deletePlan(plan: Plan) {
        this.s.deletePlan(plan);
    }
}
