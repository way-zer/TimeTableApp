import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Class, ClassTime, Range, WeekType} from '../../../services/types/Class';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit {
  weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  constructor(public dialogRef: MatDialogRef<ClassDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Class) {
  }

  ngOnInit() {
  }

  getWeek(t: ClassTime) {
    if (t.type === WeekType.Weeks) {
      return (t.weeks as number[]).join(', ');
    }
    let str = (t.weeks as Range).start + '-' + (t.weeks as Range).end + '周';
    if (t.type === WeekType.DoubleWeek) {
      str += '(双周)';
    } else if (t.type === WeekType.SingleWeek) {
      str += '(单周)';
    } else { str += ''; }
    return str;
  }
}
