import { Test, TestingModule } from '@nestjs/testing';
import { createMockSupabaseService, createMockConfigService } from './test-utils';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../services/supabase.service';

export class BaseTest {
  public module!: TestingModule;
  public supabaseService: any;
  public configService: any;

  async setupTest(providers: any[]) {
    const mockSupabaseService = createMockSupabaseService();
    const mockConfigService = createMockConfigService();

    this.module = await Test.createTestingModule({
      providers: [
        ...providers,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    this.supabaseService = this.module.get(SupabaseService);
    this.configService = this.module.get(ConfigService);
  }

  async teardownTest() {
    if (this.module) {
      await this.module.close();
    }
  }
} 