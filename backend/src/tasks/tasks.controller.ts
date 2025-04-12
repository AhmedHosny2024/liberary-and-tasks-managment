import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/tasks.entity';
import { TotalTasksDto } from './dto/total-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const res = await this.tasksService.createTask(createTaskDto);
      return res;
    } catch (error) {
      throw new BadRequestException('Error creating task');
    }
  }

  @Get()
  async getTasks(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: string,
  ): Promise<TotalTasksDto> {
    try {
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const finalPage = pageNumber > 0 ? pageNumber : 1;
      const finalLimit = limitNumber > 0 ? limitNumber : 10;
      if (status && !['todo', 'completed'].includes(status)) {
        throw new BadRequestException('Invalid status');
      }
      const res = await this.tasksService.getTasks(
        finalPage,
        finalLimit,
        status,
      );
      return res;
    } catch (error) {
      throw new BadRequestException('Error fetching tasks');
    }
  }

  @Patch(':id/complete')
  async markTaskAsComplete(@Param('id') id: number): Promise<Task> {
    try {
      const res = await this.tasksService.markTaskAsComplete(id);
      return res;
    } catch (error) {
      throw new BadRequestException('Error marking task as complete');
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<void> {
    try {
      await this.tasksService.deleteTask(id);
    } catch (error) {
      throw new BadRequestException('Error deleting task');
    }
  }
}
