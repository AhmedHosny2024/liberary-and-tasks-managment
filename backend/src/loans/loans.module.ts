import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entity/loan.entity';
import { LoansService } from './loans.service';
import { UsersModule } from '../users/users.module';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([Loan]), UsersModule, BooksModule],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
