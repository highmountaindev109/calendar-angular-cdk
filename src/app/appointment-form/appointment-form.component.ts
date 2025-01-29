import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addAppointment } from '../store/actions/calendar.actions';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appointmentForm = this.fb.group({
      title: ['', [Validators.required]],
      start_date_date: ['', [Validators.required]], // Separate date field
      start_date_time: ['', [Validators.required]], // Separate time field
      end_date_date: ['', [Validators.required]],   // Separate date field
      end_date_time: ['', [Validators.required]],   // Separate time field
      description: ['']
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const startDate = new Date(this.appointmentForm.value.start_date_date);
      const [startHour, startMinute] = this.appointmentForm.value.start_date_time.split(':');
      startDate.setHours(startHour, startMinute);

      const endDate = new Date(this.appointmentForm.value.end_date_date);
      const [endHour, endMinute] = this.appointmentForm.value.end_date_time.split(':');
      endDate.setHours(endHour, endMinute);

      const appointment: Appointment = {
        id: new Date().toISOString(),
        title: this.appointmentForm.value.title,
        start_date: startDate,
        end_date: endDate,
        description: this.appointmentForm.value.description
      };

      this.store.dispatch(addAppointment({ appointment }));
      this.dialogRef.close();
    }
  }
}
