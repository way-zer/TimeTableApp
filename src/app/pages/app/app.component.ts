import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyApp';
  links = [
    {path: '/usefulLinks', label: '常用链接'},
    {path: '/timeTable', label: '课程表'},
  ];
}
