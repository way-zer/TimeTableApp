import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ClassImportService} from '../../../services/class-import.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TimeTableService} from '../../../services/time-table.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import * as AV from 'leancloud-storage';

@Component({
  selector: 'app-time-table-settting',
  templateUrl: './time-table-setting.component.html',
  styleUrls: ['./time-table-setting.component.css']
})
export class TimeTableSettingComponent implements OnInit {
  public syncMessage = '';
  public syncForm: FormControl;
  constructor(public s: TimeTableService,
              private sInput: ClassImportService,
              private snackBar: MatSnackBar,
              private builder: FormBuilder,
              private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.syncForm = this.builder.control('', Validators.pattern(/[0-9]{6}/));
    this.syncForm.statusChanges.subscribe(value => {
      if (value === 'VALID') {
        const code = this.syncForm.value;
        this.syncForm.disable();
        this.syncForm.setValue('正在获取数据');
        this.s.download(code).then(value1 => {
          this.syncForm.setValue(value1);
        });
      }
    });
  }


  setWeek(d: number) {
    this.s.currentWeek.next(this.s.currentWeek.value + d);
  }

  inputData(transfer: DataTransfer) {
    const data = transfer.getData('text/html');
    if (!data) {
      return this.snackBar.open('Error: please follow the steps');
    }
    const dom = (new DOMParser()).parseFromString(data, 'text/html');
    this.snackBar.open(this.s.inputClasses(dom.body));
  }

  syncClick() {
    this.syncMessage = '正在上传数据';
    this.s.upload().then(value => {this.syncMessage = value; this.cd.detectChanges(); });
  }
}
