### Shopping Centre Api

This implements a shopping centre API.

Technology choices:
Framework: Express
Language: Typescript
Database: Postgres
Dev environment: Docker-compose
Tests: Jest
Orm: TypeORM
Authentication: JWT token (locally generated)

### Start instructions

You will need an env file at `env.development` and `env.test`, here is a sample file for development:

```
JWT_SECRET=ermfioemfierm45)(DC
PORT=3000
PG_HOST=inventory-db
PG_USERNAME=postgres
PG_PASSWORD=
PG_DATABASE=inventory
PG_PORT=5432
TYPEORM_ENTITIES=build/src/entity/**/*.js
NODE_ENV=development
```

To start the project, first do an npm install so you can later migrate the database
`npm install`

Then launch the Dockers with
`docker-compose up`

Then migrate database with
`npm run migrate`

Next, generate a JWT token for testing with
`npm run getJwt`

A Postman collection exists at
`Inventory.postman_collection.json` to help test the Api and also document it.

### Tests

To run the tests, create an `env.test` file. A sample file is below:

```
JWT_SECRET=ermfioemfierm45)(DC
PORT=3001
PG_HOST=localhost
PG_USERNAME=postgres
PG_PASSWORD=
PG_DATABASE=inventory
PG_PORT=5432
TYPEORM_ENTITIES=src/entity/**/*.ts
NODE_ENV=test
```

Then do
`npm install`

and run tests with
`npm test`

A copy of the test output is stored in
`tests/output.txt`

### Notes

- Assets and Shopping Centre Endpoints:

```
Asset:
POST     /asset                 Create an Asset
GET      /asset/:id             Get one asset
GET      /asset                 Get all assets
DELETE   /asset/:id             Delete an asset
PATCH    /asset/:id             Update an asset
PATCH    /asset/status/:id      Mark an asset active or offline

Shopping Centre:
POST     /shopping-centre       Create a Shopping Centre
GET      /shopping-centre/:id   Get one Shopping Centre
GET      /shopping-centre       Get all Shopping Centre
DELETE   /shopping-centre/:id   Delete a Shopping Centre (Cascade delete associated assets)
PATCH    /shopping-centre/:id   Update a Shopping Centre

```

- User Authentication
  This uses a simple JWT auth to autheticate requests. These tokens are valid for 1 week, and validate all access to asset and shopping centre endpoints.

All requests are made with a fixed user id. I have not implemented user management and roles for this test.

- Validation
  Validation is done using Joi and the Celebrate middleware to check incoming requests against expected Typescript types for each resource. Typescript types for incoming data are present in `src/types/http`.

- Persistence
  Persistence is done with TypeORM and this takes care of migrations as well. TypeORM entities are present in `src/entity` and migrations in `src/migration`. Everything is stored in a Postgres database.

- Tests
  Jest tests using Supertest to test the API are present.

-
