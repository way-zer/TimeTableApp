export enum WeekType {
  Normal, Double, Single
}

export class Class {
  constructor(
    public name: string,
    public score: number,
    public teacher: string,
    public place: string,
    public weeksS: number,
    public weeksE: number,
    public week: number,
    public session: number,
    public sectionNumber: number,
    public weekOther: WeekType = WeekType.Normal) {
  }
}
