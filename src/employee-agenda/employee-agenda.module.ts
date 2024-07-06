import { Module } from '@nestjs/common';
import { EmployeeAgendaController } from './employee-agenda.controller';
import { EmployeeAgendaService } from './employee-agenda.service';
import { IsCorrectDateTimeValidator } from './validators/is-correct-date-time.validator';
import { CeoAgenda } from 'ceo-agenda/entities/ceo-agenda.entity';
import { EmployeeAgenda } from './entities/employee-agenda.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'redis/redis.module';
import { EmployeeAgendaCron } from './cron/employee-agenda.cron';
import { EmailModule } from 'email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CeoAgenda, EmployeeAgenda]),
    RedisModule,
    EmailModule,
  ],
  controllers: [EmployeeAgendaController],
  providers: [
    EmployeeAgendaService,
    IsCorrectDateTimeValidator,
    EmployeeAgendaCron,
  ],
})
export class EmployeeAgendaModule {}
