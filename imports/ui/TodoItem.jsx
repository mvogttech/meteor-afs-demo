import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Checkbox } from './components/checkbox';
import { Button } from './components/button';
import { X } from 'lucide-react';

export function TodoItem({ todo }) {
  const handleToggle = async () => {
    try {
      await Meteor.callAsync('todos.toggleComplete', todo._id);
    } catch (err) {
      console.error('Failed to toggle todo:', err);
    }
  };

  const handleRemove = async () => {
    try {
      await Meteor.callAsync('todos.remove', todo._id);
    } catch (err) {
      console.error('Failed to remove todo:', err);
    }
  };

  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        id={`todo-${todo._id}`}
      />
      <label
        htmlFor={`todo-${todo._id}`}
        className={`flex-1 cursor-pointer text-sm ${
          todo.completed
            ? 'text-muted-foreground line-through'
            : 'text-foreground'
        }`}
      >
        {todo.title}
      </label>
      {todo.created_at && (
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {formatRelativeTime(todo.created_at)}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleRemove}
      >
        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
}

function formatRelativeTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}
