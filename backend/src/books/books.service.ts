import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entity/book.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@nestjs/common';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async create(data: Partial<Book>): Promise<Book> {
    const request_id = uuid();
    try {
      const startTime = Date.now();
      const book = this.bookRepo.create(data);
      const res = await this.bookRepo.save(book);
      if (!res) {
        this.logger.warn(`Request ID: ${request_id} - Book data is invalid`);
        throw new BadRequestException('Invalid book data');
      }
      this.logger.log(
        `Request ID: ${request_id} - Book created with data: ${JSON.stringify(
          book,
        )} with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error creating book`,
        error?.message,
      );
      throw new BadRequestException(`Error creating book`);
    }
  }

  async findAll(): Promise<Book[]> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Get all books`);
    try {
      const startTime = Date.now();
      const res = await this.bookRepo.find({
        relations: ['loans'],
      });
      this.logger.log(
        `Request ID: ${request_id} - Books fetched with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error fetching books`,
        error?.message,
      );
      throw new BadRequestException(`Error fetching books`);
    }
  }

  async findOne(id: number): Promise<Book> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Get book with ID: ${id}`);
    try {
      const startTime = Date.now();
      const res = await this.bookRepo.findOne({
        where: { id: id },
        relations: ['loans'],
      });
      if (!res) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      this.logger.log(
        `Request ID: ${request_id} - Book fetched with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error fetching book`,
        error?.message,
      );
      throw new BadRequestException(`Error fetching book`);
    }
  }

  async remove(id: number): Promise<void> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Delete book with ID: ${id}`);
    try {
      const startTime = Date.now();
      const book = await this.bookRepo.findOne({
        where: { id },
        relations: ['loans'],
      });
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      if (book.loans?.length > 0) {
        throw new BadRequestException(`Book with ID ${id} has active loans`);
      }
      await this.bookRepo.delete(id);
      this.logger.log(
        `Request ID: ${request_id} - Book deleted with time taken: ${Date.now() - startTime}ms`,
      );
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error deleting book`,
        error?.message,
      );
      throw new BadRequestException(`Error deleting book`);
    }
  }
}
