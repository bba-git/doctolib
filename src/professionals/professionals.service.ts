import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';

export interface CreateProfessionalDto {
  name: string;
  specialty: string;
  email: string;
}

export interface UpdateProfessionalDto {
  name?: string;
  specialty?: string;
  email?: string;
}

export interface AvailabilityCheck {
  is_available: boolean;
  reason?: string;
}

@Injectable()
export class ProfessionalsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createProfessional(data: CreateProfessionalDto) {
    const { data: professional, error } = await this.supabaseService
      .getClient()
      .from('professionals')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return professional;
  }

  async getProfessionalById(id: string) {
    const { data: professional, error } = await this.supabaseService
      .getClient()
      .from('professionals')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    return professional;
  }

  async updateProfessional(id: string, data: UpdateProfessionalDto) {
    const { data: professional, error } = await this.supabaseService
      .getClient()
      .from('professionals')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    return professional;
  }

  async getAvailability(professionalId: string, startTime: string, endTime: string): Promise<AvailabilityCheck> {
    // Check if the professional exists
    await this.getProfessionalById(professionalId);

    // Check for overlapping appointments
    const { data: overlappingAppointments, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select('id')
      .eq('professional_id', professionalId)
      .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
      .neq('status', 'cancelled');

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (overlappingAppointments && overlappingAppointments.length > 0) {
      return {
        is_available: false,
        reason: 'Time slot overlaps with existing appointment'
      };
    }

    return { is_available: true };
  }
} 