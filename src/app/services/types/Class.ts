export enum WeekType {
  Weeks, DoubleWeek, SingleWeek, Range
}

export class Range {
  constructor(
    public start: number,
    public end: number,
  ) {
  }

  public static include(range: Range, i: number) {
    return !(i < range.start || i > range.end);
  }

  public static getLength(range: Range) {
    return range.end - range.start + 1;
  }
}

export interface OtherData {
  userInfo?: string;
}

export class ClassTime {
  constructor(
    public weeks: number[] | Range,
    public weekDay: number,
    public session: Range,
    public place?: string,
    /**
     * set if having different place
     */
    public type: WeekType = WeekType.Range,
  ) {
  }

  public static include(time: ClassTime, week: number, weekDay?: number, session?: number): boolean {
    if (weekDay && weekDay !== time.weekDay) {
      return false;
    }
    if (session && !Range.include(time.session, session)) {
      return false;
    }
    if (time.type === WeekType.Weeks) {
      return (time.weeks as number[]).includes(week);
    }
    if (!Range.include(time.weeks as Range, week)) {
      return false;
    }
    switch (time.type) {
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
  constructor(
    public name: string,
    public score: number,
    public teacher: string,
    public place: string,
    public times: ClassTime[],
    public otherData: OtherData[] = [],
  ) {
  }
}
