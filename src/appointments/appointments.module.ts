import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { ProfessionalsModule } from '../professionals/professionals.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [ProfessionalsModule, CommonModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {} 