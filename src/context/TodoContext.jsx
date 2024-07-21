import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [dates, setDates] = useState([]); // Initialize dates as an empty array

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/todos");
        setTodos(response.data);

        // Extract unique dates from todos and set them
        const uniqueDates = [
          ...new Set(response.data.map((todo) => todo.date)),
        ];
        setDates(uniqueDates);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (todo) => {
    try {
      const response = await axios.post("http://localhost:5000/todos", todo);
      setTodos((prevTodos) => {
        const updatedTodos = [...prevTodos, response.data];

        // Update dates
        const newDate = response.data.date;
        const updatedDates = [
          ...new Set(updatedTodos.map((todo) => todo.date)),
        ];
        setDates(updatedDates);

        return updatedTodos;
      });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const updateTodo = async (updatedTodo) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === updatedTodo.id);
      if (!todoToUpdate) throw new Error("Todo not found");

      // Merge updated fields with existing fields
      const todoToSend = {
        ...todoToUpdate,
        title: updatedTodo.title,
        date: updatedTodo.date, // Update date
        completed: updatedTodo.completed,
      };

      await axios.put(
        `http://localhost:5000/todos/${updatedTodo.id}`,
        todoToSend
      );

      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.map((todo) =>
          todo.id === updatedTodo.id
            ? {
                ...todo,
                title: updatedTodo.title,
                date: updatedTodo.date, // Update date
                completed: updatedTodo.completed,
              }
            : todo
        );

        // Update dates if necessary
        const allDates = [...new Set(updatedTodos.map((todo) => todo.date))];
        setDates(allDates);

        return updatedTodos;
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.filter((todo) => todo.id !== id);

        // Update dates
        const remainingDates = [
          ...new Set(updatedTodos.map((todo) => todo.date)),
        ];
        setDates(remainingDates);

        return updatedTodos;
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <TodoContext.Provider
      value={{ todos, dates, addTodo, updateTodo, deleteTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => React.useContext(TodoContext);
