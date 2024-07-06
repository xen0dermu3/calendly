import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeAgendaDto } from './create-employee-agenda.dto';

export class UpdateCeoAgendaDto extends PartialType(CreateEmployeeAgendaDto) {}
