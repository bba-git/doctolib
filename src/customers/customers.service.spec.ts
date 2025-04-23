import { Test } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { BaseTest } from '../common/test/base-test';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CustomersService', () => {
  let service: CustomersService;
  let test: BaseTest;

  beforeEach(async () => {
    test = new BaseTest();
    await test.setupTest([CustomersService]);
    service = test.module.get<CustomersService>(CustomersService);
  });

  afterEach(async () => {
    await test.teardownTest();
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const mockCustomer = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      };

      test.supabaseService.from('customers').insert.mockResolvedValue({
        data: mockCustomer,
        error: null,
      });

      const result = await service.createCustomer({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      });

      expect(result).toEqual(mockCustomer);
      expect(test.supabaseService.from).toHaveBeenCalledWith('customers');
      expect(test.supabaseService.insert).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      });
    });

    it('should throw error when creation fails', async () => {
      test.supabaseService.from('customers').insert.mockResolvedValue({
        data: null,
        error: new Error('Creation failed'),
      });

      await expect(
        service.createCustomer({
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCustomerById', () => {
    it('should return customer by id', async () => {
      const mockCustomer = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      };

      test.supabaseService.from('customers').select.mockResolvedValue({
        data: mockCustomer,
        error: null,
      });

      const result = await service.getCustomerById('1');
      expect(result).toEqual(mockCustomer);
    });

    it('should throw error when customer not found', async () => {
      test.supabaseService.from('customers').select.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(service.getCustomerById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateCustomer', () => {
    it('should update customer', async () => {
      const mockCustomer = {
        id: '1',
        name: 'John Doe Updated',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      };

      test.supabaseService.from('customers').update.mockResolvedValue({
        data: mockCustomer,
        error: null,
      });

      const result = await service.updateCustomer('1', {
        name: 'John Doe Updated',
      });

      expect(result).toEqual(mockCustomer);
    });

    it('should throw error when update fails', async () => {
      test.supabaseService.from('customers').update.mockResolvedValue({
        data: null,
        error: new Error('Update failed'),
      });

      await expect(
        service.updateCustomer('1', { name: 'John Doe Updated' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
}); 