import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CeoAgenda } from 'ceo-agenda/entities/ceo-agenda.entity';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { formatDate } from 'helpers';
import { RedisService } from 'redis/redis.service';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsCorrectDateTimeValidator
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(CeoAgenda)
    private readonly ceoAgendaRepository: Repository<CeoAgenda>,
    private readonly redisService: RedisService,
  ) {}

  async validate(value: string, args: ValidationArguments) {
    const isFormatCorrect = new RegExp(
      /^(20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([01][0-9]|2[0-3]):([0-5][0-9])$/,
    ).test(value);

    if (!isFormatCorrect) {
      throw new BadRequestException(
        `${args.property} format is incorrect, it should be in format YYYY-MM-DD HH:MM`,
      );
    }

    const date = formatDate(value);
    const spot = await this.ceoAgendaRepository
      .createQueryBuilder('ceoAgenda')
      .where('DATE(ceoAgenda.startDateTime) = :date', {
        date,
      })
      .getOne();

    if (!spot) {
      throw new HttpException(
        `No agenda spot found for ${value}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const availableSpotTimes = await this.redisService.getAvailableSpots(date);
    const time = value.split(' ')?.[1];
    const timeSlotExists = availableSpotTimes?.includes(time);

    if (!timeSlotExists) {
      throw new HttpException(
        `No time slot found for ${time}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return true;
  }
}

export function IsCorrectDateTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCorrectDateTimeValidator,
    });
  };
}
