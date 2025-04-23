import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupabaseService } from '../../common/services/supabase.service';

@Controller('test')
export class TestController {
  constructor(private supabaseService: SupabaseService) {}

  @Get('connection')
  async testConnection() {
    try {
      // First, let's just try to get the client
      const client = this.supabaseService.getClient();
      
      // Then try a simple query
      const { data, error } = await client
        .from('users')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Supabase Error:', error);
        return {
          status: 'error',
          message: 'Failed to query Supabase',
          error: {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          },
        };
      }

      return {
        status: 'success',
        message: 'Successfully connected to Supabase',
        data: data || [],
      };
    } catch (error) {
      console.error('General Error:', error);
      return {
        status: 'error',
        message: 'Failed to connect to Supabase',
        error: {
          message: error.message,
          stack: error.stack,
        },
      };
    }
  }

  @Post('create-test-user')
  async createTestUser(@Body() userData: { email: string; password: string }) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      return {
        status: 'success',
        message: 'Test user created successfully',
        user: data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to create test user',
        error: error.message,
      };
    }
  }
} 