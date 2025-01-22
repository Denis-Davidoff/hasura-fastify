### How to use

## Setup environment

Create a `.env` file in the root directory with the `.env.example` content and modify on your own

## Docker up

Docker container has 
- Postgres DB
- Hasura GraphQL Engine
- Hasura Data Connector Agent

Postgres DB will be restored automatically with the `./db/dummy_dump.sql`

Run container with
```
docker-compose up -d
```

## Import Hasura Scheme

Follow this instruction to install Hasura CLI - https://hasura.io/docs/2.0/hasura-cli/install-hasura-cli/

Use Hasura CLI to restore the schema
```shell
cd ./hasura && hasura metadata apply --admin-secret myadminsecret
```

Notice: If you want to export the schema, use the following command
```
hasura metadata export --admin-secret myadminsecret
```

## Run NodeJS server

```shell
npm run dev
# or
yarn dev
```

## Hasura Console

Follow http://localhost:8080/console/login to access Hasura Console

Please use the following credentials as Hasura Secret to login
```
myadminsecret
```

## Hasura GraphQL Engine

http://localhost:8080/v1/graphql

## Test

Please use Postman or Insomnia to test the API

### Routes

1. Register User
```
[json]
POST http://localhost:8000/api/user/register
Request: { email, password }
Response: { id, email }
```

2. Login User to get the access token
```
[json]
POST http://localhost:8000/api/user/login
Request: { email, password }
Response: { accessToken }
```

3. Upload file to Imgur (used by Hasura Action)
```
[json]
POST http://localhost:8000/api/upload/imgur
Request: {
	"action": {
        "name": "fileUpload"
    },
    "input": {
        "userId": "292018a7-b9f6-4389-a7a6-5a2fe871da2a",
        "base64": "Base64File=="
    },
    "request_query": "mutation($base64: String!) {\n            fileUpload(base64: $base64) {\n              url\n              mimetype\n              size\n            }\n        }",
    "transformed_request": null,
    "url": "http://host.docker.internal:8000/api/upload/imgur"
}

Response:
{
	"id": 3,
	"url": "https://i.imgur.com/z6XBu81.png",
	"created_at": "2025-01-22T19:13:31.047245+00:00",
	"tags": null,
	"collection_id": null,
	"author_uid": "292018a7-b9f6-4389-a7a6-5a2fe871da2a"
}
```

4. Upload file to the server manually
```
[multipart-form-data]
POST http://localhost:8000/api/upload/
Request: [field => file]
Response: { url }
```
This is a 3 times execution endpoint
1. Initiate the file upload via form
2. Send file as base64 string by using Graphql mutation to Hasura Action
3. Action will execute following link http://localhost:8000/api/upload/imgur with payload
4. http://localhost:8000/api/upload/imgur will return the response to the Hasura Action
5. But it will always return an error 
```
{
       "statusCode": 500,
       "error": "Internal Server Error",
       "message": "Cannot read properties of undefined (reading 'returning')"
}
```
when passing the correct result `{url, mimetype, size}` to the Hasura Action :-(

But, I think you know how fast it can be fixed, right? :-)
