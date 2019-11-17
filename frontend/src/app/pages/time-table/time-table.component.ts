import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TimeTableService} from '../../services/time-table.service';
import {MatDialog} from '@angular/material';
import {ClassDetailComponent} from './class-detail/class-detail.component';
import {Class, ClassTime, Range} from '../../services/types/Class';

interface Cell {
  type: string;
  data: number | Class & { time: ClassTime, enable: boolean, length: number } | null;
}

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {
  map: Observable<Cell[][]>;

  constructor(public s: TimeTableService,
              private dialog: MatDialog,
              ) {}

  ngOnInit() {
    const maxClass = this.s.getTimeSet().length;
    this.map = this.s.getClasses().pipe(
      map(([week, cs]) => {
        const m: Cell[][] = [];
        for (let ii = 1; ii <= maxClass; ii++) {
          const l: Cell[] = [{type: 'start', data: ii}];
          for (let d = 0; d < 5; d++) {
            l.push({type: 'empty', data: null});
          }
          m.push(l);
        }
        cs.forEach(c => c.times.forEach(t => {
          let s = t.session.start - 1;
          const data = {type: 'class', data: {...c, time: t, enable: t.include(week), length: t.session.getLength()}};
          if (t.include(week) || m[s][t.weekDay].type === 'empty') {
            m[s][t.weekDay] = data;
          }
          for (s += 1; s < t.session.end; s++) {
            m[s][t.weekDay] = {type: 'pass', data: null};
          }
        }));
        return m;
      })
    );
  }

  getTime(data: number) {
    return this.s.getTimeSet()[data - 1];
  }

  showDetail(c: Class) {
    this.dialog.open(ClassDetailComponent, {
      data: c
    });
  }
}
