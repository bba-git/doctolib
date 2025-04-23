import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    this.logger.log('SupabaseService constructor called');
  }

  async onModuleInit() {
    this.logger.log('Starting Supabase initialization...');
    try {
      const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
      const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

      this.logger.log(`Supabase URL: ${supabaseUrl}`);
      this.logger.log(`Supabase Key: ${supabaseKey ? '***' + supabaseKey.slice(-4) : 'undefined'}`);

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials are not properly configured');
      }

      this.logger.log('Creating Supabase client...');
      this.client = createClient(supabaseUrl, supabaseKey);
      
      this.logger.log('Testing connection...');
      await this.testConnection();
      
      this.logger.log('Supabase initialization completed successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }

  private async testConnection() {
    try {
      const { error } = await this.client.from('users').select('count').single();
      if (error) throw error;
      this.logger.log('Connection test successful');
    } catch (error) {
      this.logger.error('Failed to connect to Supabase:', error);
      throw error;
    }
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized');
    }
    return this.client;
  }
} 