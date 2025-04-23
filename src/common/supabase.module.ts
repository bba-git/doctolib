import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './services/supabase.service';
import { SupabaseTestController } from './controllers/supabase-test.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [SupabaseTestController],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {} 