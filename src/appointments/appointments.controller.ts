import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Body() data: {
    professionalId: string;
    patientId: string;
    startTime: string;
    endTime: string;
  }) {
    return this.appointmentsService.createAppointment(data);
  }

  @Get(':id')
  async getAppointment(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Put(':id')
  async updateAppointment(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.appointmentsService.updateAppointment(id, status);
  }
} 