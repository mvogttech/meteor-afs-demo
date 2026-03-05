import React from 'react';
import { TodoList } from './TodoList';
import { Badge } from './components/badge';

export function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              Meteor + PostgreSQL
            </h1>
            <Badge variant="secondary">AFS Demo</Badge>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            postgres-dev-server
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <TodoList />
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Zero-config PostgreSQL &mdash; just <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">meteor add postgres postgres-dev-server</code>
        </div>
      </footer>
    </div>
  );
}
