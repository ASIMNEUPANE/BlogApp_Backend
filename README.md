# BlogAPP

BlogAPP is a backend application built with Express.js and TypeScript. It uses Mongoose to interact with the MongoDB database and dotenv for environment variable management. The application also includes features like file uploading with Multer, input validation with Zod, custom error handling, rate limiting, pagination, and database indexing.

## Application of Learning Section Technologies

### TypeScript

In our application, TypeScript is used extensively to provide static type checking. This helps us catch and prevent errors early in the development process. For instance, we define types for our models and use them to ensure consistency across our application.

### Zod

Zod is used in our application for data validation. We define schemas for our data models using Zod and use these schemas to validate data before it is saved to the database. This ensures that only valid data is stored in our database.

### Pagination using Indexing

Our application handles large amounts of data. To make this data manageable and to improve performance, we use pagination. We also use indexing in our MongoDB database to quickly locate the data for each page without having to scan every document in the collection.

### Compression

To improve the performance of our application, we use compression. This reduces the size of the data that is sent over the network, resulting in faster load times and a better user experience.

### Data Validation – Zod

We use Zod in our application to create and validate schemas for our data. This provides a way to validate JavaScript data structures without writing validation logic manually. It validates data in real time, ensuring that only valid data is used in our application.

### Indexes

Our application uses MongoDB as a database, and we use indexes to improve the performance of database operations. By using indexes, MongoDB can quickly locate the documents that match a query without having to scan every document in a collection.

## Overview

The application is structured around several key packages:

## Features

This application is built with several key technologies and implements a number of important features:

- **Express.js**: The application uses Express.js as the web server.
- **TypeScript**: TypeScript, a statically typed superset of JavaScript, is used to provide static type checking. This helps to catch and prevent errors early in the development process.
- **Mongoose**: Mongoose is used as a MongoDB object modeling tool. It provides a schema-based solution to model application data and supports database indexing for improved query performance.
- **dotenv**: This zero-dependency module is used to load environment variables from a `.env` file into `process.env`.
- **Multer**: Multer is used as a middleware for handling `multipart/form-data`, primarily for uploading files.
- **Zod**: Zod is a powerful library used for creating and validating schemas for data. It provides real-time validation, ensuring that only valid data is used in the application.
- **Custom Error Handling**: The application includes a custom middleware for handling errors.
- **express-rate-limit**: This middleware is used to set up rate limiting on the application, limiting each IP to a certain number of requests per specified time period.
- **Pagination**: The application supports fetching paginated data from the database, which can be useful for handling large amounts of data.
- **Compression**: Compression is used to reduce the size of the data, improving the performance of the application.


## File Structure

- `src/`: This directory contains all the source code.
  - `index.ts`: This is the entry point of the application.
  - `ErrorHandler.ts`: This file contains a custom middleware for handling errors.
  - `validateBlogDataMiddleware.ts`: This file contains a custom middleware for validating blog data using Zod.
  - `IndexRouter.ts`: This file contains the main router for the application.
  - `controllers/`: This directory contains all the controller files.
  - `models/`: This directory contains all the model files.
  - `routes/`: This directory contains all the route files.
  - `utils/`: This directory contains all the utility files.
- `test/`: This directory contains all the test files.
- `.env`: This file contains all the environment variables.
- `package.json`: This file contains the list of project dependencies and scripts.
- `tsconfig.json`: This file contains the TypeScript compiler configuration.
- `README.md`: This file contains information about the project and instructions on how to run it.

## Environment Variables

- `PORT`: The port number on which the server runs. Defaults to 3333 if not provided.
- `DB_URL`: The URL of the MongoDB database. This is a required environment variable and the application will throw an error if it's not provided.

## Database Connection

The application connects to the MongoDB database using Mongoose. If the connection is successful, it logs "Database is connected". If there's an error, it logs the error message.
