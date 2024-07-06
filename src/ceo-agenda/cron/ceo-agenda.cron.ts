import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CeoAgenda } from 'ceo-agenda/entities/ceo-agenda.entity';
import { subDays } from 'date-fns';
import { formatDate } from 'helpers';
import { RedisService } from 'redis/redis.service';
import { Repository } from 'typeorm';

@Injectable()
export class CeoAgendaCron {
  private readonly logger = new Logger(CeoAgendaCron.name);

  constructor(
    @InjectRepository(CeoAgenda)
    private readonly ceoAgendaRepository: Repository<CeoAgenda>,
    private readonly redisService: RedisService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    try {
      const today = formatDate(new Date());

      await this.ceoAgendaRepository
        .createQueryBuilder('ceoAgenda')
        .where('DATE(ceoAgenda.startDateTime) < :date', { date: today })
        .delete()
        .execute();

      const yesterday = formatDate(subDays(today, 1));

      await this.redisService.removeAvailableSpots(yesterday);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message);
      }
    }
  }
}
