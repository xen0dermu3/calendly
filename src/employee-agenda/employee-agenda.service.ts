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

@Injectable()
export class EmployeeAgendaService {
  private readonly logger = new Logger(EmployeeAgendaService.name);

  constructor(
    @InjectRepository(EmployeeAgenda)
    private readonly employedAgendaRepository: Repository<EmployeeAgenda>,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<Env>,
  ) {}

  async create(createEmployeeAgendaDto: CreateEmployeeAgendaDto) {
    try {
      const booked = await this.employedAgendaRepository.save(
        this.employedAgendaRepository.create(createEmployeeAgendaDto),
      );

      const date = formatDate(createEmployeeAgendaDto.startDateTime);
      const time = createEmployeeAgendaDto.startDateTime.split(' ')?.[1];
      const availableSpotTimes =
        (await this.redisService.getAvailableSpots(date))!;

      await this.redisService.setAvailableSpots(
        date,
        availableSpotTimes.filter((a) => a !== time),
      );

      this.sendNotificationCalendarEmail(createEmployeeAgendaDto);

      return booked;
    } catch (e) {
      if (e instanceof HttpException) {
        this.logger.error(e.message);

        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async find() {
    try {
      return await this.employedAgendaRepository.find();
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
