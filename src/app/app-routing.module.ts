import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsefulLinksComponent} from './pages/useful-links/useful-links.component';
import {TimeTableComponent} from './pages/time-table/time-table.component';


const routes: Routes = [
  {path: 'usefulLinks', component: UsefulLinksComponent},
  {path: 'timeTable', component: TimeTableComponent},
  {path: '**', redirectTo: 'usefulLinks'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
