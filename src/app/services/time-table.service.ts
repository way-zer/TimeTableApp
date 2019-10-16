import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {ClassImportAdapter, ClassImportService} from './class-import.service';
import {Class, ClassTime, Range, WeekType} from './types/Class';
import {AngularFirestore} from '@angular/fire/firestore';

const KEY_START_DATE = 'StartDate';
const KEY_CLASS_LIST = 'ClassList_2';
const TIME_DAY = 1000 * 60 * 60 * 24;
const MOCK_CLASSES: Class[] = [
  // new Class('大学生心理健康', 0.5, '杜玉春', '办-一层多功能厅', 3, 18, 1, 1, 2),
  new Class('安全教育', 0.0, '胡承蓉', '', []),
  new Class('信息与通信工程专业导论', 3.0, '信通01', 'N319',
    [new ClassTime(new Range(4, 18), 5, new Range(1, 2)), new ClassTime(new Range(5, 18), 2, new Range(1, 2))]),
  // new Class('C/C++程序设计与编程方法', 3.0, '许桂平', 'N103', 3, 18, 5, 3, 3),
  new Class('数学分析(上)', 6.0, '刘宝生', 'N103',
    [new ClassTime(new Range(3, 18), 4, new Range(6, 8)), new ClassTime(new Range(3, 18), 2, new Range(3, 5))]),
  // new Class('思想道德修养与法律基础', 3.0, '温雪', '办-一层多功能厅', 3, 18, 1, 3, 3),
  // new Class('线性代数', 6.0, '李亚杰', 'N103', 3, 18, 2, 9, 3),
  // new Class('形势与政策1', 0.4, '马院01', '办-一层多功能厅', 8, 10, 1, 1, 2),
  new Class('综合英语（A）', 3.0, '李楠 李智远', 'N302', [
    new ClassTime(new Range(3, 18), 1, new Range(8, 9), 'N302'),
    new ClassTime(new Range(3, 18), 3, new Range(1, 2), 'N406', WeekType.DoubleWeek)]),
  // new Class('创新创业能力与方法（双创）', 3.0, '任维政', 'N206', 3, 18, 2, 13, 2),
];

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {
  public readonly currentWeek = new BehaviorSubject<number>(TimeTableService.calWeek());
  public readonly classList = new BehaviorSubject(MOCK_CLASSES);
  private adapterName = this.importService.defaultAdopter.name;
  private adapter = new BehaviorSubject<ClassImportAdapter>(this.importService.defaultAdopter);

  constructor(private importService: ClassImportService, private db: AngularFirestore) {
    if (this.adapterName !== this.adapter.value.name) {
      importService.getAdopter(this.adapterName).then(a => this.adapter.next(a));
    }
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

  public getClasses(): Observable<[number, Class[]]> {
    return combineLatest(this.currentWeek, this.classList);
  }

  public getTimeSet(): string[] {
    return this.adapter.value.timeTable;
  }

  /**
   * @param dom Normally is Node body
   * @return message
   */
  public inputClasses(dom: HTMLElement): string {
    try {
      const next = this.adapter.value.parse(dom);
      if (!next.length) {
        // noinspection ExceptionCaughtLocallyJS
        throw Error('Empty ClassList');
      }
      this.classList.next(next);
    } catch (e) {
      console.error(dom, e);
      return 'Input fail!' + e;
    }
    return 'Input successful';
  }

  upload(uid: string): Promise<void> {
    return this.db.collection('timeTable-config').doc(uid).set({classList: this.classList.value});
  }

  download(uid: string): Promise<void> {
    return this.db.collection('timeTable-config').doc(uid).get().toPromise().then(value =>
      this.classList.next(value.data().classList)
    );
  }
}
