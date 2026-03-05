/**
 * Todos collection — backed by PostgreSQL via Meteor's AFS.
 *
 * This is the key difference from a traditional Meteor app:
 * instead of `new Mongo.Collection(...)`, we use `new Postgres.Collection(...)`.
 *
 * The `schema` option tells PostgreSQL which columns to create as native
 * typed columns. Any fields not listed in the schema are stored in the
 * `_extra` JSONB overflow column automatically.
 */
export const Todos = new Postgres.Collection('todos', {
  schema: {
    title:       { type: 'text', required: true },
    completed:   { type: 'boolean', default: false },
    created_at:  { type: 'timestamp', default: 'now' },
  },
});
