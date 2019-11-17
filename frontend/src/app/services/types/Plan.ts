import * as Moment from 'moment';
export const enum PlanType {
  HomeWork, Normal
}
export function humanizeTime(time: PlanTime): string {
  if (typeof time === 'string') {
    return time;
  }
  return Moment(time).fromNow();
}
export type PlanTime = number|string;
export interface PlanBaseData {
  title: string;
  brief?: string;
  finished?: boolean;
  content: string;
  [key: string]: any;
}

export class Plan {
  constructor(
    public type: PlanType,
    public time: PlanTime,
    public data: PlanBaseData,
  ) {}
}
