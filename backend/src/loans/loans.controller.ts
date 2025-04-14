import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/creat-loan-dto';
import { Loan } from './entity/loan.entity';
import { TotalLoansDto } from './dto/total-loans';

@Controller('loans')
export class LoansController {
  constructor(private loanService: LoansService) {}

  @Get('top-borrowed')
  getTopBorrowedBooks() {
    try {
      return this.loanService.getTopBorrowedBooks();
    } catch (error) {
      console.error('Error fetching top borrowed books:', error);
      throw new Error('Could not fetch top borrowed books');
    }
  }
  @Post()
  create(@Body() dto: CreateLoanDto): Promise<Loan> {
    return this.loanService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('isReturned') status: string | null | undefined,
  ): Promise<TotalLoansDto> {
    console.log('status', status);
    return this.loanService.findAll(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 10,
      status
        ? status === 'true'
          ? true
          : status === 'false'
            ? false
            : null
        : null,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Loan> {
    return this.loanService.findOne(+id);
  }

  @Patch(':id/return')
  returnBook(@Param('id') id: number): Promise<Loan> {
    return this.loanService.returnBook(+id);
  }

  @Patch(':id')
  updateLoan(
    @Param('id') id: number,
    @Body() dto: Partial<CreateLoanDto>,
  ): Promise<Loan> {
    return this.loanService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.loanService.remove(+id);
  }
}
