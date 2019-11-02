import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {ClassImportAdapter, ClassImportService} from './class-import.service';
import {Class, ClassTime, Range, WeekType} from './types/Class';
import {AngularFirestore} from '@angular/fire/firestore';
import {JsonHelper} from '../utils/json-helper';

const KEY_START_DATE = 'StartDate';
const KEY_CLASS_LIST = 'ClassList_2';
const TIME_DAY = 1000 * 60 * 60 * 24;
const MOCK_CLASSES: Class[] = JsonHelper.parseArray(Class, [
  {
    name: '大学生心理健康', score: 0.5, teacher: '杜玉春', place: '办-一层多功能厅', times: [
      {weeks: {start: 3, end: 6}, weekDay: 1, session: {start: 1, end: 2}}]
  },
  {
    name: '思想道德修养与法律基础', score: 3.0, teacher: '温雪', place: '办-一层多功能厅', times: [
      {weeks: {start: 3, end: 18}, weekDay: 1, session: {start: 3, end: 5}}]
  },
  {
    name: '形势与政策1', score: 0.4, teacher: '马院01', place: '办-一层多功能厅', times: [
      {weeks: {start: 8, end: 10}, weekDay: 1, session: {start: 1, end: 2}}]
  },
  {name: '安全教育', score: 0.0, teacher: '胡承蓉', place: '', times: []},
  {
    name: '信息与通信工程专业导论', score: 3.0, teacher: '信通01', place: 'N319', times: [
      {weeks: {start: 4, end: 18}, weekDay: 5, session: {start: 1, end: 2}},
      {weeks: {start: 5, end: 18}, weekDay: 2, session: {start: 1, end: 2}}]
  },
  {
    name: 'C/C++程序设计与编程方法', score: 3.0, teacher: '胡承蓉', place: 'N103', times: [
      {weeks: {start: 3, end: 18}, weekDay: 5, session: {start: 3, end: 5}}]
  },
  {
    name: '数学分析(上)', score: 6.0, teacher: '刘宝生', place: 'N103', times: [
      {weeks: {start: 3, end: 18}, weekDay: 4, session: {start: 6, end: 8}},
      {weeks: {start: 3, end: 18}, weekDay: 2, session: {start: 3, end: 5}}]
  },
  {
    name: '线性代数', score: 6.0, teacher: '李亚杰', place: 'N103', times: [
      {weeks: {start: 3, end: 18}, weekDay: 2, session: {start: 9, end: 11}}]
  },
  {
    name: '综合英语（A）', score: 3.0, teacher: '李楠 李智远', place: 'N302', times: [
      {weeks: {start: 3, end: 18}, weekDay: 1, session: {start: 8, end: 9}, place: 'N302'},
      {weeks: {start: 3, end: 18}, weekDay: 3, session: {start: 1, end: 2}, place: 'N406', type: WeekType.DoubleWeek}]
  },
  {
    name: '创新创业能力与方法（双创）', score: 3.0, teacher: '任维政', place: 'N206', times: [
      {weeks: {start: 3, end: 18}, weekDay: 2, session: {start: 13, end: 14}}]
  },
]);

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
      this.classList.next(JsonHelper.parseArray(Class, localStorage.getItem(KEY_CLASS_LIST)));
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
