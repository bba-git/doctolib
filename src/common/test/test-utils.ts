import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from '../../common/services/supabase.service';
import { ConfigService } from '@nestjs/config';

export const createMockSupabaseService = () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
});

export const createMockConfigService = () => ({
  get: jest.fn().mockImplementation((key: string) => {
    switch (key) {
      case 'SUPABASE_URL':
        return 'https://test.supabase.co';
      case 'SUPABASE_SERVICE_ROLE_KEY':
        return 'test-key';
      case 'JWT_SECRET':
        return 'test-secret';
      default:
        return null;
    }
  }),
});

export const createTestingModule = async (providers: any[]) => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ...providers,
      {
        provide: SupabaseService,
        useValue: createMockSupabaseService(),
      },
      {
        provide: ConfigService,
        useValue: createMockConfigService(),
      },
    ],
  }).compile();

  return module;
}; 