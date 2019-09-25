import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './pages/app/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UsefulLinksComponent} from './pages/useful-links/useful-links.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTooltipModule,
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TimeTableComponent} from './pages/time-table/time-table.component';
import {UsefulLinksService} from './pages/useful-links/useful-links.service';
import {TimeTableService} from './pages/time-table/time-table.service';
import {ClassDetailComponent} from './pages/time-table/class-detail/class-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    UsefulLinksComponent,
    TimeTableComponent,
    ClassDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
  ],
  providers: [
    UsefulLinksService,
    TimeTableService,
  ],
  entryComponents: [
    ClassDetailComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
