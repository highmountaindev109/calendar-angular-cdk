import { createReducer, on } from '@ngrx/store';
import { addAppointment, removeAppointment, updateAppointment, loadAppointments } from '../actions/calendar.actions';
import { Appointment } from '../../models/appointment.model';

export interface CalendarState {
    appointments: Appointment[];
}

export const initialState: CalendarState = {
    appointments: JSON.parse(localStorage.getItem('appointments') || '[]').map((appointment: any) => ({
        ...appointment,
        start_date: new Date(appointment.start_date), // Convert ISO strings to Date objects
        end_date: new Date(appointment.end_date),
    }))
};

export const calendarReducer = createReducer(
    initialState,
    on(addAppointment, (state, { appointment }) => {
        const updatedAppointments = [...state.appointments, {
            ...appointment,
        }];
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        return { ...state, appointments: updatedAppointments };
    }),
    on(removeAppointment, (state, { appointmentId }) => {
        const updatedAppointments = state.appointments.filter(
            (app) => app.id !== appointmentId
        );
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        return { ...state, appointments: updatedAppointments };
    }),
    on(updateAppointment, (state, { appointment }) => {
        const updatedAppointments = state.appointments.map((app) =>
            app.id === appointment.id ? appointment : app
        );
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        return { ...state, appointments: updatedAppointments };
    }),
    on(loadAppointments, (state) => state)
);
