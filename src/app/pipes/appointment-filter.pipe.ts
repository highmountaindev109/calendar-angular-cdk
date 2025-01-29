import { Pipe, PipeTransform } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Pipe({
    name: 'appointmentFilter'
})
export class AppointmentFilterPipe implements PipeTransform {
    transform(appointments: Appointment[] | null, targetDate: Date): Appointment[] {
        if (!appointments) {
            return []; // Ensure it always returns an empty array if appointments is null
        }

        return appointments.filter(appointment => {
            const appointmentStartDate = new Date(appointment.start_date);
            const appointmentEndDate = new Date(appointment.end_date);

            // Check if the appointment starts or ends on the targetDate
            return (
                appointmentStartDate.toDateString() === targetDate.toDateString() ||
                appointmentEndDate.toDateString() === targetDate.toDateString()
            );
        });
    }
}
