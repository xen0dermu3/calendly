import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeAgenda } from 'employee-agenda/entities/employee-agenda.entity';
import { formatDate } from 'helpers';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeAgendaCron {
  private readonly logger = new Logger(EmployeeAgendaCron.name);

  constructor(
    @InjectRepository(EmployeeAgenda)
    private readonly employeeAgendaRepository: Repository<EmployeeAgenda>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    try {
      const today = formatDate(new Date());

      await this.employeeAgendaRepository
        .createQueryBuilder('employeeAgenda')
        .where('DATE(ceoAgenda.startDateTime) < :date', { date: today })
        .delete()
        .execute();
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message);
      }
    }
  }
}
