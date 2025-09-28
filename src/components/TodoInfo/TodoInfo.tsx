import React from 'react';
import { Todo } from '../../types';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => (
  <article
    data-id={todo.id}
    className={`TodoInfo ${todo.completed ? 'TodoInfo--completed' : ''}`}
  >
    <h2 className="TodoInfo__title">{todo.title}</h2>

    {todo.user?.email ? (
      <a className="UserInfo" href={`mailto:${todo.user?.email}`}>
        {todo.user?.name}
      </a>
    ) : (
      <span className="UserInfo">{todo.user?.name ?? 'Unknown user'}</span>
    )}
  </article>
);
