import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Todos } from '/imports/api/todos';

// With `autopublish` active, all Todos are automatically published.
// In production, you'd remove `autopublish` and add:
//
//   Meteor.publish('todos', function () {
//     return Todos.find({}, { sort: { created_at: -1 } });
//   });

Meteor.methods({
  async 'todos.insert'(title) {
    check(title, String);

    if (!title.trim()) {
      throw new Meteor.Error('empty-title', 'Title cannot be empty');
    }

    return Todos.insertAsync({
      title: title.trim(),
      completed: false,
      created_at: new Date(),
    });
  },

  async 'todos.toggleComplete'(todoId) {
    check(todoId, String);

    const todo = await Todos.findOneAsync(todoId);
    if (!todo) {
      throw new Meteor.Error('not-found', 'Todo not found');
    }

    return Todos.updateAsync(todoId, {
      $set: { completed: !todo.completed },
    });
  },

  async 'todos.remove'(todoId) {
    check(todoId, String);
    return Todos.removeAsync(todoId);
  },

  async 'todos.clearCompleted'() {
    return Todos.removeAsync({ completed: true });
  },
});

Meteor.startup(async () => {
  // Seed data on first run
  const count = await Todos.find().countAsync();
  if (count === 0) {
    console.log('Seeding initial todos...');
    const seed = [
      'Try out Meteor + PostgreSQL',
      'Explore the AFS collection API',
      'Build something amazing',
    ];
    for (const title of seed) {
      await Todos.insertAsync({
        title,
        completed: false,
        created_at: new Date(),
      });
    }
    console.log(`Seeded ${seed.length} todos.`);
  }
});
