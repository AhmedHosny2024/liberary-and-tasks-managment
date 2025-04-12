import { Controller, Get } from '@nestjs/common';
import { LoansService } from './loans.service';

@Controller('loans')
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Get('top-borrowed')
  getTopBorrowedBooks() {
    try {
      return this.loansService.getTopBorrowedBooks();
    } catch (error) {
      console.error('Error fetching top borrowed books:', error);
      throw new Error('Could not fetch top borrowed books');
    }
  }
  @Get('all')
  getAllLoans() {
    try {
      return this.loansService.getAllLoans();
    } catch (error) {
      console.error('Error fetching all loans:', error);
      throw new Error('Could not fetch all loans');
    }
  }
}
