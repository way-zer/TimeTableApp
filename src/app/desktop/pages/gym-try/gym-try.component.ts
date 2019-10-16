import {Component, OnInit} from '@angular/core';
import {formatDate} from '@angular/common';
import {MAT_DATE_FORMATS} from '@angular/material';
import {GymTryService} from '../../services/gym-try.service';

const MY_FORMATS = {
  parse: {
    dateInput: 'yyyyMMdd',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-gym-try',
  templateUrl: './gym-try.component.html',
  styleUrls: ['./gym-try.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class GymTryComponent implements OnInit {

  constructor(private ser: GymTryService) {
  }

  get dates(): string[] {
    return [0, 1, 2, 3, 4].map(i => {
      const t = new Date();
      t.setDate(t.getDate() + i);
      return formatDate(t, 'yyyyMMdd', 'en');
    });
  }

  ngOnInit() {
  }

  request(eKey: string, date: string, timeSlot: string) {
    this.ser.getRequest('cqtva769vabt1uepmrp5esvqjj', eKey, date, +timeSlot).subscribe(res => {
      console.log(res);
    });
  }
}
