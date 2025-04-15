### library ERD

<image align='center' src="images/liberary.png" alt="library_erd" style="zoom: 67%;" />

## Explanation of the ERD
- **Book**: Represents a book in the library. It has attributes like `book_id`, `title`, `author`, `publishedDate`. The `book_id` is the primary key.

- **User**: Represents a member of the library. It has attributes like `user_id`, `name`, `email`, `created_at`. The `user_id` is the primary key.

- **User_Book**: Represents the many-to-many relationship between `User` and `Book`. Each user can borrow multiple books, and each book can be borrowed by multiple users.

- **Loan**: Represents the relation between user and book. It has attributes like `loan_id`, `borrowed_at`, `returnDate`, `return_date`, `user` and `book` . The `loan_id` is the primary key.

- we add composite index om `borrowed_at` and `book` to speed up the query to get the books borrowed by a user.

* feature to add: use redis to cache top borrowed books for 1 day instead of calling the query each time.

- **Tasks**: Represents the tasks we have. It has attributes like `id`, `title`, `description`, `dueDate`, `priority` and `status` . The `task_id` is the primary key.

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
* Visit ```http://localhost:8000/docs#/``` to view the API documentation. 
