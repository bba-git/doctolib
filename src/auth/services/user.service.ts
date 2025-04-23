import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/services/supabase.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  async findByEmail(email: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error finding user:', error);
      return null;
    }

    return data;
  }

  async create(userData: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert([{ ...userData, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  }

  async validatePassword(user: any, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
} 