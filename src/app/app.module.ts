import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CalendarComponent } from './calendar/calendar.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { calendarReducer } from './store/reducers/calendar.reducer';
import { CalendarEffects } from './store/effects/calendar.effects';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppointmentFilterPipe } from './pipes/appointment-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    AppointmentFormComponent,
    AppointmentFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ calendar: calendarReducer }),
    EffectsModule.forRoot([CalendarEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
