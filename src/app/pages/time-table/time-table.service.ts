import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';
import {ClassImportAdapter, ClassImportService} from './class-import.service';

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

const KEY_START_DATE = 'StartDate';
const KEY_CLASS_LIST = 'ClassList';
const TIME_DAY = 1000 * 60 * 60 * 24;
const MOCK_CLASSES: Class[] = [
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

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {
  public currentWeek = new BehaviorSubject<number>(TimeTableService.calWeek());
  public classList = new BehaviorSubject(MOCK_CLASSES);
  private adapter: ClassImportAdapter;

  constructor(private importService: ClassImportService) {
    this.adapter = importService.getAdopter('BUPT');
    if (localStorage.getItem(KEY_CLASS_LIST)) {
      this.classList.next(JSON.parse(localStorage.getItem(KEY_CLASS_LIST)));
    }
    this.classList.subscribe(data => {
      localStorage.setItem(KEY_CLASS_LIST, JSON.stringify(data));
    });
    this.currentWeek.subscribe(week => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      now.setTime(now.getTime() - now.getDay() * TIME_DAY);
      now.setTime(now.getTime() - (week - 1) * TIME_DAY * 7);
      localStorage.setItem(KEY_START_DATE, now.getTime().toString());
    });
  }

  private static calWeek(): number {
    if (!localStorage.getItem(KEY_START_DATE)) {
      return 1;
    }
    const startD = new Date(+localStorage.getItem(KEY_START_DATE));
    return Math.ceil(((new Date()).getTime() - startD.getTime()) / (TIME_DAY * 7));
  }

  public getClasses(day: number): Observable<Class[]> {
    return this.currentWeek.pipe(
      concatMap((week) => this.classList.pipe(
        map(l => l.filter(d => {
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
        })))
      ));
  }

  public getTimeSet(): string[] {
    return this.adapter.timeTable;
  }

  public inputClasses(dom: Node) {
    this.classList.next(this.adapter.parse(dom));
  }
}
