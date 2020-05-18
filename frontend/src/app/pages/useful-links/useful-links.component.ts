import {Component, OnInit} from '@angular/core';
import {Link, UsefulLinksService} from '../../services/useful-links.service';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

const URL_REGEX = /^(?:https?:\/\/)([-0-9a-zA-Z.]+)(.*)$/i;

@Component({
  selector: 'app-useful-links',
  templateUrl: './useful-links.component.html',
  styleUrls: ['./useful-links.component.css']
})
export class UsefulLinksComponent implements OnInit {
  titleV = new FormControl('', [Validators.required]);
  urlV = new FormControl('', [Validators.required, Validators.pattern(URL_REGEX)]);

  constructor(public ser: UsefulLinksService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  addLink(title: string, url: string) {
    if (title && url) {
      if (this.urlV.hasError('pattern')) {
        return;
      }
      this.ser.addPrivateLink({title, href: url, private: true});
      this.snackBar.open('Add link successfully');
    } else {
      this.snackBar.open('Title or Url can\'t be empty!!');
    }
  }

  removeLink(link: Link) {
    this.ser.removeLink(link);
    this.snackBar.open('Remove link successfully');
  }

  getErrorMessage(fc: FormControl): string {
    if (fc.hasError('required')) {
      return 'This can\'t be empty';
    } else if (fc.hasError('pattern')) {
      return 'Illegal URL';
    }
    return '';
  }
}
