import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ClassImportService} from './class-import.service';
import {Class, WeekType} from './types/Class';
import {JsonHelper} from '../../utils/json-helper';
import {DataSyncService} from './data-sync.service';

const TIME_DAY = 1000 * 60 * 60 * 24;

class Setting {
  adapterName: string;
  startDate: number;
  classList: Class[];
  showNonThisWeek: boolean;
  highlightToday: boolean;
  useGirdRender: boolean;
  lockWeekOne: boolean; // 锁定为第一周

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

const MOCK_CLASSES: Class[] = JsonHelper.parseArray(Class, [
  {
    name: '当前显示的默认课表仅用于展示', score: 0.5, teacher: '', place: '', times: [
      {weeks: {start: 1, end: 1}, weekDay: 3, session: {start: 3, end: 5}}]
  },
  {
    name: '请在上方设置中配置课程或自动导课', score: 0.5, teacher: '', place: '', times: [
      {weeks: {start: 1, end: 1}, weekDay: 3, session: {start: 6, end: 8}}]
  },
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
  adapterName: 'BUPT2',
  classList: MOCK_CLASSES,
  showNonThisWeek: true,
  lockWeekOne: true
});

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {
  public readonly settings = new BehaviorSubject<Setting>(DEFAULT_SETTING);

  public get currentWeek() {
    return this.settings.value.currentWeek;
  }

  constructor(private importService: ClassImportService, private sync: DataSyncService) {
    if (localStorage.getItem(KEY_SETTING)) {
      this.settings.next(JsonHelper.parseObject(Setting, localStorage.getItem(KEY_SETTING)));
    }
    this.settings.subscribe(settings => {
      if (settings.lockWeekOne && settings.currentWeek !== 1) {this.setCurrentWeek(1); }
      localStorage.setItem(KEY_SETTING, JsonHelper.jsonStringify(Setting, settings));
      this.importService.changeAdapter(settings.adapterName);
    });
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
    return this.importService.adapter.value.timeTable;
  }

  /**
   * @param dom Normally is Node body
   * @return message
   */
  public inputClasses(dom: HTMLElement): string {
    return this.importService.inputClasses(dom, res => {
      this.updateSetting({classList: res});
    });
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
