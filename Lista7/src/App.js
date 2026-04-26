import { createServer } from 'node:http';
import { createYoga, createSchema, createPubSub } from 'graphql-yoga';
import { readFileSync } from 'node:fs';
import { getDb } from './db.js';

// Utworzenie mechanizmu PubSub dla Subskrypcji/Eventów
const pubSub = createPubSub();

// Wczytanie definicji typów z pliku
const typeDefs = readFileSync('./src/schema.graphql', 'utf-8');

const resolvers = {
  Query: {
    users: async () => {
      const db = await getDb();
      return db.all('SELECT * FROM users');
    },
    todos: async () => {
      const db = await getDb();
      const todos = await db.all('SELECT * FROM todos');
      return todos.map(t => ({ ...t, completed: t.completed === 1 }));
    },
    user: async (_, args) => {
      const db = await getDb();
      return db.get('SELECT * FROM users WHERE id = ?', args.id);
    },
    todo: async (_, args) => {
      const db = await getDb();
      const todo = await db.get('SELECT * FROM todos WHERE id = ?', args.id);
      return todo ? { ...todo, completed: todo.completed === 1 } : null;
    }
  },
  
  Mutation: {
    addUser: async (_, args) => {
      const db = await getDb();
      const result = await db.run(
        'INSERT INTO users (name, email, login) VALUES (?, ?, ?)',
        [args.name, args.email, args.login]
      );
      const newUser = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);
      // Publikujemy event!
      pubSub.publish('userAdded', newUser);
      return newUser;
    },
    updateUser: async (_, args) => {
      const db = await getDb();
      const { id, ...fields } = args;
      const setClauses = [];
      const values = [];
      
      for (const [key, val] of Object.entries(fields)) {
        if (val !== undefined) {
          setClauses.push(`${key} = ?`);
          values.push(val);
        }
      }
      
      if (setClauses.length > 0) {
        values.push(id);
        await db.run(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`, values);
      }
      return db.get('SELECT * FROM users WHERE id = ?', id);
    },
    deleteUser: async (_, args) => {
      const db = await getDb();
      const result = await db.run('DELETE FROM users WHERE id = ?', args.id);
      return result.changes > 0;
    },
    
    addTodo: async (_, args) => {
      const db = await getDb();
      const result = await db.run(
        'INSERT INTO todos (title, completed, user_id) VALUES (?, ?, ?)',
        [args.title, args.completed ? 1 : 0, args.userId]
      );
      const newTodoRaw = await db.get('SELECT * FROM todos WHERE id = ?', result.lastID);
      const newTodo = { ...newTodoRaw, completed: newTodoRaw.completed === 1 };
      
      // Publikujemy event!
      pubSub.publish('todoAdded', newTodo);
      return newTodo;
    },
    updateTodo: async (_, args) => {
      const db = await getDb();
      const { id, title, completed } = args;
      
      const setClauses = [];
      const values = [];
      if (title !== undefined) {
        setClauses.push('title = ?');
        values.push(title);
      }
      if (completed !== undefined) {
        setClauses.push('completed = ?');
        values.push(completed ? 1 : 0);
      }
      
      if (setClauses.length > 0) {
        values.push(id);
        await db.run(`UPDATE todos SET ${setClauses.join(', ')} WHERE id = ?`, values);
      }
      
      const todo = await db.get('SELECT * FROM todos WHERE id = ?', id);
      return todo ? { ...todo, completed: todo.completed === 1 } : null;
    },
    deleteTodo: async (_, args) => {
      const db = await getDb();
      const result = await db.run('DELETE FROM todos WHERE id = ?', args.id);
      return result.changes > 0;
    }
  },
  
  Subscription: {
    userAdded: {
      subscribe: () => pubSub.subscribe('userAdded'),
      resolve: (payload) => payload
    },
    todoAdded: {
      subscribe: () => pubSub.subscribe('todoAdded'),
      resolve: (payload) => payload
    }
  },
  
  // Relacje
  User: {
    todos: async (parent) => {
      const db = await getDb();
      const todosList = await db.all('SELECT * FROM todos WHERE user_id = ?', parent.id);
      return todosList.map(t => ({ ...t, completed: t.completed === 1 }));
    }
  },
  ToDoItem: {
    user: async (parent) => {
      const db = await getDb();
      return db.get('SELECT * FROM users WHERE id = ?', parent.user_id);
    }
  }
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers
  }),
  // Po wejsciu w przegladarke pod / uruchomi sie nowe GraphiQL (nowa wersja "Playground")
  graphqlEndpoint: '/' 
});

const server = createServer(yoga);

// Inicjalizacja bazy i po niej start serwera
getDb().then(() => {
  server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000');
  });
});
