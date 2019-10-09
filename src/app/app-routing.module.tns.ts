import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import {RouteLinkService} from '@src/app/services/route-link.service';

export const routes: Routes = [
  {
      path: '',
      redirectTo: '/auto-generated',
      pathMatch: 'full',
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
  providers: [RouteLinkService],
})
export class AppRoutingModule { }
