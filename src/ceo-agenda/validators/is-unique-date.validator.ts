import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CeoAgenda } from 'ceo-agenda/entities/ceo-agenda.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate } from 'helpers';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueDateValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(CeoAgenda)
    private readonly ceoAgendaRepository: Repository<CeoAgenda>,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: string, args: ValidationArguments) {
    const spot = await this.ceoAgendaRepository
      .createQueryBuilder('ceoAgenda')
      .where('DATE(ceoAgenda.startDateTime) = :date', {
        date: formatDate(value),
      })
      .getOne();

    if (spot) {
      throw new HttpException(
        `${args.property} must be unique`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return true;
  }
}

export function IsUniqueDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueDateValidator,
    });
  };
}
