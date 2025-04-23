import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
}

@Injectable()
export class CustomersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createCustomer(data: CreateCustomerDto) {
    const { data: customer, error } = await this.supabaseService
      .getClient()
      .from('customers')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return customer;
  }

  async getCustomerById(id: string) {
    const { data: customer, error } = await this.supabaseService
      .getClient()
      .from('customers')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async updateCustomer(id: string, data: UpdateCustomerDto) {
    const { data: customer, error } = await this.supabaseService
      .getClient()
      .from('customers')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
} 