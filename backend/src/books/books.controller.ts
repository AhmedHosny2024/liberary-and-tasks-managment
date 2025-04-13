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

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() data: Partial<Book>): Promise<Book> {
    try {
      return this.booksService.create(data);
    } catch (error) {
      throw new BadRequestException('Error creating book');
    }
  }

  @Get()
  findAll(): Promise<Book[]> {
    try {
      return this.booksService.findAll();
    } catch (error) {
      throw new BadRequestException('Error fetching books');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Book> {
    try {
      return this.booksService.findOne(id);
    } catch (error) {
      throw new BadRequestException('Error fetching book');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    try {
      return this.booksService.remove(id);
    } catch (error) {
      throw new BadRequestException('Error deleting book');
    }
  }
}
