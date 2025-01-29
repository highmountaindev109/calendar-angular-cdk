import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { loadAppointments } from '../store/actions/calendar.actions';
import { CalendarState } from '../store/reducers/calendar.reducer';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { removeAppointment } from '../store/actions/calendar.actions';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { updateAppointment } from '../store/actions/calendar.actions';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  appointments$: Observable<Appointment[]>;
  daysInMonth: Date[] = [];
  currentMonth: Date = new Date();
  currentMonthName: string = '';
  selectedDate: Date = new Date(); // Ensure it starts with a valid Date


  hoursInDay: Date[] = []; // Holds hourly slots for the timeline
  today: Date = new Date();

  constructor(private store: Store<{ calendar: CalendarState }>, private dialog: MatDialog) {
    this.appointments$ = this.store.select(state => state.calendar.appointments);
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.updateMonthView();
    this.initializeHoursInDay();

    this.appointments$.subscribe(appointments => {
      console.log('Loaded Appointments:', appointments);
    });
  }

  // Initialize the hours array with 24 hourly slots
  initializeHoursInDay(): void {
    const startOfDay = new Date(this.selectedDate || new Date());
    startOfDay.setHours(0, 0, 0, 0); // Start at midnight
    this.hoursInDay = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(startOfDay);
      hour.setHours(i, 0, 0, 0);
      return hour;
    });
  }

  isTimeSlotMatching(appointment: Appointment, hourSlot: Date): boolean {
    const appointmentStart = new Date(appointment.start_date).getTime();
    const appointmentEnd = new Date(appointment.end_date).getTime();
    const hourStart = hourSlot.getTime();
    const hourEnd = hourStart + 60 * 60 * 1000; // End of the hourly slot

    // Ensure the appointment spans across this slot as a single block
    return appointmentStart < hourEnd && appointmentEnd > hourStart;
  }


  getAppointmentStyles(appointment: Appointment): any {
    if (!this.selectedDate) return {};

    const appointmentStart = new Date(appointment.start_date);
    const appointmentEnd = new Date(appointment.end_date);

    const dayStart = new Date(this.selectedDate);
    dayStart.setHours(0, 0, 0, 0); // Midnight of the selected date

    const totalDayMinutes = 24 * 60; // 1440 minutes in a day
    const startMinutes = (appointmentStart.getTime() - dayStart.getTime()) / (1000 * 60);
    const durationMinutes = (appointmentEnd.getTime() - appointmentStart.getTime()) / (1000 * 60);

    return {
      top: `${(startMinutes / totalDayMinutes) * 100}%`, // Positioning based on minutes
      height: `${(durationMinutes / totalDayMinutes) * 100}%`, // Duration in minutes
      position: 'absolute',
      left: '20%', // Ensures no overlap with labels
      width: '70%', // Fit within timeline
      backgroundColor: '#1976d2',
      color: 'white',
      borderRadius: '4px',
      padding: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    };
  }


  // Check if an appointment overlaps with a specific hour slot
  isOverlapping(appointment: Appointment, hourSlot: Date): boolean {
    const appointmentStart = new Date(appointment.start_date).getTime();
    const appointmentEnd = new Date(appointment.end_date).getTime();
    const hourStart = hourSlot.getTime();
    const hourEnd = hourSlot.getTime() + 60 * 60 * 1000; // Add 1 hour

    return appointmentStart < hourEnd && appointmentEnd > hourStart;
  }

  // Update the calendar grid when the month changes
  updateMonthView(): void {
    // Get the first and last day of the current month
    const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    // Calculate days from the previous month to display
    const startDay = firstDayOfMonth.getDay(); // Day of the week (0 = Sunday, 1 = Monday, etc.)
    const daysInPreviousMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0).getDate();

    const previousMonthDays = Array.from({ length: startDay }, (_, i) => {
      return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, daysInPreviousMonth - startDay + i + 1);
    });

    // Calculate days in the current month
    const currentMonthDays = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => {
      return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i + 1);
    });

    // Calculate days from the next month to display
    const endDay = lastDayOfMonth.getDay(); // Day of the week (0 = Sunday, 1 = Monday, etc.)
    const nextMonthDays = Array.from({ length: 6 - endDay }, (_, i) => {
      return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, i + 1);
    });

    // Combine all days into a single array
    this.daysInMonth = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
    this.currentMonthName = this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }


  // Load the appointments from the store
  loadAppointments(): void {
    this.store.dispatch(loadAppointments());
  }

  // When a date is clicked, show the timeline for that date
  onDateClick(day: Date): void {
    this.selectedDate = day;
    this.initializeHoursInDay(); // Refresh the hours for the selected day
  }

  // Navigate to the previous month
  previousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.updateMonthView();
  }

  // Navigate to the next month
  nextMonth(): void {
    // this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);

    this.updateMonthView();
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return (
      day.getFullYear() === today.getFullYear() &&
      day.getMonth() === today.getMonth() &&
      day.getDate() === today.getDate()
    );
  }

  openAppointmentForm(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadAppointments();
    });
  }

  isDateSelected(day: Date): boolean {
    return this.selectedDate?.toDateString() === day.toDateString();
  }

  deleteAppointment(appointmentId: string): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.store.dispatch(removeAppointment({ appointmentId }));
    }
  }

  drop(event: CdkDragDrop<any>): void {
    const appointment = event.item.data as Appointment;
    if (!appointment || !this.selectedDate) return;

    // Get the vertical pixel distance moved
    const droppedPositionY = event.distance.y;

    // Define the height of each time slot (Adjust as per CSS)
    const slotHeight = 60; // Example: 60px per hour

    // Convert dropped position (in pixels) to minutes
    const minutesOffset = Math.round((droppedPositionY / slotHeight) * 60); // Convert pixels to minutes

    // Get the original start time's hour and minute
    const originalStart = new Date(appointment.start_date);
    const originalHour = originalStart.getHours();
    const originalMinute = originalStart.getMinutes();

    // Calculate new start time based on drop position
    const newStartTime = new Date(this.selectedDate);
    newStartTime.setHours(originalHour, originalMinute, 0, 0); // Keep original hour & minute
    newStartTime.setMinutes(originalMinute + minutesOffset); // Apply exact drop offset

    // Preserve the original duration
    const duration = new Date(appointment.end_date).getTime() - originalStart.getTime();

    // Calculate the new end time
    const newEndTime = new Date(newStartTime.getTime() + duration);

    // Dispatch updateAppointment action with the updated times
    const updatedAppointment: Appointment = {
      ...appointment,
      start_date: newStartTime,
      end_date: newEndTime
    };

    this.store.dispatch(updateAppointment({ appointment: updatedAppointment }));

    // ✨ Fix quiver: Reset drag position to prevent jump effect ✨
    setTimeout(() => {
      event.item.element.nativeElement.style.transform = 'none'; // Reset transform
      event.item.element.nativeElement.style.transition = 'none'; // Disable animation
      event.item.reset(); // Ensure no residual drag offset
    });
  }


}
