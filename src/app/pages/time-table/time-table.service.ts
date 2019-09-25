import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const KEY_START_DATE = 'StartDate';
const TIME_DAY = 1000 * 60 * 60 * 24;

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

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {
  private mockClasses: Class[] = [
    new Class('大学生心理健康', 0.5, '杜玉春', '办-一层多功能厅', 3, 18, 1, 1, 2),
    new Class('安全教育', 0.0, '胡承蓉', '', 3, 18, 0, 0, 0),
    new Class('信息与通信工程专业导论', 3.0, '信通01', 'N319', 4, 18, 5, 1, 2),
    new Class('信息与通信工程专业导论', 3.0, '信通01', 'N319', 5, 18, 2, 1, 2),
    new Class('C/C++程序设计与编程方法', 3.0, '许桂平', 'N103', 3, 18, 5, 3, 3),
    new Class('数学分析(上)', 6.0, '刘宝生', 'N103', 3, 18, 4, 6, 3),
    new Class('数学分析(上)', 6.0, '刘宝生', 'N103', 3, 18, 2, 3, 3),
    new Class('思想道德修养与法律基础', 3.0, '温雪', '办-一层多功能厅', 3, 18, 1, 3, 3),
    new Class('线性代数', 6.0, '李亚杰', 'N103', 3, 18, 2, 9, 3),
    new Class('形势与政策1', 0.4, '马院01', '办-一层多功能厅', 8, 10, 1, 1, 2),
    new Class('综合英语（A）', 3.0, '李楠 李智远', 'N302', 3, 18, 1, 8, 2),
    new Class('综合英语（A）', 3.0, '李楠 李智远', 'N406', 3, 18, 3, 1, 2, WeekType.Double),
    new Class('创新创业能力与方法（双创）', 3.0, '任维政', 'N206', 3, 18, 2, 13, 2),
  ];
  public currentWeek = new BehaviorSubject<number>(TimeTableService.calWeek());

  constructor() {
    this.currentWeek.subscribe(week => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      now.setTime(now.getTime() - now.getDay() * TIME_DAY);
      now.setTime(now.getTime() - (week - 1) * TIME_DAY * 7);
      localStorage.setItem(KEY_START_DATE, now.getTime().toString());
    });
  }

  private static calWeek(): number {
    const startD = new Date(+localStorage.getItem(KEY_START_DATE) || new Date());
    return Math.ceil(((new Date()).getTime() - startD.getTime()) / (TIME_DAY * 7));
  }

  public getClasses(day: number): Observable<Class[]> {
    return this.currentWeek.pipe(
      map((week) => this.mockClasses.filter(d => {
          if (d.weeksS > week || d.weeksE < week) {
            return false;
          }
          if (week % 2 === 0 && d.weekOther === WeekType.Single) {
            return false;
          }
          if (week % 2 !== 0 && d.weekOther === WeekType.Double) {
            return false;
          }
          return d.week === day;
        })
      ));
  }

  public getTimeSet(): string[] {
    return [
      '8:00-8:45',
      '8:50-9:35',
      '9:50-10:35',
      '10:40-11.25',
      '11:30-12:15',
      '13:00-13:45',
      '13:50-14:35',
      '14:45-15:30',
      '15:40-16:25',
      '16:35-17:20',
      '17:25-18:10',
      '18:30-19:05',
      '19:20-20:05',
      '20:10-20:55',
    ];
  }
}
