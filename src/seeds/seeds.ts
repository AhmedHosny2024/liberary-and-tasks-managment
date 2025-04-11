import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Book } from '../books/entity/book.entity';
import { Loan } from '../loans/entity/loan.entity';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const userRepo = dataSource.getRepository(User);
  const bookRepo = dataSource.getRepository(Book);
  const loanRepo = dataSource.getRepository(Loan);

  // 🔹 1. Create 20 users
  const users: User[] = [];
  for (let i = 0; i < 20; i++) {
    const user = userRepo.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    users.push(await userRepo.save(user));
  }

  // 🔹 2. Create 20 books
  const books: Book[] = [];
  for (let i = 0; i < 20; i++) {
    const book = bookRepo.create({
      title: faker.lorem.words(3),
      author: faker.person.fullName(),
      publishedDate: faker.date.past(),
    });
    books.push(await bookRepo.save(book));
  }

  // 🔹 3. Create 20 loans (random user + book + borrowed_at in last 6 months)
  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(users);
    const book = faker.helpers.arrayElement(books);
    const borrowed_at = faker.date.recent({ days: 180 }); // last 6 months
    const returnDate = faker.datatype.boolean()
      ? faker.date.between({ from: borrowed_at, to: new Date() })
      : null;

    const loan = loanRepo.create({
      user,
      book,
      borrowed_at,
      returnDate,
    });

    await loanRepo.save(loan);
  }

  console.log('✅ Seed data created');
  await app.close();
}
bootstrap();
