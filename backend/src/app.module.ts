import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoansModule } from './loans/loans.module';

import { join } from 'path';
import { User } from './users/entity/user.entity';
import { Book } from './books/entity/book.entity';
import { Loan } from './loans/entity/loan.entity';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entity/tasks.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Book, Loan, Task],
      synchronize: true,
    }),
    LoansModule,
    UsersModule,
    BooksModule,
    TasksModule,
  ],
})
export class AppModule {}
