import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DesktopRoutingModule} from './desktop-routing.module';
import {GymTryComponent} from './pages/gym-try/gym-try.component';
import {MatButtonModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, MatSelectModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
// @ts-ignore
// const Electron = window["require"]("electron");

@NgModule({
  declarations: [GymTryComponent],
  imports: [
    CommonModule,
    DesktopRoutingModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    HttpClientModule
  ],
})
export class DesktopModule {
  constructor() {
  }
}
