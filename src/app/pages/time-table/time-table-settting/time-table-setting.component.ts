import { Component, OnInit } from '@angular/core';
import {ClassImportService} from '../../../services/class-import.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TimeTableService} from '../../../services/time-table.service';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-time-table-settting',
  templateUrl: './time-table-setting.component.html',
  styleUrls: ['./time-table-setting.component.css']
})
export class TimeTableSettingComponent implements OnInit {

  btnEnable = true;
  constructor(public s: TimeTableService,
              public auth: AngularFireAuth,
              private sInput: ClassImportService,
              private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
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

  login(email: string, password: string) {
    this.snackBar.open('Logging in,Please Wait!');
    this.auth.auth.signInWithEmailAndPassword(email, password).then(_ => {
      this.snackBar.open('Signing in Successful!');
    }).catch((data: { code, message }) => {
      if (data.code === 'auth/user-not-found') {
        return this.snackBar.open('Check your email: ' + email + ', ' + data.message, 'Click Me to Register').onAction()
          .toPromise().then(() => {// Register
            return this.auth.auth.createUserWithEmailAndPassword(email, password).then(() => {
              this.snackBar.open('Creating user Successful!');
            });
          });
      } else {
        throw data;
      }
    }).catch(({_, message}) => {
      this.snackBar.open(message);
    });
  }


  upload(uid: string) {
    if (!this.btnEnable) {
      return;
    }
    this.btnEnable = false;
    this.s.upload(uid).then(() => {
      this.snackBar.open('Uploading Successful!');
    }).catch(error => {
      this.snackBar.open('Upload Fail: ' + error);
    });
  }

  download(uid: string) {
    if (!this.btnEnable) {
      return;
    }
    this.btnEnable = false;
    this.s.download(uid).then(() => {
      this.snackBar.open('Downloading Successful!');
    }).catch(error => {
      this.snackBar.open('Download Fail: ' + error);
    });
  }
}
