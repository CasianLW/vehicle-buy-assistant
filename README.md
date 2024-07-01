# Car AI Assistant API

![gif](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjFob3RoM3Q1N212MDJhbGl4NnJ4cWdiNDFvZnIzNnBjMTBkejZpdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTlJqQwva46dy/giphy.gif)

This is the backend API for the Car AI Assistant, which helps manage vehicle-related data and user settings. The API includes user authentication features like registration, login, and password recovery processes.

## Installation

Use .env.example to create .env

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Features

### Auth Module

- **Register a New User**: Encrypts the password and creates a user record.
- **Login**: Authenticates a user by email and password, returning a JWT.
- **Forgot Password**: Sends a password reset code to the user's email.
- **Reset Password**: Allows users to reset their password using a code sent via email.

### User Management

- **Create User**: Registers a new user account.
- **Find User**: Retrieves a user's information by their ID.
- **Update User**: Updates user information.
- **Delete User**: Removes a user account by ID.

### Vehicle Data Processing

- **Process Vehicle Prompts**: Analyzes and processes data based on user-generated vehicle-related prompts.
- **Vehicle Rapport**: Analyzes Vehicle from body and returns a rapport based on prompt and ai context.

### Application Settings

- **Get Settings**: Retrieves current application settings.
- **Create Settings**: Sets up new application settings.
- **Update Settings**: Modifies existing application settings.

### History

- **Create History Entry**: Logs a new interaction history entry for a user.
- **Get User History**: Retrieves the interaction history for a specific user.

## API Routes Overview

### Auth Routes

- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/forgot-password`
- POST `/auth/reset-password`

### User Routes

- POST `/users`
- GET `/users/{id}`
- PATCH `/users/{id}`
- DELETE `/users/{id}`

### Vehicle Routes

- POST `/vehicles/process`
- POST `/vehicles/rapport`

### Settings Routes

- GET `/app-settings`
- POST `/app-settings`
- PATCH `/app-settings`

### History Routes

- POST `/history`
- GET `/history/{userId}`

## Swagger Documentation

For more detailed information about each endpoint, including required parameters and response structures, please visit the Swagger documentation at:
[Car AI Assistant API Docs](https://vehicle-buy-assistant-1.onrender.com/api)

## Contributing

Contributions are welcome! Please open an issue or pull request on our repository if you have suggestions or improvements.

## License

MIT LICENSE
