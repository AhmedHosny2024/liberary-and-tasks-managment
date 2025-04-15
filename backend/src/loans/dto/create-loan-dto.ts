import { IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  user_id: number;

  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  book_id: number;

  @IsDate()
  @Type(() => Date)
  returnDate?: Date;
}
