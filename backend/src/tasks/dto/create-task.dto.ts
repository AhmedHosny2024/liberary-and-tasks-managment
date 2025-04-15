import { IsString, IsInt, IsEnum, Min, Max, IsDate } from 'class-validator';
import { TaskStatus } from '../entity/tasks.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @ApiProperty({ description: 'Title of the task' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'Description of the task' })
  description: string;

  @IsDate()
  @ApiProperty({ description: 'Due date of the task' })
  dueDate: Date;

  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({ description: 'Priority of the task (1-5)' })
  priority: number;

  @IsEnum(TaskStatus)
  @ApiProperty({ enum: TaskStatus, description: 'Status of the task' })
  status: TaskStatus;
}
