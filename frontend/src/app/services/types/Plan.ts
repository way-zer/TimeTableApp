import * as Moment from 'moment';

export const enum PlanType {
  HomeWork, Normal
}

export type PlanTime = number | string;
export const UNKNOWN_TIME: PlanTime = 'UNKNOWN';

export interface PlanBaseData {
  title: string;
  brief?: string;
  finished?: boolean;
  content: string;

  [key: string]: any;
}

export class Plan {
  type: PlanType = PlanType.Normal;
  time: PlanTime;
  priority = 0;
  data: PlanBaseData;

  static afterParse(obj: Plan) {
    // PRESERVE
  }

  get humanizeTime(): string {
    if (typeof this.time === 'string') {
      return this.time;
    }
    return Moment(this.time).fromNow();
  }

  get exactTime(): Moment.Moment {
    if (typeof this.time === 'string') {
      return Moment(0);
    } else {
      return Moment(this.time);
    }
  }
}
