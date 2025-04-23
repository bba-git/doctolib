import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { AppointmentsService, CreateAppointmentDto, UpdateAppointmentDto } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Body() data: CreateAppointmentDto): Promise<any> {
    return this.appointmentsService.createAppointment(data);
  }

  @Get(':id')
  async getAppointment(@Param('id') id: string): Promise<any> {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Put(':id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() data: UpdateAppointmentDto,
  ): Promise<any> {
    return this.appointmentsService.updateAppointment(id, data);
  }

  @Get('professional/:professionalId')
  async getProfessionalAppointments(@Param('professionalId') professionalId: string): Promise<any> {
    return this.appointmentsService.getAppointmentsByProfessional(professionalId);
  }

  @Get('patient/:patientId')
  async getPatientAppointments(@Param('patientId') patientId: string): Promise<any> {
    return this.appointmentsService.getAppointmentsByPatient(patientId);
  }
} 