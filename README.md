# CATS API

An api to manage cats and breeds.

## Getting Started

This section is intended for software developers. If you have rights to the repo, simply clone. If not, you may fork and clone the repo.

After you fork, you can clone:

```
git clone <clone url>
cd my-cat-api
npm install
```

## Environment Variables

You'll need to create a local **.env** file to store your application's secrets. Follow these steps to generate and store the secrets.

0. `PORT` - Create a `PORT` environment variable. Set the value to an unused port number for your machine.
1. `HOST` - Create a `HOST` environment variable. If you wish to run this code on your local machine, and you probably do, then set this value to `127.0.0.1`.

**.env** file example:

```
PORT=5000
HOST=127.0.0.1
```

## Start the api

Run the following command to start the api on the designated port.

```
npm start
```

## Endpoints

CRUD - Create (POST), Read (GET), Update (PATCH OR PUT), Delete (DELETE), List (GET), Search (GET)

## Create a cat - `POST /cats`

Add a cat to the collection cats by providing a new cat resource in the request body.

**Example**

```
POST /cats

{
    "id": "felix",
    "type": "cat",
    "name": "felix",
    "breed": "minx",
    "owner": "George Jefferson",
    "age": 10
}
```

## Get a single cat by id - `GET /cats/{id}`

Retrieve a single cat resource from the collection of cats.

**Example**

```
GET /cats/felix

{
    "id": "felix",
    "type": "cat",
    "name": "felix",
    "breed": "minx",
    "owner": "George Jefferson",
    "age": 10
}
```

## Update a cat - `PUT /cats/{id}`

**Example**

Let's update the entire cat resource and increase Felix's age from 10 to 11 years old.

```
PUT /cats/felix

{
    "id": "felix",
    "type": "cat",
    "name": "felix",
    "breed": "minx",
    "owner": "George Jefferson",
    "age": 11
}
```

## Patch/Update a cat - `PATCH /cats/{id}`

**Example**

Let's update the entire cat resource and increase Felix's age from 10 to 11 years old.

```
PATCH /cats/felix

{
    "age": 11
}
```

## Delete a cat - `DELETE /cats/{id}`

Delete a cat given an id.

**Example**

Let's update the entire cat resource and increase Felix's age from 10 to 11 years old.

```
DELETE /cats/felix
```
