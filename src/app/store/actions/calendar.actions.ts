import { createAction, props } from '@ngrx/store';
import { Appointment } from '../../models/appointment.model';

export const addAppointment = createAction(
    '[Calendar] Add Appointment',
    props<{ appointment: Appointment }>()
);

export const removeAppointment = createAction(
    '[Calendar] Remove Appointment',
    props<{ appointmentId: string }>()
);

export const updateAppointment = createAction(
    '[Calendar] Update Appointment',
    props<{ appointment: Appointment }>()
);

export const loadAppointments = createAction(
    '[Calendar] Load Appointments'
);
