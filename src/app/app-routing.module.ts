import {Injectable, NgModule} from '@angular/core';
import {PreloadingStrategy, Route, Router, RouterModule, Routes} from '@angular/router';
import {UsefulLinksComponent} from './pages/useful-links/useful-links.component';
import {TimeTableComponent} from './pages/time-table/time-table.component';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {RouteLinkService} from './services/route-link.service';

const routes: Routes = [
  {path: '', redirectTo: '/usefulLinks', pathMatch: 'full'},
  {path: 'usefulLinks', component: UsefulLinksComponent},
  {path: 'timeTable', component: TimeTableComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: MyPreloadingStrategy})],
  exports: [RouterModule],
  providers: [RouteLinkService, MyPreloadingStrategy],
})
export class AppRoutingModule {
  constructor(private router: Router, private ser: RouteLinkService) {
    router.errorHandler = error => {
      console.warn(error);
      this.router.navigate([]);
    };
    ser.registerLinks(
      {path: '/usefulLinks', label: '常用链接'},
      {path: '/timeTable', label: '课程表'},
    );
  }
}
