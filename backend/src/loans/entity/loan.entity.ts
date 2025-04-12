import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Book } from '../../books/entity/book.entity';

// This index is used to speed up queries that filter by book and borrowed_at
// its composite index first index is book and second index is borrowed_at
@Entity()
@Index(['book', 'borrowed_at'])
export class Loan {
  @PrimaryGeneratedColumn()
  loan_id: number;

  @ManyToOne(() => User, (user) => user.loans)
  user: User;

  @ManyToOne(() => Book, (book) => book.loans)
  book: Book;

  @CreateDateColumn()
  borrowed_at: Date;

  @Column({ nullable: true })
  returnDate: Date;
}
