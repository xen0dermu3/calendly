import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate } from 'helpers';
import { RedisService } from 'redis/redis.service';
import { Repository } from 'typeorm';
import { CreateEmployeeAgendaDto } from './dto/create-employee-agenda.dto';
import { EmployeeAgenda } from './entities/employee-agenda.entity';

@Injectable()
export class EmployeeAgendaService {
  private readonly logger = new Logger(EmployeeAgendaService.name);

  constructor(
    @InjectRepository(EmployeeAgenda)
    private readonly employedAgendaRepository: Repository<EmployeeAgenda>,
    private readonly redisService: RedisService,
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
}
