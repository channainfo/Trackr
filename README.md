# Getting Started

## Fix npm package

Module '"drizzle-kit"' has no exported member 'defineConfig'.

```sh
npm list drizzle-kit
npm uninstall drizzle-kit

npm install drizzle-kit@latest

```

## Database

### Applying change

You can directly apply changes to your database using the drizzle-kit push command. This is a convenient method for quickly testing new schema designs or modifications in a local development environment, allowing for rapid iterations without the need to manage migration files

```sh
npx drizzle-kit push
```
