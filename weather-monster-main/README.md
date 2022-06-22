## Description

WEATHER-MONSTER APPLICATION

## Requirement

Docker needs to be installed to run and test this Application

## Installation

Navigate to the root folder of the project.

```bash
$ yarn
```

## Setting up the app

```bash
yarn prisma:migration:init
yarn prisma generate
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# e2e tests
$ yarn test:e2e

```

shutdown all db instances on docker

```bash
yarn db:shutdown
```
