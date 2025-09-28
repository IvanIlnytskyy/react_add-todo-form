import './App.scss';
import React, { useState } from 'react';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  user?: User;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(
    todosFromServer.map(todo => ({
      ...todo,
      user: usersFromServer.find(u => u.id === todo.userId),
    })),
  );
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState<{ title?: string; userId?: string }>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: { title?: string; userId?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a title';
    }

    if (!userId) {
      newErrors.userId = 'Please choose a user';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    const newId = todos.length
      ? Math.max(...todos.map(todo => todo.id)) + 1
      : 1;
    const user = usersFromServer.find(u => u.id === +userId);

    const newTodo = {
      id: newId,
      title,
      completed: false,
      userId: +userId,
      user,
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setUserId('');
    setErrors({});
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄ0-9 ]/g, ''));
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
    if (errors.userId) {
      setErrors(prev => ({ ...prev, userId: undefined }));
    }
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={handleTitleChange}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userId}
            onChange={handleUserChange}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {errors.userId && <span className="error">{errors.userId}</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <section className="TodoList">
        {todos.map(todo => (
          <article
            key={todo.id}
            data-id={todo.id}
            className={`TodoInfo ${todo.completed ? 'TodoInfo--completed' : ''}`}
          >
            <h2 className="TodoInfo__title">{todo.title}</h2>

            <a className="UserInfo" href={`mailto:${todo.user?.email}`}>
              {todo.user?.name}
            </a>
          </article>
        ))}
      </section>
    </div>
  );
};
