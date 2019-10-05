import {Component} from '@angular/core';
import {RouteLinkService} from '../../services/route-link.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyApp';

  constructor(public ser: RouteLinkService) {
  }
}
