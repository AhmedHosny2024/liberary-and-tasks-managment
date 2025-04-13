import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Loan } from '../../loans/entity/loan.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Loan, (loan) => loan.user)
  loans: Loan[];
}
