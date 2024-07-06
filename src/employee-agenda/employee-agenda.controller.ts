import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { EmployeeAgendaService } from './employee-agenda.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'common/filters/http-exception.filter';
import { CreateEmployeeAgendaDto } from './dto/create-employee-agenda.dto';

@ApiTags('employee-agenda')
@UseFilters(HttpExceptionFilter)
@Controller('employee-agenda')
export class EmployeeAgendaController {
  constructor(private readonly employeeAgendaService: EmployeeAgendaService) {}

  @Post('book-slot')
  create(@Body() createEmployeeAgendaDto: CreateEmployeeAgendaDto) {
    return this.employeeAgendaService.create(createEmployeeAgendaDto);
  }

  @Get('slots')
  find() {
    return this.employeeAgendaService.find();
  }

  @Post('suggest-slot')
  suggestSlot(@Query('date') date: string) {
    return this.employeeAgendaService.suggestSlot(date);
  }
}
