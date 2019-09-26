import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Class} from '../time-table.service';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ClassDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Class) {
  }

  ngOnInit() {
  }

}
