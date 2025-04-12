import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entity/tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { TotalTasksDto } from './dto/total-tasks.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const request_id = uuid();
    try {
      this.logger.log(`Request ID: ${request_id} - Create task`);
      const startTime = Date.now();
      const task = this.tasksRepository.create(createTaskDto);
      this.logger.log(
        `Request ID: ${request_id} - Task created with data: ${JSON.stringify(task)}
         with time taken: ${Date.now() - startTime}ms`,
      );
      const res = await this.tasksRepository.save(task);
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error creating task`,
        error.stack,
      );
      throw new BadRequestException('Error creating task');
    }
  }

  async getTasks(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<TotalTasksDto> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Get all tasks`);
    try {
      const startTime = Date.now();
      const filters: { status?: TaskStatus; skip?: number; take?: number } = {};
      if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
        filters.status = status as TaskStatus;
      }
      filters.skip = (page - 1) * limit;
      filters.take = limit;
      const [data, total] = await this.tasksRepository.findAndCount({
        where: filters.status ? { status: filters.status } : {},
        skip: filters.skip,
        take: filters.take,
      });
      this.logger.log(
        `Request ID: ${request_id} - Tasks fetched with filters: ${JSON.stringify(
          filters,
        )} with time taken: ${Date.now() - startTime}ms`,
      );
      return {
        total: total,
        data: data,
      };
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error fetching tasks`,
        error.stack,
      );
      throw new BadRequestException('Error fetching tasks');
    }
  }

  async markTaskAsComplete(id: number): Promise<Task> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Mark task as complete`);
    try {
      const task = await this.tasksRepository.findOne({ where: { id } });
      if (!task) {
        throw new BadRequestException('Task not found');
      }
      task.status = TaskStatus.COMPLETED;
      await this.tasksRepository.save(task);
      return task;
    } catch (error) {
      this.logger.error(`Error marking task as complete`, error.stack);
      throw new BadRequestException('Error marking task as complete');
    }
  }

  async deleteTask(id: number): Promise<void> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Delete task`);
    try {
      const task = await this.tasksRepository.findOne({ where: { id } });
      if (!task) {
        throw new BadRequestException('Task not found');
      }
      await this.tasksRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting task`, error.stack);
      throw new BadRequestException('Error deleting task');
    }
  }
}
