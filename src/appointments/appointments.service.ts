import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';
import { ProfessionalsService } from '../professionals/professionals.service';

export type AppointmentType = 'visio' | 'in_person';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

export interface CreateAppointmentDto {
  professionalId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  type: AppointmentType;
}

export interface UpdateAppointmentDto {
  status?: AppointmentStatus;
  startTime?: string;
  endTime?: string;
  type?: AppointmentType;
}

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly professionalsService: ProfessionalsService,
  ) {}

  async createAppointment(data: CreateAppointmentDto) {
    const { professionalId, patientId, startTime, endTime, type } = data;

    // Validate appointment type
    if (!['visio', 'in_person'].includes(type)) {
      throw new BadRequestException('Invalid appointment type');
    }

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
      .getClient()
      .from('appointments')
      .insert({
        professional_id: professionalId,
        patient_id: patientId,
        start_time: startTime,
        end_time: endTime,
        type: type,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return appointment;
  }

  async getAppointmentById(id: string) {
    const { data: appointment, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select(`
        *,
        professionals:professional_id (*),
        patients:patient_id (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async updateAppointment(id: string, data: UpdateAppointmentDto) {
    // Validate status if provided
    if (data.status && !['scheduled', 'confirmed', 'cancelled', 'completed'].includes(data.status)) {
      throw new BadRequestException('Invalid appointment status');
    }

    // Validate type if provided
    if (data.type && !['visio', 'in_person'].includes(data.type)) {
      throw new BadRequestException('Invalid appointment type');
    }

    const { data: appointment, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .update(data)
      .eq('id', id)
      .select(`
        *,
        professionals:professional_id (*),
        patients:patient_id (*)
      `)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async getAppointmentsByProfessional(professionalId: string) {
    const { data: appointments, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select(`
        *,
        patients:patient_id (*)
      `)
      .eq('professional_id', professionalId)
      .order('start_time', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return appointments;
  }

  async getAppointmentsByPatient(patientId: string) {
    const { data: appointments, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select(`
        *,
        professionals:professional_id (*)
      `)
      .eq('patient_id', patientId)
      .order('start_time', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return appointments;
  }
} 