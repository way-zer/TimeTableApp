import {JsonHelper} from '../../utils/json-helper';
import {isObject} from 'util';

export enum WeekType {
  Weeks, DoubleWeek, SingleWeek, Range
}

export class Range {
  public start: number;
  public end: number;

  public include(i: number) {
    return !(i < this.start || i > this.end);
  }

  public getLength() {
    return this.end - this.start + 1;
  }
}

export interface OtherData {
  userInfo?: string;
}

export class ClassTime {
  public weeks: number[] | Range;
  public weekDay: number;
  public session: Range;
  public place?: string;
  /**
   * set if having different place
   */
  public type: WeekType = WeekType.Range;

  static afterParse(obj: ClassTime) {
    obj.weeks = isObject(obj.weeks) ? JsonHelper.parseObject(Range, obj.weeks as Range) : obj.weeks;
    obj.session = JsonHelper.parseObject(Range, obj.session);
  }

  public include(week: number, weekDay?: number, session?: number): boolean {
    if (weekDay && weekDay !== this.weekDay) {
      return false;
    }
    if (session && !this.session.include(session)) {
      return false;
    }
    if (this.type === WeekType.Weeks) {
      return (this.weeks as number[]).includes(week);
    }
    if (!(this.weeks as Range).include(week)) {
      return false;
    }
    switch (this.type) {
      case WeekType.SingleWeek:
        return week % 2 === 1;
      case WeekType.DoubleWeek:
        return week % 2 === 0;
      default:
        return true;
    }
  }
}

export class Class {
  public name: string;
  public score: number;
  public teacher: string;
  public place: string;
  public times: ClassTime[];
  public otherData: OtherData[] = [];

  static afterParse(obj: Class) {
    obj.times = obj.times.map(value => JsonHelper.parseObject(ClassTime, value));
  }
}
