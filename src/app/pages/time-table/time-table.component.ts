import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Class, TimeTableService} from './time-table.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ClassDetailComponent} from './class-detail/class-detail.component';
import {ClassImportService} from './class-import.service';

interface Cell {
  type: string;
  data: number | Class | null;
}

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {
  map: Observable<Cell[][]>;

  constructor(public s: TimeTableService, private dialog: MatDialog, private sInput: ClassImportService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const maxClass = this.s.getTimeSet().length;
    const os = [1, 2, 3, 4, 5].map(d => this.s.getClasses(d));
    this.map = combineLatest(os).pipe(
      map((cs: Class[][]) => {
        const m = [];
        for (let ii = 1; ii <= maxClass; ii++) {
          const l: Cell[] = [{type: 'start', data: ii}];
          for (let i = 0; i < 5; i++) {
            const found = cs[i].find(c => (c.session <= ii && (c.session + c.sectionNumber) > ii));
            if (found) {
              if (found.session === ii) {
                l.push({type: 'class', data: found});
              } else {
                l.push({type: 'pass', data: null});
              }
            } else {
              l.push({type: 'empty', data: null});
            }
          }
          m.push(l);
        }
        console.log(m);
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

  setWeek(d: number) {
    this.s.currentWeek.next(this.s.currentWeek.value + d);
  }

  onDrop(event: DragEvent) {
    const data = event.dataTransfer.getData('text/html');
    if (!data.startsWith('<table')) {
      return this.snackBar.open('Error: please follow the steps');
    }
    const dom = (new DOMParser()).parseFromString(data, 'text/html');
    this.s.inputClasses(dom);
    return this.snackBar.open('Input successful');
  }

  onPaste(event: ClipboardEvent) {
    const data = event.clipboardData.getData('text/html');
    if (!data.includes('<table')) {
      return this.snackBar.open('Error: please follow the steps');
    }
    const dom = (new DOMParser()).parseFromString(data, 'text/html');
    this.s.inputClasses(dom.body);
    return this.snackBar.open('Input successful');
  }
}
