import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entity/book.entity';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger/dist/decorators';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  create(@Body() data: Partial<Book>): Promise<Book> {
    try {
      return this.booksService.create(data);
    } catch (error) {
      throw new BadRequestException('Error creating book');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: 200,
    description: 'Books fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  findAll(): Promise<Book[]> {
    try {
      return this.booksService.findAll();
    } catch (error) {
      throw new BadRequestException('Error fetching books');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiResponse({
    status: 200,
    description: 'Book fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  findOne(@Param('id') id: number): Promise<Book> {
    try {
      return this.booksService.findOne(id);
    } catch (error) {
      throw new BadRequestException('Error fetching book');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiResponse({
    status: 200,
    description: 'Book deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  remove(@Param('id') id: number): Promise<void> {
    try {
      return this.booksService.remove(id);
    } catch (error) {
      throw new BadRequestException('Error deleting book');
    }
  }
}
