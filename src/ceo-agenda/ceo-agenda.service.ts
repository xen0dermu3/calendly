import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes, compareAsc, getHours, getMinutes } from 'date-fns';
import { formatDate } from 'helpers';
import { RedisService } from 'redis/redis.service';
import { Repository } from 'typeorm';
import { CreateCeoAgendaDto } from './dto/create-ceo-agenda.dto';
import { CeoAgenda } from './entities/ceo-agenda.entity';

@Injectable()
export class CeoAgendaService {
  private readonly logger = new Logger(CeoAgendaService.name);

  constructor(
    @InjectRepository(CeoAgenda)
    private readonly ceoAgendaRepository: Repository<CeoAgenda>,
    private readonly redisService: RedisService,
  ) {}

  async create(createCeoAgendaDto: CreateCeoAgendaDto) {
    try {
      const spot = await this.ceoAgendaRepository.save(
        this.ceoAgendaRepository.create(createCeoAgendaDto),
      );

      const availableSpotTimes = this.generateAvailableSpots(spot);

      await this.redisService.setAvailableSpots(
        formatDate(spot.startDateTime),
        availableSpotTimes,
      );

      return spot;
    } catch (e) {
      if (e instanceof HttpException) {
        this.logger.error(e.message);

        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async find() {
    try {
      return await this.ceoAgendaRepository.find();
    } catch (e) {
      if (e instanceof HttpException) {
        this.logger.error(e.message);

        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findAvailableSlots(date: string) {
    try {
      const spot = await this.ceoAgendaRepository
        .createQueryBuilder('ceoAgenda')
        .where('DATE(ceoAgenda.startDateTime) = :date', { date })
        .getOne();

      if (!spot) {
        throw new HttpException(
          `No agenda spot found for ${date}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const availableSpotTimes =
        await this.redisService.getAvailableSpots(date);

      if (!availableSpotTimes) {
        throw new HttpException(
          `No available slots found for ${date}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return availableSpotTimes;
    } catch (e) {
      if (e instanceof HttpException) {
        this.logger.error(e.message);

        throw new HttpException(e.message, e.getStatus());
      }
    }
  }

  private generateAvailableSpots(spot: CeoAgenda) {
    const availableSpotTimes = [];

    let startDateTime = new Date(spot.startDateTime);
    const endDateTime = new Date(spot.endDateTime);
    const duration = +spot.duration.split(' ')[0];

    while (compareAsc(startDateTime, endDateTime) < 0) {
      availableSpotTimes.push(
        `${(getHours(startDateTime) < 10 ? '0' : '') + getHours(startDateTime)}:${(getMinutes(startDateTime) < 10 ? '0' : '') + getMinutes(startDateTime)}`,
      );

      startDateTime = addMinutes(startDateTime, duration);
    }

    return availableSpotTimes;
  }
}
