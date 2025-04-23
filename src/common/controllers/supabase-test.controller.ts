import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';

@Controller('supabase-test')
export class SupabaseTestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('connection')
  async testConnection() {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('users').select('count').single();
      
      if (error) {
        return {
          status: 'error',
          message: 'Failed to connect to Supabase',
          error: error.message
        };
      }

      return {
        status: 'success',
        message: 'Successfully connected to Supabase',
        data: data
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error testing Supabase connection',
        error: error.message
      };
    }
  }
} 