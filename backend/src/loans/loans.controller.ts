import {
  BadRequestException,
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
import { CreateLoanDto } from './dto/create-loan-dto';
import { Loan } from './entity/loan.entity';
import { TotalLoansDto } from './dto/total-loans';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger/dist/decorators';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private loanService: LoansService) {}

  @Get('top-borrowed')
  @ApiOperation({ summary: 'Get top borrowed books' })
  @ApiResponse({
    status: 200,
    description: 'Top borrowed books fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  getTopBorrowedBooks() {
    try {
      return this.loanService.getTopBorrowedBooks();
    } catch (error) {
      console.error('Error fetching top borrowed books:', error);
      throw new BadRequestException('Could not fetch top borrowed books');
    }
  }
  @Post()
  @ApiOperation({ summary: 'Create a new loan' })
  @ApiResponse({
    status: 201,
    description: 'Loan created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  create(@Body() dto: CreateLoanDto): Promise<Loan> {
    return this.loanService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all loans' })
  @ApiResponse({
    status: 200,
    description: 'Loans fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
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
  @ApiOperation({ summary: 'Get a loan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Loan fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found',
  })
  findOne(@Param('id') id: number): Promise<Loan> {
    return this.loanService.findOne(+id);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({
    status: 200,
    description: 'Book returned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found',
  })
  returnBook(@Param('id') id: number): Promise<Loan> {
    return this.loanService.returnBook(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a loan' })
  @ApiResponse({
    status: 200,
    description: 'Loan updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found',
  })
  updateLoan(
    @Param('id') id: number,
    @Body() dto: Partial<CreateLoanDto>,
  ): Promise<Loan> {
    return this.loanService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a loan' })
  @ApiResponse({
    status: 200,
    description: 'Loan deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found',
  })
  remove(@Param('id') id: number): Promise<void> {
    return this.loanService.remove(+id);
  }
}
