import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from '../services/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

interface MockSupabaseClient extends Partial<SupabaseClient> {
  from: jest.Mock;
  select: jest.Mock;
  single: jest.Mock;
}

describe('Database Connection', () => {
  let supabaseService: SupabaseService;
  let configService: jest.Mocked<ConfigService>;
  let mockClient: MockSupabaseClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        }
      ],
    }).compile();

    supabaseService = module.get<SupabaseService>(SupabaseService);
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;

    mockClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ count: 1 })
    } as MockSupabaseClient;

    // Set default mock values
    (configService.get as jest.Mock).mockImplementation((key: string) => {
      switch (key) {
        case 'SUPABASE_URL':
          return 'https://test.supabase.co';
        case 'SUPABASE_SERVICE_ROLE_KEY':
          return 'test-key';
        default:
          return null;
      }
    });
  });

  it('should initialize Supabase client with correct configuration', async () => {
    await supabaseService.onModuleInit();
    
    expect(configService.get).toHaveBeenCalledWith('SUPABASE_URL');
    expect(configService.get).toHaveBeenCalledWith('SUPABASE_SERVICE_ROLE_KEY');
  });

  it('should throw error when credentials are missing', async () => {
    (configService.get as jest.Mock).mockReturnValue(undefined);
    
    await expect(supabaseService.onModuleInit()).rejects.toThrow('Supabase credentials are not properly configured');
  });

  it('should successfully test connection', async () => {
    (supabaseService as any).client = mockClient;

    await (supabaseService as any).testConnection();
    
    expect(mockClient.from).toHaveBeenCalledWith('users');
    expect(mockClient.select).toHaveBeenCalledWith('count');
    expect(mockClient.single).toHaveBeenCalled();
  });

  it('should handle connection test failures', async () => {
    mockClient.single.mockRejectedValue(new Error('Connection failed'));
    (supabaseService as any).client = mockClient;
    
    await expect((supabaseService as any).testConnection()).rejects.toThrow('Connection failed');
  });

  it('should maintain single client instance', async () => {
    await supabaseService.onModuleInit();
    const firstClient = (supabaseService as any).client;
    
    await supabaseService.onModuleInit();
    const secondClient = (supabaseService as any).client;
    
    expect(firstClient).toBe(secondClient);
  });
}); 