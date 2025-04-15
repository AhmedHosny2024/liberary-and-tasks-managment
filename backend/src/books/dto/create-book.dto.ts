import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @IsString()
  @ApiProperty({ example: 'The Great Gatsby' })
  title: string;

  @IsString()
  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  author: string;

  @IsDate()
  @ApiProperty({ example: '1925-04-10' })
  publishedDate: Date;
}
