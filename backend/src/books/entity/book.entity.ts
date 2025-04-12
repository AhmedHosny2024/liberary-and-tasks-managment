import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Loan } from '../../loans/entity/loan.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  book_id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'date', nullable: true })
  publishedDate: Date;

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];
}
