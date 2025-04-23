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
} 