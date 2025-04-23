import { Test, TestingModule } from '@nestjs/testing';
import { createMockSupabaseService, createMockConfigService } from './test-utils';

export class BaseTest {
  public module!: TestingModule;
  public supabaseService: any;
  public configService: any;

  async setupTest(providers: any[]) {
    this.module = await Test.createTestingModule({
      providers: [
        ...providers,
        {
          provide: 'SupabaseService',
          useValue: createMockSupabaseService(),
        },
        {
          provide: 'ConfigService',
          useValue: createMockConfigService(),
        },
      ],
    }).compile();

    this.supabaseService = this.module.get('SupabaseService');
    this.configService = this.module.get('ConfigService');
  }

  async teardownTest() {
    if (this.module) {
      await this.module.close();
    }
  }
} 