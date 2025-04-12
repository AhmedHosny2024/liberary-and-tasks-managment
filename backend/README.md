### library ERD

<image align='center' src="images/liberary.png" alt="library_erd" style="zoom: 67%;" />

## Explanation of the ERD
- **Book**: Represents a book in the library. It has attributes like `book_id`, `title`, `author`, `publishedDate`. The `book_id` is the primary key.

- **User**: Represents a member of the library. It has attributes like `user_id`, `name`, `email`, `created_at`. The `user_id` is the primary key.

- **Loan**: Represents a loan of a book to a user. It has attributes like `loan_id`, `borrowed_at`, `returnDate`, `return_date`. The `loan_id` is the primary key.

- **Loan_Book**: Represents the one-to-many relationship between `Loan` and `Book`. each book can be borrowed multiple times, but each loan is for a specific book. The `loan_id` and `book_id` are foreign keys referencing the `Loan` and `Book` tables respectively.
- **Loan_User**: Represents the one-to-many relationship between `Loan` and `User`. Each user can have multiple loans, but each loan is for a specific user. The `loan_id` and `user_id` are foreign keys referencing the `Loan` and `User` tables respectively.
- **User_Book**: Represents the many-to-many relationship between `User` and `Book`. Each user can borrow multiple books, and each book can be borrowed by multiple users. The `user_id` and `book_id` are foreign keys referencing the `User` and `Book` tables respectively.
- we can make new entity for `Book` and `User` relationships, but in this case we are not making new entity for `Book` and `User` relationships. as we can save the user and book inside the `Loan` entity. 

### Hoe to run the code
* add .env file containing the following variables:
```bash
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=123
DATABASE_NAME=liberary
```
* run the following command to create the database and tables:
```bash
npm install
npm run seeds
npm start
```
