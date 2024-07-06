import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { IsCorrectDateTime } from 'employee-agenda/validators/is-correct-date-time.validator';

export class CreateEmployeeAgendaDto {
  @ApiProperty({
    example: '2024-07-05 12:00',
  })
  @IsNotEmpty()
  @IsDateString()
  @IsCorrectDateTime()
  startDateTime!: string;

  @ApiProperty({
    example: 'john.doe@mail.com',
  })
  @IsNotEmpty()
  @IsString()
  email!: string;
}
