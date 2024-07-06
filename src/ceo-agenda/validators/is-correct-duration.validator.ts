import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsCorrectDurationValidator
  implements ValidatorConstraintInterface
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: string, args: ValidationArguments) {
    return new RegExp(/^([1-9]|[1-5][0-9]|60)\sm$/).test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} format is incorrect, it should be in format 1-60 m`;
  }
}

export function IsCorrectDuration(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCorrectDurationValidator,
    });
  };
}
