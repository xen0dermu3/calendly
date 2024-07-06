import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCeoAgendaDto } from 'ceo-agenda/dto/create-ceo-agenda.dto';
import { addMinutes, compareAsc, isBefore, isEqual } from 'date-fns';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsCorrectDateTimeValidator
  implements ValidatorConstraintInterface
{
  async validate(value: string, args: ValidationArguments) {
    const isFormatCorrect = new RegExp(
      /^(20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([01][0-9]|2[0-3]):([0-5][0-9])$/,
    ).test(value);

    if (!isFormatCorrect) {
      throw new BadRequestException(
        `${args.property} format is incorrect, it should be in format YYYY-MM-DD HH:MM`,
      );
    }

    const startDateTime = new Date(
      (args.object as CreateCeoAgendaDto)['startDateTime'],
    );
    const endDateTime = new Date(
      (args.object as CreateCeoAgendaDto)['endDateTime'],
    );

    const now = new Date();

    if (isBefore(startDateTime, now)) {
      throw new BadRequestException(
        `startDateTime can not be less than now: ${now}`,
      );
    }

    if (isBefore(endDateTime, now)) {
      throw new BadRequestException(
        'endDateTime can not be less than now: ${now}',
      );
    }

    if (isEqual(startDateTime, endDateTime)) {
      throw new BadRequestException(
        "startDateTime and endDateTime can't be equal",
      );
    }

    const duration = (args.object as CreateCeoAgendaDto)['duration'].split(
      ' ',
    )?.[0];

    const slotFinishDateTime = addMinutes(startDateTime, +duration);

    if (compareAsc(endDateTime, slotFinishDateTime) < 0) {
      throw new BadRequestException(
        "endDateTime can't be less than startDateTime + duration",
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
