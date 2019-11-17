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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TimeTableComponent} from './pages/time-table/time-table.component';
import {UsefulLinksService} from './services/useful-links.service';
import {TimeTableService} from './services/time-table.service';
import {ClassDetailComponent} from './pages/time-table/class-detail/class-detail.component';
import {ClassImportService} from './services/class-import.service';
import {environment} from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TimeTableSettingComponent } from './pages/time-table/time-table-settting/time-table-setting.component';
import { MyScheduleComponent } from './pages/my-schedule/my-schedule.component';
import { ScheduleListComponent } from './pages/my-schedule/schedule-list/schedule-list.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    UsefulLinksComponent,
    TimeTableComponent,
    ClassDetailComponent,
    TimeTableSettingComponent,
    MyScheduleComponent,
    ScheduleListComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
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
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [
    UsefulLinksService,
    TimeTableService,
    ClassImportService,
  ],
  entryComponents: [
    ClassDetailComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
