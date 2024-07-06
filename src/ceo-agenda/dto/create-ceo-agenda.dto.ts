import { ApiProperty } from '@nestjs/swagger';
import { IsCorrectDateTime } from 'ceo-agenda/validators/is-correct-date-time.validator';
import { IsCorrectDuration } from 'ceo-agenda/validators/is-correct-duration.validator';
import { IsUniqueDate } from 'ceo-agenda/validators/is-unique-date.validator';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateCeoAgendaDto {
  @ApiProperty({
    example: '2024-07-05 12:00',
  })
  @IsNotEmpty()
  @IsDateString()
  @IsCorrectDateTime()
  @IsUniqueDate()
  startDateTime!: string;

  @ApiProperty({
    example: '2024-07-05 14:00',
  })
  @IsNotEmpty()
  @IsDateString()
  @IsCorrectDateTime()
  @IsUniqueDate()
  endDateTime!: string;

  @ApiProperty({
    example: '15 m',
  })
  @IsNotEmpty()
  @IsString()
  @IsCorrectDuration()
  duration!: string;
}
