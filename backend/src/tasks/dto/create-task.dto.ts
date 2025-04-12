import { IsString, IsInt, IsEnum, Min, Max, IsDate } from 'class-validator';
import { TaskStatus } from '../entity/tasks.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  dueDate: Date;

  @IsInt()
  @Min(1)
  @Max(5)
  priority: number;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
