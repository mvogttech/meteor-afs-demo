# Meteor + AFS + PostgreSQL Demo

https://forums.meteor.com/t/adaptive-federated-streams-afs/64484

A working Meteor app using PostgreSQL instead of MongoDB. No extra config, no external database to install — just `meteor run` and it works.

https://github.com/mvogttech/meteor-afs-demo/raw/main/.assets/demo.mp4

## What is this?

This is a todo app. It's deliberately boring — the point isn't the app, it's what's behind it.

Instead of `new Mongo.Collection('todos')`, the collection is defined like this:

```js
const Todos = new Postgres.Collection("todos", {
  schema: {
    title: { type: "text", required: true },
    completed: { type: "boolean", default: false },
    created_at: { type: "timestamp", default: "now" },
  },
});
```

That's a real PostgreSQL table with typed columns. And the rest of the app — methods, publications, client-side queries — looks exactly like any other Meteor app. Because it _is_ a normal Meteor app. The database just happens to be PostgreSQL.

## How it works

This demo uses **AFS (Adaptive Federated Streams)**, an experimental abstraction layer that separates Meteor's reactive collection API from the database behind it. The `postgres` package implements AFS's `StreamProvider` interface, translating MongoDB-style selectors into SQL and using PostgreSQL's LISTEN/NOTIFY for reactivity.

The client has no idea what database is on the server. It uses Minimongo and DDP like always.

On first run, Meteor will:

- Download a PostgreSQL binary automatically (takes a minute the first time)
- Initialize a local data directory at `.meteor/local/pgdata/`
- Start PostgreSQL on port 3002 (your app port + 2)
- Create the `todos` table from the collection schema
- Seed a few sample todos

The app runs at `http://localhost:3000`. Everything — inserts, toggles, deletes, reactivity — hits PostgreSQL.

## The interesting parts

**`imports/api/todos.js`** — This is where the magic happens. One line, and you have a reactive PostgreSQL collection with a typed schema. Fields not listed in the schema get stored in a `_extra` JSONB overflow column automatically.

**`server/main.js`** — Normal Meteor methods. `insertAsync`, `updateAsync`, `removeAsync`, `findOneAsync` — the same API you'd use with `Mongo.Collection`. The `$set` modifier in `toggleComplete` gets compiled to a SQL UPDATE.

**`.meteor/packages`** — Three packages make this work: `afs` (the abstraction layer), `postgres` (the provider), and `postgres-dev-server` (zero-config local PostgreSQL). The app also uses `autopublish` and `insecure` for simplicity.

## What this is not

This is a proof-of-concept. It's a demonstration that Meteor's reactive model is more general than MongoDB, and that decoupling them is both possible and natural.
