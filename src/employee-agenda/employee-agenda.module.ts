import { Module } from '@nestjs/common';
import { EmployeeAgendaController } from './employee-agenda.controller';
import { EmployeeAgendaService } from './employee-agenda.service';
import { IsCorrectDateTimeValidator } from './validators/is-correct-date-time.validator';
import { CeoAgenda } from 'ceo-agenda/entities/ceo-agenda.entity';
import { EmployeeAgenda } from './entities/employee-agenda.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([CeoAgenda, EmployeeAgenda]), RedisModule],
  controllers: [EmployeeAgendaController],
  providers: [EmployeeAgendaService, IsCorrectDateTimeValidator],
})
export class EmployeeAgendaModule {}
