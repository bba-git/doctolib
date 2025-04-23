import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ProfessionalsService, CreateProfessionalDto, UpdateProfessionalDto } from './professionals.service';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  async createProfessional(@Body() data: CreateProfessionalDto) {
    return this.professionalsService.createProfessional(data);
  }

  @Get(':id')
  async getProfessional(@Param('id') id: string) {
    return this.professionalsService.getProfessionalById(id);
  }

  @Put(':id')
  async updateProfessional(
    @Param('id') id: string,
    @Body() data: UpdateProfessionalDto,
  ) {
    return this.professionalsService.updateProfessional(id, data);
  }
} 