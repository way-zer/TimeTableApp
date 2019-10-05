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
import {UsefulLinksService} from './services/useful-links.service';
import {TimeTableService} from './services/time-table.service';
import {ClassDetailComponent} from './pages/time-table/class-detail/class-detail.component';
import {ClassImportService} from './services/class-import.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule, FirebaseOptionsToken} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';

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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    UsefulLinksService,
    TimeTableService,
    ClassImportService,
    {provide: FirebaseOptionsToken, useValue: environment.firebase}
  ],
  entryComponents: [
    ClassDetailComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
