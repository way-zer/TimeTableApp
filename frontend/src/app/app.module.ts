import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './pages/app/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UsefulLinksComponent} from './pages/useful-links/useful-links.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TimeTableComponent} from './pages/time-table/time-table.component';
import {UsefulLinksService} from './services/useful-links.service';
import {TimeTableService} from './services/time-table.service';
import {ClassDetailComponent} from './pages/time-table/class-detail/class-detail.component';
import {ClassImportService} from './services/class-import.service';
import {environment} from '../environments/environment';
import {ServiceWorkerModule} from '@angular/service-worker';
import {TimeTableSettingComponent} from './pages/time-table/time-table-settting/time-table-setting.component';
import {MyScheduleComponent} from './pages/my-schedule/my-schedule.component';
import {ScheduleListComponent} from './pages/my-schedule/schedule-list/schedule-list.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SortableUIComponent} from './components/sortable-ui/sortable-ui.component';
import {SortableItemDirective} from './components/sortable-ui/sortable-item.directive';
import {TestPageComponent} from './pages/test-page/test-page.component';
import {ClassEditComponent} from './pages/time-table/class-edit/class-edit.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    UsefulLinksComponent,
    TimeTableComponent,
    ClassDetailComponent,
    TimeTableSettingComponent,
    MyScheduleComponent,
    ScheduleListComponent,
    SortableUIComponent,
    SortableItemDirective,
    TestPageComponent,
    ClassEditComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
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
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    DragDropModule
  ],
  providers: [
    UsefulLinksService,
    TimeTableService,
    ClassImportService,
    {provide: NZ_I18N, useValue: zh_CN},
  ],
  entryComponents: [
    ClassDetailComponent,
    ClassEditComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
