import { Test } from '@nestjs/testing';
import { ProfessionalsService } from './professionals.service';
import { BaseTest } from '../common/test/base-test';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProfessionalsService', () => {
  let service: ProfessionalsService;
  let test: BaseTest;

  beforeEach(async () => {
    test = new BaseTest();
    await test.setupTest([ProfessionalsService]);
    service = test.module.get<ProfessionalsService>(ProfessionalsService);
  });

  afterEach(async () => {
    await test.teardownTest();
  });

  describe('createProfessional', () => {
    it('should create a professional', async () => {
      const mockProfessional = {
        id: '1',
        name: 'Dr. John Doe',
        specialty: 'Cardiology',
        email: 'john.doe@example.com',
      };

      test.supabaseService.from('professionals').insert.mockResolvedValue({
        data: mockProfessional,
        error: null,
      });

      const result = await service.createProfessional({
        name: 'Dr. John Doe',
        specialty: 'Cardiology',
        email: 'john.doe@example.com',
      });

      expect(result).toEqual(mockProfessional);
      expect(test.supabaseService.from).toHaveBeenCalledWith('professionals');
      expect(test.supabaseService.insert).toHaveBeenCalledWith({
        name: 'Dr. John Doe',
        specialty: 'Cardiology',
        email: 'john.doe@example.com',
      });
    });

    it('should throw error when creation fails', async () => {
      test.supabaseService.from('professionals').insert.mockResolvedValue({
        data: null,
        error: new Error('Creation failed'),
      });

      await expect(
        service.createProfessional({
          name: 'Dr. John Doe',
          specialty: 'Cardiology',
          email: 'john.doe@example.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProfessionalById', () => {
    it('should return professional by id', async () => {
      const mockProfessional = {
        id: '1',
        name: 'Dr. John Doe',
        specialty: 'Cardiology',
        email: 'john.doe@example.com',
      };

      test.supabaseService.from('professionals').select.mockResolvedValue({
        data: mockProfessional,
        error: null,
      });

      const result = await service.getProfessionalById('1');
      expect(result).toEqual(mockProfessional);
    });

    it('should throw error when professional not found', async () => {
      test.supabaseService.from('professionals').select.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(service.getProfessionalById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfessional', () => {
    it('should update professional', async () => {
      const mockProfessional = {
        id: '1',
        name: 'Dr. John Doe Updated',
        specialty: 'Cardiology',
        email: 'john.doe@example.com',
      };

      test.supabaseService.from('professionals').update.mockResolvedValue({
        data: mockProfessional,
        error: null,
      });

      const result = await service.updateProfessional('1', {
        name: 'Dr. John Doe Updated',
      });

      expect(result).toEqual(mockProfessional);
    });

    it('should throw error when update fails', async () => {
      test.supabaseService.from('professionals').update.mockResolvedValue({
        data: null,
        error: new Error('Update failed'),
      });

      await expect(
        service.updateProfessional('1', { name: 'Dr. John Doe Updated' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
}); 