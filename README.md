## Blog 

## Installation

Before getting started, make sure you have Node.js installed. Then, follow these steps:
```bash
$ npm install
```
## Setting up environment variables

Before running the app, you need to create a .env file in the project root directory. Rename env.example file or use the following example as a template:

```dotenv
PORT=80

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

CRYPT_SALT=10
JWT_SECRET_KEY=$3cret12
JWT_SECRET_REFRESH_KEY=$3cret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h
```

## Running the app

You can run the app using the following commands:

```bash
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod

# Use Docker to connect to the database and start the application
$ npm run docker
```

Choose the appropriate command based on your requirements.

## Migrations

To run migrations after starting the app, use the following command:


``` bash
# after running app
$ npm run migration:run
```