import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { v4 as uuid } from 'uuid';
import { Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/creat-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(userData: Partial<CreateUserDto>): Promise<User> {
    const request_id = uuid();
    try {
      const startTime = Date.now();
      const user = this.userRepo.create(userData);
      if (!user) {
        this.logger.warn(`Request ID: ${request_id} - User data is invalid`);
        throw new BadRequestException('Invalid user data');
      }
      const res = await this.userRepo.save(user);
      this.logger.log(
        `Request ID: ${request_id} - User created with data: ${JSON.stringify(user)}
         with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error creating user`,
        error?.message,
      );
      throw new BadRequestException(`Error creating user`);
    }
  }

  async findAll(): Promise<User[]> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Get all users`);
    try {
      const startTime = Date.now();
      const res = await this.userRepo.find({
        relations: ['loans'],
      });
      if (!res) {
        throw new NotFoundException('No users found');
      }
      this.logger.log(
        `Request ID: ${request_id} - Users fetched with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error fetching users`,
        error?.message,
      );
      throw new BadRequestException(`Error fetching users`);
    }
  }

  async findOne(id: number): Promise<User> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Get user with ID: ${id}`);
    try {
      const startTime = Date.now();
      const res = await this.userRepo.findOne({
        where: { id: id },
        relations: ['loans'],
      });
      if (!res) {
        throw new NotFoundException(`User not found`);
      }
      this.logger.log(
        `Request ID: ${request_id} - User fetched with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error fetching user`,
        error?.message,
      );
      throw new BadRequestException(`Error fetching user`);
    }
  }

  async remove(id: number): Promise<void> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Delete user with ID: ${id}`);
    try {
      const startTime = Date.now();
      const res = await this.userRepo.delete(id);
      if (!res.affected) {
        throw new NotFoundException(`User not found`);
      }
      this.logger.log(
        `Request ID: ${request_id} - User deleted with time taken: ${Date.now() - startTime}ms`,
      );
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error deleting user`,
        error?.message,
      );
      throw new BadRequestException(`Error deleting user`);
    }
  }
}
