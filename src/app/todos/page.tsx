'use client'

import useLocalStorage from '@/hooks/useLocalStorage'
import { useState, type FormEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import z from 'zod'

const TodoSchema = z.object({
  id: z.string(),
  done: z.boolean(),
  text: z.string(),
})
type Todo = z.infer<typeof TodoSchema>

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useLocalStorage({
    key: 'todolist',
    schema: z.array(TodoSchema),
    defaultValue: [],
  })

  const handleAddNewTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTodos((prev) => [...prev, { id: uuidv4(), text: newTodo, done: false }])
    setNewTodo('')
  }

  // const deleteTodo = (id: string) => {
  //   setTodos((prev) => prev.filter((todo) => todo.id !== id))
  // }

  const handleToggleTodo = (targetTodo: Todo) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === targetTodo.id) {
          return {
            ...todo,
            done: !todo.done,
          }
        }
        return todo
      }),
    )
  }

  return (
    <div>
      <h1>Todo List App</h1>
      <form onSubmit={handleAddNewTodo}>
        <input
          type='text'
          placeholder='Add a new todo'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type='submit'>Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type='checkbox'
              checked={todo.done}
              onChange={() => handleToggleTodo(todo)}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
