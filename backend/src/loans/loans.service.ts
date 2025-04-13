import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { Loan } from './entity/loan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLoanDto } from './dto/creat-loan-dto';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { TotalLoansDto } from './dto/total-loans';

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepo: Repository<Loan>,
    private readonly userService: UsersService,
    private readonly bookService: BooksService,
  ) {}

  async getTopBorrowedBooks() {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Fetching top borrowed books`);
    try {
      const topBorrowedBooks = await this.loanRepo
        .createQueryBuilder('l')
        .select('b.id, b.title, COUNT(l.loan_id) AS borrow_count')
        .where('l.returnDate IS NOT NULL')
        .andWhere('l.borrowed_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)')
        .innerJoin('l.book', 'b')
        .groupBy('b.id, b.title')
        .orderBy('borrow_count', 'DESC')
        .limit(5)
        .getRawMany();
      /**
         * Query Explanation:
         *SELECT 
            b.id, 
            b.title, 
            COUNT(l.loan_id) AS borrow_count
          FROM 
            loan l
          WHERE 
            l.returnDate IS NOT NULL
            AND l.borrowed_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          INNER JOIN 
            book b ON l.book_id = b.book_id
          GROUP BY 
            b.id, b.title
          ORDER BY 
            borrow_count DESC
          LIMIT 5;
         */
      if (!topBorrowedBooks || topBorrowedBooks.length === 0) {
        this.logger.warn(
          `Request ID: ${request_id} - No borrowed books found in the last 6 months`,
        );
        return [];
      }
      this.logger.log(
        `Request ID: ${request_id} - Successfully fetched top borrowed books`,
      );
      return topBorrowedBooks;
    } catch (e) {
      this.logger.error(
        `Request ID: ${request_id} - Error fetching top borrowed books: ${e}`,
      );
      throw new BadRequestException(`Error fetching top borrowed books`);
    }
  }

  async create(dto: CreateLoanDto): Promise<Loan> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Creating loan`);
    try {
      const startTime = Date.now();
      const user = await this.userService.findOne(dto.user_id);
      const book = await this.bookService.findOne(dto.book_id);

      if (!user || !book) {
        throw new BadRequestException('User or Book not found');
      }

      const loan = this.loanRepo.create({
        returnDate: dto.returnDate ?? null,
        user: user,
        book: book,
        borrowed_at: new Date(),
        isReturned: false,
      });

      const res = await this.loanRepo.save(loan);
      if (!res) {
        this.logger.warn(`Request ID: ${request_id} - Loan data is invalid`);
        throw new BadRequestException('Invalid loan data');
      }
      this.logger.log(
        `Request ID: ${request_id} - Loan created with data: ${JSON.stringify(
          res,
        )} with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error creating loan`,
        error?.message,
      );
      throw new BadRequestException(`Error creating loan`);
    }
  }

  async findAll(
    page: number,
    limit: number,
    isReturned: boolean | null | undefined,
  ): Promise<TotalLoansDto> {
    const request_id = uuid();
    this.logger.log(
      `Request ID: ${request_id} - Fetching all loans filters isReturned: ${isReturned} page: ${page} limit: ${limit}`,
    );
    try {
      const filters: { isReturned?: boolean; skip?: number; take?: number } =
        {};
      if (isReturned !== undefined) {
        filters.isReturned = isReturned;
      }
      filters.skip = page ? (page - 1) * limit : 0;
      filters.take = limit ? limit : 10;
      const startTime = Date.now();
      const [data, total] = await this.loanRepo.findAndCount({
        where: filters.isReturned ? { isReturned: filters.isReturned } : {},
        skip: filters.skip,
        take: filters.take,
        relations: ['user', 'book'],
      });
      if (!data || data.length === 0) {
        this.logger.warn(
          `Request ID: ${request_id} - No loans found with filters: ${JSON.stringify(
            filters,
          )}`,
        );
        return { total: 0, data: [] };
      }
      this.logger.log(
        `Request ID: ${request_id} - Loans fetched with time taken: ${Date.now() - startTime}ms`,
      );
      return {
        total: total,
        data: data,
      };
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error fetching loans`,
        error?.message,
      );
      throw new BadRequestException(`Error fetching loans`);
    }
  }

  async findOne(id: number): Promise<Loan> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Fetching loan with ID: ${id}`);
    try {
      const startTime = Date.now();
      const res = await this.loanRepo.findOne({
        where: { loan_id: id },
        relations: ['user', 'book'],
      });
      if (!res) {
        throw new NotFoundException(`Loan with ID ${id} not found`);
      }
      this.logger.log(
        `Request ID: ${request_id} - Loan fetched with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error fetching loan`,
        error?.message,
      );
      throw new BadRequestException(`Error fetching loan`);
    }
  }

  async returnBook(id: number): Promise<Loan> {
    const request_id = uuid();
    this.logger.log(
      `Request ID: ${request_id} - Returning book with loan ID: ${id}`,
    );
    try {
      const startTime = Date.now();
      const loan = await this.loanRepo.findOne({
        where: { loan_id: id },
        relations: ['user', 'book'],
      });
      if (!loan) {
        throw new NotFoundException(`Loan with ID ${id} not found`);
      }
      loan.returnDate = new Date();
      loan.isReturned = true;
      const res = await this.loanRepo.save(loan);
      this.logger.log(
        `Request ID: ${request_id} - Book returned with data: ${JSON.stringify(
          res,
        )} with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error returning book`,
        error?.message,
      );
      throw new BadRequestException(`Error returning book`);
    }
  }

  async update(id: number, dto: Partial<CreateLoanDto>): Promise<Loan> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Updating loan with ID: ${id}`);
    try {
      const startTime = Date.now();
      const loan = await this.loanRepo.findOne({
        where: { loan_id: id },
        relations: ['user', 'book'],
      });
      if (!loan) {
        throw new NotFoundException(`Loan with ID ${id} not found`);
      }
      Object.assign(loan, dto);
      const res = await this.loanRepo.save(loan);
      if (!res) {
        this.logger.warn(`Request ID: ${request_id} - Loan data is invalid`);
        throw new BadRequestException('Invalid loan data');
      }
      this.logger.log(
        `Request ID: ${request_id} - Loan updated with data: ${JSON.stringify(
          res,
        )} with time taken: ${Date.now() - startTime}ms`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error updating loan`,
        error?.message,
      );
      throw new BadRequestException(`Error updating loan`);
    }
  }

  async remove(id: number): Promise<void> {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Deleting loan with ID: ${id}`);
    try {
      const startTime = Date.now();
      const res = await this.loanRepo.delete(id);
      if (res.affected === 0) {
        throw new NotFoundException(`Loan with ID ${id} not found`);
      }
      this.logger.log(
        `Request ID: ${request_id} - Loan deleted with time taken: ${Date.now() - startTime}ms`,
      );
    } catch (error) {
      this.logger.error(
        `Request ID: ${request_id} - Error deleting loan`,
        error?.message,
      );
      throw new BadRequestException(`Error deleting loan`);
    }
  }
}
