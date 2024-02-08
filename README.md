# BlogAPP

BlogAPP is a backend application built with Express.js and TypeScript. It uses Mongoose to interact with the MongoDB database and dotenv for environment variable management. The application also includes features like file uploading with Multer, input validation with Zod, custom error handling, rate limiting, pagination, and database indexing.

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

## Learning Section

### TypeScript

TypeScript is a statically typed superset of JavaScript, which compiles down to plain JavaScript. It introduces optional types, classes, and modules to JavaScript, providing a robust foundation for building large-scale applications. One of the key benefits of TypeScript is its ability to catch and prevent errors early in the development process through static type checking.

### Data Validation – Zod

Zod is a powerful library for data validation. It allows developers to create and enforce schemas for data, eliminating the need for manual validation logic. Zod provides real-time validation, which means it can validate data as it's being processed, ensuring that only valid data is used in your application. This can significantly improve the reliability and robustness of your code.

### Compression - Compression

Compression is a method of reducing the size of data, which helps to improve the performance of the application. It reduces the bandwidth usage, and the data storage costs.

### Pagination using Indexing

Pagination is a powerful technique that breaks down large sets of data into manageable, discrete pages. This is particularly useful in scenarios where dealing with large amounts of data could be overwhelming or resource-intensive.

Indexing, on the other hand, is a database optimization technique that allows data to be retrieved faster. It works by creating a data structure (an index) that allows for quicker data lookup.

When combined, pagination and indexing can significantly improve the performance and efficiency of data retrieval in your application. By using indexing, the database can quickly locate the data for each page without having to scan every document in the collection. This results in faster page loads and a more responsive application, especially when dealing with large datasets.

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
