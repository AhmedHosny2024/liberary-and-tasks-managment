import { IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoanDto {
  @IsInt()
  @Type(() => Number)
  user_id: number;

  @IsInt()
  @Type(() => Number)
  book_id: number;

  @IsDate()
  returnDate?: Date;
}
