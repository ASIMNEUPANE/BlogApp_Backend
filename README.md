# BlogAPP

BlogAPP is a backend application built with Express.js and TypeScript. It uses Mongoose to interact with the MongoDB database and dotenv for environment variable management. The application also includes features like file uploading with Multer, input validation with Zod, and custom error handling.

## Overview

The application is structured around several key packages:

- `Express.js`: The web server for the application.
- `TypeScript`: A superset of JavaScript that adds static types.
- `Mongoose`: A MongoDB object modeling tool designed to work in an asynchronous environment. It provides a straight-forward,         schema-based solution to model your application data.
- `dotenv`: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- `Multer`: A middleware for handling `multipart/form-data`, which is primarily used for uploading files.
- `Zod`: A library for creating and validating schemas for your data.
- `Custom Error Handling`: A custom middleware for handling errors.

## File Structure

- `index.ts`: This is the entry point of the application.
- `ErrorHandler.ts`: This file contains a custom middleware for handling errors.
- `validateBlogDataMiddleware.ts`: This file contains a custom middleware for validating blog data using Zod.
- `IndexRouter.ts`: This file contains the main router for the application.

## Environment Variables
 
- `PORT`: The port number on which the server runs. Defaults to 3333 if not provided.
- `DB_URL`: The URL of the MongoDB database. This is a required environment variable and the application will throw an error if it's not provided.

## Database Connection

The application connects to the MongoDB database using Mongoose. If the connection is successful, it logs "Database is connected". If there's an error, it logs the error message.