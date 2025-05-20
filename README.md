# Getting Started

![Build status](https://github.com/channainfo/trackr/actions/workflows/test_and_build.yml/badge.svg?branch= "Build status")

## Fix npm package

Module '"drizzle-kit"' has no exported member 'defineConfig'.

```sh
npm list drizzle-kit
npm uninstall drizzle-kit

npm install drizzle-kit@latest

```

## Database

### Applying change

You can directly apply changes to your database using the `drizzle-kit push` command. This is a convenient method for quickly testing new schema designs or modifications in a local development environment, allowing for rapid iterations without the need to manage migration files.

```sh
npx drizzle-kit push
```

### Run test

Prepare the test database

```sh
npm run db:push:test
```

and run the test

```sh
npm test
```
