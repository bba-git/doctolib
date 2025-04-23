import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { SupabaseService } from '../common/services/supabase.service';
import { ProfessionalsService } from '../professionals/professionals.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let supabaseService: SupabaseService;
  let professionalsService: ProfessionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: SupabaseService,
          useValue: {
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
          },
        },
        {
          provide: ProfessionalsService,
          useValue: {
            getAvailability: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    professionalsService = module.get<ProfessionalsService>(ProfessionalsService);
  });

  describe('createAppointment', () => {
    it('should create an appointment when slot is available', async () => {
      const mockAppointment = {
        id: '1',
        professional_id: 'prof1',
        patient_id: 'pat1',
        start_time: '2024-04-24T09:00:00Z',
        end_time: '2024-04-24T09:30:00Z',
        status: 'scheduled',
      };

      const mockAvailability = {
        is_available: true,
      };

      (professionalsService.getAvailability as jest.Mock).mockResolvedValue(mockAvailability);
      (supabaseService.from('appointments').insert as jest.Mock).mockResolvedValue({
        data: mockAppointment,
      });

      const result = await service.createAppointment({
        professionalId: 'prof1',
        patientId: 'pat1',
        startTime: '2024-04-24T09:00:00Z',
        endTime: '2024-04-24T09:30:00Z',
      });

      expect(result).toEqual(mockAppointment);
      expect(professionalsService.getAvailability).toHaveBeenCalled();
      expect(supabaseService.from('appointments').insert).toHaveBeenCalled();
    });

    it('should throw error when slot is not available', async () => {
      const mockAvailability = {
        is_available: false,
      };

      (professionalsService.getAvailability as jest.Mock).mockResolvedValue(mockAvailability);

      await expect(
        service.createAppointment({
          professionalId: 'prof1',
          patientId: 'pat1',
          startTime: '2024-04-24T09:00:00Z',
          endTime: '2024-04-24T09:30:00Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAppointmentById', () => {
    it('should return appointment by id', async () => {
      const mockAppointment = {
        id: '1',
        professional_id: 'prof1',
        patient_id: 'pat1',
        start_time: '2024-04-24T09:00:00Z',
        end_time: '2024-04-24T09:30:00Z',
        status: 'scheduled',
      };

      (supabaseService.from('appointments').select as jest.Mock).mockResolvedValue({
        data: mockAppointment,
      });

      const result = await service.getAppointmentById('1');
      expect(result).toEqual(mockAppointment);
    });

    it('should throw error when appointment not found', async () => {
      (supabaseService.from('appointments').select as jest.Mock).mockResolvedValue({
        data: null,
      });

      await expect(service.getAppointmentById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAppointment', () => {
    it('should update appointment status', async () => {
      const mockAppointment = {
        id: '1',
        status: 'confirmed',
      };

      (supabaseService.from('appointments').update as jest.Mock).mockResolvedValue({
        data: mockAppointment,
      });

      const result = await service.updateAppointment('1', 'confirmed');
      expect(result).toEqual(mockAppointment);
    });

    it('should throw error when update fails', async () => {
      (supabaseService.from('appointments').update as jest.Mock).mockResolvedValue({
        error: new Error('Update failed'),
      });

      await expect(service.updateAppointment('1', 'confirmed')).rejects.toThrow('Update failed');
    });
  });
}); 