import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { loadAppointments } from '../actions/calendar.actions';
import { EMPTY } from 'rxjs';
import { createEffect } from '@ngrx/effects';
import { switchMap } from 'rxjs';

@Injectable()
export class CalendarEffects {
    constructor(private actions$: Actions) { }

    loadAppointments$ = createEffect(() => this.actions$.pipe(
        ofType(loadAppointments),
        // Add logic to fetch data if required
        switchMap(() => EMPTY) // Just return an empty observable for now
    ), { dispatch: false });
}
