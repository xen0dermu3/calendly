import { PartialType } from '@nestjs/mapped-types';
import { CreateCeoAgendaDto } from './create-ceo-agenda.dto';

export class UpdateCeoAgendaDto extends PartialType(CreateCeoAgendaDto) {}
