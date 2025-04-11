import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entity/loan.entity';
import { LoansService } from './loans.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loan])],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
