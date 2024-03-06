# Unit Testing with Jest and @shelf/mongodb

## What is Unit Testing?

Unit testing is a software testing technique where individual units or components of a software application are tested in isolation to ensure they perform as expected. It helps detect bugs early in the development process, improves code quality, and provides confidence in the correctness of the codebase.

## Why Unit Testing?

**- Bug Detection**: Identifies bugs early in the development cycle, making them cheaper and easier to fix.

**- Code Quality**: Ensures code quality by verifying that individual units behave as expected.

**- Refactoring Confidence**: Facilitates refactoring by providing a safety net against unintended changes.

**- Documentation**: Serves as documentation for how code should behave.

**- Regression Testing**: Guards against regressions by validating that existing functionality continues to work as intended.

## What is Jest?

Jest is a popular JavaScript testing framework developed by Facebook. It provides a simple and intuitive API for writing unit tests, along with powerful features such as mocking, spying, and built-in assertion utilities.

## When to Use Mock and Spy in Jest?

### Mocking:

Use mocking to simulate dependencies or external services, ensuring isolated testing environments and predictable behavior.

**- Purpose**: Mocking replaces entire functions or modules with fake implementations during tests.

**- Usage**: Used to simulate dependencies or external services, ensuring isolated testing environments.

**- Implementation**: Entire functions or modules are replaced with mocks using `jest.mock()`.

**- Behavior Definition**: Behavior of mocks is explicitly defined to simulate different scenarios.

**- Isolation**: Tests are isolated from external dependencies, focusing solely on the behavior of the unit under test.

### Spying:

Use spying to observe function calls and interactions, validating behavior without modifying the original function.

**- Purpose**: Spying observes function calls and interactions without altering their behavior.

**- Usage**: Used to validate function behavior, such as whether a function was called or with what arguments.

**- Implementation**: Functions are wrapped with spies using `jest.spyOn()`.

**- Observation**: Spies record function calls and arguments during test execution.

**- Validation**: Assertions can be made on function calls and interactions to validate expected behavior.

## Different Mock Resolvers in Jest:

**- mockResolvedValue**: Sets a consistent resolved value for a mocked asynchronous function.

**- mockResolvedOnce**: Sets a resolved value for a mocked asynchronous function for the next call only.

**- mockReturnValue**: Sets a consistent return value for a mocked function.

**- mockReturnValueOnce**: Sets a return value for a mocked function for the next call only.

## How to Test Database Using @shelf/mongodb?

@shelf/mongodb is a Jest plugin that provides utilities for testing MongoDB databases in Jest tests.

**1.Installation**: Install @shelf/mongodb package using npm or yarn.

**2.Setup**: Set up a MongoDB connection in your test environment configuration.

**3.Testing**: Write Jest tests that interact with the MongoDB database using @shelf/mongodb utilities for mocking and assertion.

## Assertion in Jest:

Jest provides built-in assertion utilities such as `expect()` to make assertions about the code being tested. Assertions verify that certain conditions are met during the execution of the test.

## Step to Unit Test:

**1.Setup**: Initialize the test environment, including any necessary configurations or dependencies.

**2.Write Tests**: Write individual test cases for each unit or component of the codebase, focusing on specific behaviors or edge cases.

**3.Arrange**: Set up the necessary preconditions and inputs for the test case.

**4.Act**: Invoke the function or component being tested with the provided inputs.

**5.Assert**: Make assertions using Jest's built-in `expect()` function to verify the expected behavior or outcomes.

**6.Teardown**: Clean up any resources or state changes introduced during the test case, ensuring a clean environment for subsequent tests.

# some example of testing -:

Here's a brief explanation of what's happening in the provided testing code:

**1. Database Setup**: Before running tests, the database connection is established.

**2. Test Execution**: Each test case begins by defining a payload for user registration.

**3. Mocking Dependencies**:

bcrypt.hash, userModel.create, and OTP.generateOTP functions are mocked to simulate their behavior.
Function Invocation: The register function is invoked with the defined payload.

**4. Assertions**:

- bcrypt.hash is called with the correct password.
- userModel.create is called with the expected user data.
- OTP.generateOTP is called.
- authModel.create is called with the appropriate payload.
- mailer() is called with the appropriate payload.
- The result of register function is validated.
- Cleanup: After each test, mocks are cleared, and the database connection is closed.

```describe("Register Testing", () => {
  beforeAll(async () => {
    await common.connectDatabase();
  });

  afterAll(async () => {
    await common.closeDatabase();
  });
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });
  it("should register the user", async () => {
    // Define payload
    const payload = {
      name: "asim neupane",
      email: "asimneupane11@gmail.com",
      password: "helloworld",
      images: "asim.jpg",
    };

    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never );
    // Mocking userModel.create function
    jest.spyOn(userModel, "create").mockResolvedValue(payload)

    // Mocking totp.generate function
    jest.spyOn(OTP, "generateOTP").mockReturnValue("123456");

    // Call the register function
    const result = await register(payload);
    // Assertions
    // Check if bcrypt.hash was called with the correct password
    expect(bcrypt.hash).toHaveBeenCalledWith(
      payload.password,
      expect.any(Number)
    );

    // Check if userModel.create was called with the expected user data
    expect(userModel.create).toHaveBeenCalledWith({
      name: payload.name,
      email: payload.email,
      password: "hashedPassword",
      images: payload.images,
    });

    // Check if totp.generate was called
    expect(OTP.generateOTP).toHaveBeenCalled();
    // Check if authModel.create was called
    const authPayload = {
      email: payload.email,
      token: "123456",
    };
    jest.spyOn(authModel, "create").mockResolvedValue(authPayload);

    // Check if nodemailer.createTransport().sendMail was called
    expect(mailer).toHaveBeenCalled();
    expect(authModel.create).toHaveBeenCalledWith(authPayload);
    // Assert the result returned by register function
    expect(result).toEqual(true);
    // expect(result.password).toEqual("hashedPassword");
    expect(mailer).toHaveBeenCalledWith("asimneupane11@gmail.com", 123456);
  });
});
```

##Points to Remember:

- Ensure tests are focused, isolated, and cover edge cases.

- Write descriptive test names for better readability.

- Aim for high test coverage to minimize the risk of undiscovered bugs.
