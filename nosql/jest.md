### Unit Testing with Jest and @shelf/mongodb
## What is Unit Testing?
Unit testing is a software testing technique where individual units or components of a software application are tested in isolation to ensure they perform as expected. It helps detect bugs early in the development process, improves code quality, and provides confidence in the correctness of the codebase.

### Why Unit Testing?
Bug Detection: Identifies bugs early in the development cycle, making them cheaper and easier to fix.
Code Quality: Ensures code quality by verifying that individual units behave as expected.
Refactoring Confidence: Facilitates refactoring by providing a safety net against unintended changes.
Documentation: Serves as documentation for how code should behave.
Regression Testing: Guards against regressions by validating that existing functionality continues to work as intended.
### What is Jest?
Jest is a popular JavaScript testing framework developed by Facebook. It provides a simple and intuitive API for writing unit tests, along with powerful features such as mocking, spying, and built-in assertion utilities.

### When to Use Mock and Spy in Jest?
**Mocking**: Use mocking to simulate dependencies or external services, ensuring isolated testing environments and predictable behavior.
**Spying**: Use spying to observe function calls and interactions, validating behavior without modifying the original function.
### Different Mock Resolvers in Jest:
**mockResolvedValue**: Sets a consistent resolved value for a mocked asynchronous function.
**mockResolvedOnce**: Sets a resolved value for a mocked asynchronous function for the next call only.
**mockReturnValue**: Sets a consistent return value for a mocked function.
**mockReturnValueOnce**: Sets a return value for a mocked function for the next call only.

### How to Test Database Using @shelf/mongodb?
@shelf/mongodb is a Jest plugin that provides utilities for testing MongoDB databases in Jest tests.

**Installation**: Install @shelf/mongodb package using npm or yarn.
**Setup**: Set up a MongoDB connection in your test environment configuration.
**Testing**: Write Jest tests that interact with the MongoDB database using @shelf/mongodb utilities for mocking and assertion.

### Points to Remember:
Ensure tests are focused, isolated, and cover edge cases.
Write descriptive test names for better readability.
Aim for high test coverage to minimize the risk of undiscovered bugs.