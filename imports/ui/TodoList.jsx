import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from './hooks';
import { Todos } from '/imports/api/todos';
import { TodoItem } from './TodoItem';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/card';
import { Input } from './components/input';
import { Button } from './components/button';
import { Badge } from './components/badge';
import { Plus, Trash2, ListChecks, Database } from 'lucide-react';

export function TodoList() {
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed

  const { todos, totalCount, activeCount, completedCount, isLoading } = useTracker(() => {
    const filterQuery = filter === 'active'
      ? { completed: false }
      : filter === 'completed'
      ? { completed: true }
      : {};

    const allTodos = Todos.find({}).fetch();
    const filteredTodos = Todos.find(filterQuery, { sort: { created_at: -1 } }).fetch();

    return {
      todos: filteredTodos,
      totalCount: allTodos.length,
      activeCount: allTodos.filter(t => !t.completed).length,
      completedCount: allTodos.filter(t => t.completed).length,
      isLoading: false,
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await Meteor.callAsync('todos.insert', newTitle);
      setNewTitle('');
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await Meteor.callAsync('todos.clearCompleted');
    } catch (err) {
      console.error('Failed to clear completed:', err);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Info Banner */}
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 py-4">
          <Database className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This app uses <strong>PostgreSQL</strong> as its database via Meteor's AFS.
            The local PostgreSQL server was auto-started by <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">postgres-dev-server</code> &mdash; no setup required.
          </p>
        </CardContent>
      </Card>

      {/* Main Todo Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-6 w-6" />
                Todos
              </CardTitle>
              <CardDescription className="mt-1">
                {totalCount === 0
                  ? 'No todos yet. Add one below!'
                  : `${activeCount} remaining, ${completedCount} completed`}
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {totalCount} {totalCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Add todo form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="icon" disabled={!newTitle.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          {/* Filter tabs */}
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {[
              { key: 'all', label: 'All', count: totalCount },
              { key: 'active', label: 'Active', count: activeCount },
              { key: 'completed', label: 'Done', count: completedCount },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
                <span className="ml-1.5 text-xs opacity-60">({count})</span>
              </button>
            ))}
          </div>

          {/* Todo items */}
          <div className="space-y-1">
            {todos.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {filter === 'all'
                  ? 'No todos yet. Add one above!'
                  : filter === 'active'
                  ? 'All caught up!'
                  : 'No completed todos.'}
              </p>
            ) : (
              todos.map((todo) => (
                <TodoItem key={todo._id} todo={todo} />
              ))
            )}
          </div>
        </CardContent>

        {completedCount > 0 && (
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCompleted}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear completed ({completedCount})
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Schema Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">PostgreSQL Schema</CardTitle>
          <CardDescription>
            The <code className="font-mono text-xs">todos</code> table was auto-created from the collection schema:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
{`new Postgres.Collection('todos', {
  schema: {
    title:      { type: 'text', required: true },
    completed:  { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: 'now' },
  },
});`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
