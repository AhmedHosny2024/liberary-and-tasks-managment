import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoanDto {
  @IsInt()
  @Type(() => Number)
  user_id: number;

  @IsInt()
  @Type(() => Number)
  book_id: number;

  @IsOptional()
  returnDate?: Date;
}
