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
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger/dist/decorators';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const res = await this.tasksService.createTask(createTaskDto);
      return res;
    } catch (error) {
      throw new BadRequestException('Error creating task');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({
    status: 200,
    description: 'Tasks fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
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
  @ApiOperation({ summary: 'Mark task as complete' })
  @ApiResponse({
    status: 200,
    description: 'Task marked as complete successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async markTaskAsComplete(@Param('id') id: number): Promise<Task> {
    try {
      const res = await this.tasksService.markTaskAsComplete(id);
      return res;
    } catch (error) {
      throw new BadRequestException('Error marking task as complete');
    }
  }
  @Patch(`:id`)
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: Partial<CreateTaskDto>,
  ): Promise<Task> {
    try {
      const res = await this.tasksService.updateTask(Number(id), updateTaskDto);
      return res;
    } catch (error) {
      throw new BadRequestException('Error updating task');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async deleteTask(@Param('id') id: number): Promise<void> {
    try {
      await this.tasksService.deleteTask(id);
    } catch (error) {
      throw new BadRequestException('Error deleting task');
    }
  }
}
