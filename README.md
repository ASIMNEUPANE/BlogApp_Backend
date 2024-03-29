# BlogApp

This application is a blog platform built with several key technologies and implements a number of important features.

## Features

- **Express.js**: The application uses Express.js as the web server.
- **TypeScript**: TypeScript, a statically typed superset of JavaScript, is used to provide static type checking. This helps to catch and prevent errors early in the development process.
- **Jest**: We use Jest, a powerful JavaScript testing framework, for unit testing in our application. It helps us ensure code reliability and correctness, catch and fix bugs early, and prevent new changes from breaking existing functionality.
- **Mongoose**: Mongoose is used as a MongoDB object modeling tool. It provides a schema-based solution to model application data and supports database indexing for improved query performance.
- **dotenv**: This zero-dependency module is used to load environment variables from a `.env` file into `process.env`.
- **Multer**: Multer is used as a middleware for handling `multipart/form-data`, primarily for uploading files.
- **Zod**: Zod is a powerful library used for creating and validating schemas for data. It provides real-time validation, ensuring that only valid data is used in the application.
- **Custom Error Handling**: The application includes a custom middleware for handling errors.
- **express-rate-limit**: This middleware is used to set up rate limiting on the application, limiting each IP to a certain number of requests per specified time period.
- **Pagination**: The application supports fetching paginated data from the database, which can be useful for handling large amounts of data.
- **Compression**: Compression is used to reduce the size of the data, improving the performance of the application.
- **Swagger/OpenAPI**: The application uses Swagger/OpenAPI for API documentation. It provides standardized, interactive documentation, and facilitates client SDK and server code generation.

## Application of Learning Section Technologies

### TypeScript

In our application, TypeScript is used extensively to provide static type checking. This helps us catch and prevent errors early in the development process. For instance, we define types for our models and use them to ensure consistency across our application.

### Zod

Zod is used in our application for data validation. We define schemas for our data models using Zod and use these schemas to validate data before it is saved to the database. This ensures that only valid data is stored in our database.

### Pagination using Indexing

Our application handles large amounts of data. To make this data manageable and to improve performance, we use pagination. We also use indexing in our MongoDB database to quickly locate the data for each page without having to scan every document in the collection.

### Swagger/OpenAPI

In our application, Swagger/OpenAPI is key for API documentation. It standardizes endpoint documentation and generates interactive docs, allowing users to test endpoints directly. It also aids in development by auto-generating client SDKs and server code. This enhances team communication by providing a clear API specification.

### Compression

To improve the performance of our application, we use compression. This reduces the size of the data that is sent over the network, resulting in faster load times and a better user experience.

### Jest:

My experience with Jest has been instrumental in setting up a robust testing environment and writing effective tests. I've learned to write unit tests, mock responses, spy on function behavior, test asynchronous code, and prevent regressions. This has led to more robust and reliable software.

## Local Setup

Follow these steps to set up the application on your local machine:

1. **Clone the repository**

   Use the following command to clone the repository:

   ```bash
   git clone git@github.com:ASIMNEUPANE/BlogApp_Backend.git

   ```

2. **Install dependencies**

   Navigate into the cloned repository and install the necessary dependencies:

   `cd blogapp`
   `npm install`

3. **Set up environment variables**

   Create a .env file in the root directory of the project and add the necessary environment variables. Refer to the .env.example file in the repository for the required variables.

4. **Run the tests**

   After setting up the environment variables, you can run the unit tests to ensure everything is working as expected. Use the following command to run the tests:

   ```bash
   npm run test   

5. **Start the application**

   Use the following command to start the application:

   `npm start`

   The application should now be running on `http://localhost:3000` (or whatever port you specified in your .env file).
