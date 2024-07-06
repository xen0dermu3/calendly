import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstToUpperCase, formatDate } from 'helpers';
import { RedisService } from 'redis/redis.service';
import { Repository } from 'typeorm';
import { CreateEmployeeAgendaDto } from './dto/create-employee-agenda.dto';
import { EmployeeAgenda } from './entities/employee-agenda.entity';
import { EmailService } from 'email/email.service';
import { ConfigService } from '@nestjs/config';
import { Env } from 'env';
import { CeoAgenda } from 'ceo-agenda/entities/ceo-agenda.entity';

@Injectable()
export class EmployeeAgendaService {
  private readonly logger = new Logger(EmployeeAgendaService.name);

  constructor(
    @InjectRepository(EmployeeAgenda)
    private readonly employeeAgendaRepository: Repository<EmployeeAgenda>,
    @InjectRepository(CeoAgenda)
    private readonly ceoAgendaRepository: Repository<CeoAgenda>,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<Env>,
  ) {}

  async create(createEmployeeAgendaDto: CreateEmployeeAgendaDto) {
    try {
      const bookedSlot = await this.employeeAgendaRepository.save(
        this.employeeAgendaRepository.create(createEmployeeAgendaDto),
      );

      const date = formatDate(createEmployeeAgendaDto.startDateTime);
      const time = createEmployeeAgendaDto.startDateTime.split(' ')?.[1];
      const availableSpotTimes =
        (await this.redisService.getAvailableSpots(date))!;

      const newAvailableSpotTimes = availableSpotTimes.filter(
        (a) => a !== time,
      );
      const allSlotsBooked = newAvailableSpotTimes.length === 0;

      if (allSlotsBooked) {
        await this.ceoAgendaRepository
          .createQueryBuilder('ceoAgenda')
          .delete()
          .where('DATE(startDateTime) = :date', { date })
          .execute();

        await this.redisService.removeAvailableSpots(date);
      } else {
        await this.redisService.setAvailableSpots(date, newAvailableSpotTimes);
      }

      this.sendNotificationCalendarEmail(createEmployeeAgendaDto);

      return bookedSlot;
    } catch (e) {
      if (e instanceof HttpException) {
        this.logger.error(e.message);

        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async find() {
    try {
      return await this.employeeAgendaRepository.find();
    } catch (e) {
      if (e instanceof HttpException) {
        this.logger.error(e.message);

        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async suggestSlot(date: string) {
    try {
      let spot = await this.ceoAgendaRepository
        .createQueryBuilder('ceoAgenda')
        .where('DATE(ceoAgenda.startDateTime) = :date', { date })
        .getOne();

      if (spot) {
        const availableSpotTimes =
          (await this.redisService.getAvailableSpots(date))!;

        return {
          date,
          time: availableSpotTimes[0],
        };
      }

      spot = (await this.ceoAgendaRepository
        .createQueryBuilder('ceoAgenda')
        .orderBy(
          'ABS(EXTRACT(EPOCH FROM ceoAgenda.startDateTime - DATE(:date)))',
        )
        .setParameter('date', date)
        .limit(1)
        .getOne())!;

      date = formatDate(spot.startDateTime);

      const availableSpotTimes =
        (await this.redisService.getAvailableSpots(date))!;

      return {
        date,
        time: availableSpotTimes[0],
      };
    } catch (e) {
      if (e instanceof HttpException) {
        this.logger.error(e.message);

        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private sendNotificationCalendarEmail(
    createEmployeeAgendaDto: CreateEmployeeAgendaDto,
  ) {
    const [name, email] = this.configService
      .get<string>('EMAIL_FROM')!
      .split('-');

    const employeeName = firstToUpperCase(
      createEmployeeAgendaDto.email.split('.')?.[0] ?? '',
    );

    this.emailService.sendEmailWithEvent(
      {
        to: createEmployeeAgendaDto.email,
        subject: 'Calendly Reminder',
        text: `Hi, John. User ${createEmployeeAgendaDto.email} booked an appointment on ${createEmployeeAgendaDto.startDateTime}. Be sure not to miss it!`,
      },
      {
        name: 'Calendly',
        start: new Date(createEmployeeAgendaDto.startDateTime),
        end: new Date(),
        summary: 'One-to-One',
        description: 'One-to-One sessions with employee',
        location: 'Google Meet',
        url: 'https://meet.google.com/tcy-xwcf-vyr',
        organizer: {
          name,
          email,
        },
        attendees: [
          { name: employeeName, email: createEmployeeAgendaDto.email },
        ],
      },
    );
  }
}
