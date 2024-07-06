import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { CeoAgendaService } from './ceo-agenda.service';
import { CreateCeoAgendaDto } from './dto/create-ceo-agenda.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@ApiTags('ceo-agenda')
@UseFilters(HttpExceptionFilter)
@Controller('ceo-agenda')
export class CeoAgendaController {
  constructor(private readonly ceoAgendaService: CeoAgendaService) {}

  @Post('add-slot')
  create(@Body() createCeoAgendaDto: CreateCeoAgendaDto) {
    return this.ceoAgendaService.create(createCeoAgendaDto);
  }

  @Get('spots')
  find() {
    return this.ceoAgendaService.find();
  }

  @Get('available-slots')
  findAvailableSlots(@Query('date') date: string) {
    return this.ceoAgendaService.findAvailableSlots(date);
  }
}
