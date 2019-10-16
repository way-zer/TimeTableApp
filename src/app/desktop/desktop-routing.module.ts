import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GymTryComponent} from './pages/gym-try/gym-try.component';
import {RouteLinkService} from '../services/route-link.service';


const routes: Routes = [
  {path: 'gymTry', component: GymTryComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesktopRoutingModule {
  constructor(private ser: RouteLinkService) {
    ser.registerLinks(
      {path: '/desktop/gymTry', label: '健身房'},
    );
  }
}
