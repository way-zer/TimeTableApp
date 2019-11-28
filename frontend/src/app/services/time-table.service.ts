import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {ClassImportAdapter, ClassImportService} from './class-import.service';
import {Class, ClassTime, Range, WeekType} from './types/Class';
import {JsonHelper} from '../utils/json-helper';
import {padNumber} from '../utils';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {DataSyncService} from './data-sync.service';

const TIME_DAY = 1000 * 60 * 60 * 24;
class Setting {
  adapterNmae: string;
  startDate: number;
  classList: Class[];
  showNonThisWeek: boolean;
  highlightToday: boolean;

  static afterParse(obj: Setting) {
    obj.classList = JsonHelper.parseArray(Class, obj.classList);
  }

  get currentWeek(): number {
    const startD = new Date(this.startDate);
    return Math.ceil(((new Date()).getTime() - startD.getTime()) / (TIME_DAY * 7));
  }
}

const SYNC_KEY = 'TimeTable';
const KEY_SETTING = 'TimeTableSetting';
// TODO deprecated (keep until 2020)
const KEY_START_DATE = 'StartDate';
const KEY_CLASS_LIST = 'ClassList_2';

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
const DEFAULT_SETTING = JsonHelper.parseObject(Setting, {
  adapterNmae: 'BUPT',
  classList: MOCK_CLASSES,
  startDate: 1566662400000,
});

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {
  public readonly settings = new BehaviorSubject<Setting>(DEFAULT_SETTING);
  private adapter = new BehaviorSubject<ClassImportAdapter>(this.importService.defaultAdopter);
  public get currentWeek() {return this.settings.value.currentWeek; }

  constructor(private importService: ClassImportService, private sync: DataSyncService) {
    if (localStorage.getItem(KEY_SETTING)) {
      this.settings.next(JsonHelper.parseObject(Setting, localStorage.getItem(KEY_SETTING)));
    }
    this.settings.subscribe(settings => {
      localStorage.setItem(KEY_SETTING, JsonHelper.jsonStringify(Setting, settings));
      if (settings.adapterNmae !== this.adapter.value.name) {
        importService.getAdopter(settings.adapterNmae).then(a => this.adapter.next(a));
      }
    });
    // TODO deprecated (keep until 2020)
    if (localStorage.getItem(KEY_CLASS_LIST)) {
      this.updateSetting({classList: JsonHelper.parseArray(Class, localStorage.getItem(KEY_CLASS_LIST))});
      localStorage.removeItem(KEY_CLASS_LIST);
    }
    if (localStorage.getItem(KEY_START_DATE)) {
      this.updateSetting({startDate: +localStorage.getItem(KEY_START_DATE)});
      localStorage.removeItem(KEY_START_DATE);
    }
  }

  public updateSetting(obj: Partial<Setting>) {
    this.settings.next(Object.assign(this.settings.value, obj));
  }

  public setCurrentWeek(week: number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    now.setTime(now.getTime() - now.getDay() * TIME_DAY);
    now.setTime(now.getTime() - (week - 1) * TIME_DAY * 7);
    this.updateSetting({startDate: now.getTime()});
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
      this.updateSetting({classList: next});
    } catch (e) {
      console.error(dom, e);
      return 'Input fail!' + e;
    }
    return 'Input successful';
  }

  public syncData(code: string): Promise<string> {
    if (code) {
      return this.sync.download(SYNC_KEY, code, object => {
        this.updateSetting(JsonHelper.parseObject(Setting, object.settings));
      });
    } else {
      return this.sync.upload(SYNC_KEY, {settings: this.settings.value});
    }
  }
}
