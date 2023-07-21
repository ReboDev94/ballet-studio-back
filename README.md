# Ballet studio - Backend

## Getting started

1.-Install dependencies

```sh
$ npm install
```

2.-Configure environments

3.- up database

```sh
$ docker-compose up -d
```

## Running the app

```sh
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run seed - postman

```
http://localhost:3000/api/seed/execute-seed
```

## Custom credentials

view file 'seed.ts'

## use db fly

```sh
$ flyctl proxy 5432 -a ballet-studio
```

## fly deploy

```sh
$ flyctl deploy
```

## Dockerizar

Production
```sh
$ docker build --no-cache -t ballet-studio .
#Run container with env development
$ docker run --env-file .env.development -p 3000:3000 ballet-studio
#Run container with env production
$ docker run --env-file .env.production -p 80:3000 ballet-studio
```