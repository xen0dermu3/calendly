import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CeoAgenda } from './entities/ceo-agenda.entity';
import { CeoAgendaController } from './ceo-agenda.controller';
import { CeoAgendaService } from './ceo-agenda.service';
import { IsCorrectDurationValidator } from './validators/is-correct-duration.validator';
import { IsCorrectDateTimeValidator } from './validators/is-correct-date-time.validator';
import { IsUniqueDateValidator } from './validators/is-unique-date.validator';
import { CeoAgendaCron } from './cron/ceo-agenda.cron';
import { RedisModule } from 'redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([CeoAgenda]), RedisModule],
  controllers: [CeoAgendaController],
  providers: [
    CeoAgendaService,
    IsCorrectDurationValidator,
    IsCorrectDateTimeValidator,
    IsUniqueDateValidator,
    CeoAgendaCron,
  ],
})
export class CeoAgendaModule {}
