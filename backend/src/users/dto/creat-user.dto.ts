import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'jone@gmail.com' })
  email: string;
}
