### Inventory Api

This implements a shopping centre API.

This uses the Express framework with Typescript. It uses Postgres for the database with orm abstraction provided by TypeOrm. Docker-compose provides the dev environment and Jest does the testing. Authentication is with a JWT bearer token.

### Start instructions

You will need an env file at `env.development`, a sample file is included below and this should work as-is:

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

To start the project, 

```
# First do an npm install so you can later migrate the database
npm install

# Then launch the Dockers with
docker-compose up

# Then migrate database with
npm run migrate

```

You can now use and test the API using a Postman collection included for the purpose.

You will first need to generate a JWT token for testing with
`npm run getJwt`

And then use the Postman collection
`Inventory.postman_collection.json`

The Postman collection also serves to document the API. Before using the collection, replace the bearer token with the one generated above. The collection includes a token valid for a week if you don't change the `JWT_SECRET` in the sample configuration.

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

Then if not already done, do
`npm install`

and run tests with
`npm test`

For the purposes of this test, I have stored the test output at `tests/output.txt` for easy reference.

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
GET      /shopping-centre       Get all Shopping Centres
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
