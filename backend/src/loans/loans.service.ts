import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { Loan } from './entity/loan.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);
  constructor(
    @InjectRepository(Loan)
    private readonly LoanRepository: Repository<Loan>,
  ) {}

  async getTopBorrowedBooks() {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Fetching top borrowed books`);
    try {
      const topBorrowedBooks = await this.LoanRepository.createQueryBuilder('l')
        .select('b.book_id, b.title, COUNT(l.loan_id) AS borrow_count')
        .where('l.returnDate IS NOT NULL')
        .andWhere('l.borrowed_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)')
        .innerJoin('l.book', 'b')
        .groupBy('b.book_id, b.title')
        .orderBy('borrow_count', 'DESC')
        .limit(5)
        .getRawMany();
      /**
         * Query Explanation:
         *SELECT 
            b.book_id, 
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
            b.book_id, b.title
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
      throw e;
    }
  }

  async getAllLoans() {
    const request_id = uuid();
    this.logger.log(`Request ID: ${request_id} - Fetching all loans`);
    try {
      const loans = await this.LoanRepository.find({
        relations: ['user', 'book'],
      });
      if (!loans || loans.length === 0) {
        this.logger.warn(
          `Request ID: ${request_id} - No loans found in the system`,
        );
        return [];
      }
      this.logger.log(
        `Request ID: ${request_id} - Successfully fetched all loans`,
      );
      return loans;
    } catch (e) {
      this.logger.error(
        `Request ID: ${request_id} - Error fetching all loans: ${e}`,
      );
      throw e;
    }
  }
}
