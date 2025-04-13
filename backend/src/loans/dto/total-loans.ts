import { Loan } from '../entity/loan.entity';

export type TotalLoansDto = {
  total: number;
  data: Loan[];
};
