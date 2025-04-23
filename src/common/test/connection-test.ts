import { SupabaseService } from '../services/supabase.service';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import { config } from 'dotenv';

// Load environment variables
console.log('🔍 Loading environment variables...');
config();

async function testConnection() {
  try {
    console.log('\n🚀 Starting Supabase connection test...');
    console.log('📝 Environment variables check:');
    console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Present' : '❌ Missing'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Present' : '❌ Missing'}`);
    console.log(`   SUPABASE_KEY: ${process.env.SUPABASE_KEY ? '✅ Present' : '❌ Missing'}`);

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('\n❌ Error: Missing required environment variables');
      process.exit(1);
    }

    console.log('\n🛠️ Setting up testing module...');
    const module = await Test.createTestingModule({
      providers: [
        SupabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              console.log(`   🔑 Getting config value for: ${key}`);
              return process.env[key];
            }
          }
        }
      ],
    }).compile();

    console.log('\n🔌 Initializing Supabase service...');
    const supabaseService = module.get<SupabaseService>(SupabaseService);
    await supabaseService.onModuleInit();
    console.log('✅ Supabase service initialized');

    // First, check if the users table exists
    console.log('\n📋 Checking if users table exists...');
    const { data: tableInfo, error: tableError } = await supabaseService.getClient()
      .from('users')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('\n❌ Error checking users table:', tableError);
      console.error('   Error details:', {
        message: tableError.message,
        code: tableError.code,
        details: tableError.details,
        hint: tableError.hint
      });
      process.exit(1);
    }

    console.log('✅ Users table exists and is accessible');

    // Test a simple query
    console.log('\n🔍 Testing count query...');
    const { data, error } = await supabaseService.getClient()
      .from('users')
      .select('count')
      .single();

    if (error) {
      console.error('\n❌ Connection test failed:', error);
      console.error('   Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      process.exit(1);
    }

    console.log('\n🎉 Connection test successful!');
    console.log('📊 Users count:', data);
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Unexpected error during connection test:');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

console.log('Starting test...');
testConnection(); 