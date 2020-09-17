import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TimeTableService} from '../../services/time-table.service';
import {MatDialog} from '@angular/material/dialog';
import {ClassDetailComponent} from './class-detail/class-detail.component';
import {Class, ClassTime} from '../../services/types/Class';
import {ClassImportService} from '../../services/class-import.service';

interface Cell {
  type: string;
  data: number | Class & { time: ClassTime, enable: boolean, length: number, highlight: boolean } | null;
}

interface NewCell {
  class: Class;
  enable: boolean;
  highlight: boolean;
  day: number;
  session: number;
  length: number;
  time: ClassTime;
}

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})
export class TimeTableComponent implements OnInit {
  map: Observable<Cell[][]>;
  newMap: Observable<NewCell[]>;
  todayWeekday = new Date().getDay()

  constructor(public s: TimeTableService,
              private dialog: MatDialog,
              private adapterS: ClassImportService,
              title: Title
  ) {
    title.setTitle("课程表")
  }

  ngOnInit() {
    const maxClass = this.getSessionList().length;
    this.map = this.s.settings.pipe(
      map((settings) => {
        const {currentWeek: week, classList: cs} = settings;
        const m: Cell[][] = [];
        for (let ii = 1; ii <= maxClass; ii++) {
          const l: Cell[] = [{type: 'start', data: ii}];
          for (const d of this.getWeekList()) {
            l.push({type: 'empty', data: null});
          }
          m.push(l);
        }
        cs.forEach(c => c.times.forEach(t => {
          let s = t.session.start - 1;
          const highlight = settings.highlightToday && (this.todayWeekday === t.weekDay);
          const data = {
            type: 'class',
            data: {...c, time: t, enable: t.include(week), length: t.session.getLength(), highlight}
          };
          if (data.data.enable || (settings.showNonThisWeek && m[s][t.weekDay].type === 'empty')) {
            m[s][t.weekDay] = data;
          }
          for (s += 1; s < t.session.end; s++) {
            m[s][t.weekDay] = {type: 'pass', data: null};
          }
        }));
        return m;
      })
    );
    this.newMap = this.s.settings.pipe(map(({currentWeek, classList, highlightToday}) => (
      classList.map(c => (
        c.times.map(time => ({
          class: c, enable: time.include(currentWeek), day: +time.weekDay, time,
          length: time.session.getLength(), session: time.session.start,
          highlight: highlightToday && (this.todayWeekday === time.weekDay)
        } as NewCell))
      )).reduce((list, v) => (list.concat(v)), [])
        .filter((v, _, arr) => (v.enable || !arr.some(it => (it != v && it.day == v.day && it.session == v.session))))//去除同一时间的重复课程
    )));
  }

  getSessionList() {
    return this.adapterS.adapter.value.timeTable;
  }

  getWeekList() {
    return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].slice(0, this.adapterS.adapter.value.maxDay);
  }

  showDetail(c: Class) {
    this.dialog.open(ClassDetailComponent, {
      data: c
    });
  }
}
