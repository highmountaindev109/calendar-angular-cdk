export interface Appointment {
    id: string; // Unique identifier for the appointment
    title: string; // Title or name of the appointment
    start_date: Date; // Start date and time of the appointment
    end_date: Date; // End date and time of the appointment
    description: string; // Additional details about the appointment
}
