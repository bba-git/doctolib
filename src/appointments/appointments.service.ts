import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';
import { ProfessionalsService } from '../professionals/professionals.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly professionalsService: ProfessionalsService,
  ) {}

  async createAppointment(data: {
    professionalId: string;
    patientId: string;
    startTime: string;
    endTime: string;
  }) {
    const { professionalId, patientId, startTime, endTime } = data;

    // Check if the time slot is available
    const availability = await this.professionalsService.getAvailability(
      professionalId,
      startTime,
      endTime,
    );

    if (!availability.is_available) {
      throw new BadRequestException('Time slot is not available');
    }

    // Create the appointment
    const { data: appointment, error } = await this.supabaseService
      .from('appointments')
      .insert({
        professional_id: professionalId,
        patient_id: patientId,
        start_time: startTime,
        end_time: endTime,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return appointment;
  }

  async getAppointmentById(id: string) {
    const { data: appointment, error } = await this.supabaseService
      .from('appointments')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async updateAppointment(id: string, status: string) {
    const { data: appointment, error } = await this.supabaseService
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return appointment;
  }
} 