import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TimeTableService} from '../../services/time-table.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ClassDetailComponent} from './class-detail/class-detail.component';
import {ClassImportService} from '../../services/class-import.service';
import {Class} from '../../services/types/Class';
import {AngularFireAuth} from '@angular/fire/auth';

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
  btnEnable = true;

  constructor(public s: TimeTableService, public auth: AngularFireAuth,
              private dialog: MatDialog, private sInput: ClassImportService, private snackBar: MatSnackBar) {
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

  inputData(transfer: DataTransfer) {
    const data = transfer.getData('text/html');
    if (!data.includes('<table')) {
      return this.snackBar.open('Error: please follow the steps');
    }
    const dom = (new DOMParser()).parseFromString(data, 'text/html');
    this.s.inputClasses(dom.body || dom);
    return this.snackBar.open('Input successful');
  }

  login(email: string, password: string) {
    this.snackBar.open('Logging in,Please Wait!');
    this.auth.auth.signInWithEmailAndPassword(email, password).then(value1 => {
      this.snackBar.open('Signing in Successful!');
    }).catch((data:{code, message}) => {
      if (data.code === 'auth/user-not-found') {
        return this.snackBar.open("Check your email: "+email+", "+data.message,"Click Me to Register").onAction()
          .toPromise().then(()=>{//Register
          return this.auth.auth.createUserWithEmailAndPassword(email, password).then(() => {
            this.snackBar.open('Creating user Successful!');
          })
        })
      } else {
        throw data
      }
    }).catch(({code, message}) => {
      this.snackBar.open(message)
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
