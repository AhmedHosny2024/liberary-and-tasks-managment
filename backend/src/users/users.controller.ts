import { Controller, Get, Post, Param, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/creat-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  create(@Body() userData: Partial<CreateUserDto>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users.',
  })
  @ApiResponse({
    status: 404,
    description: 'No users found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
