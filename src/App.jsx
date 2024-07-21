import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TodoProvider } from "./context/TodoContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TodoPage from "./pages/ToDoPage";

const App = () => (
  <Router>
    <AuthProvider>
      <TodoProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/todo" element={<TodoPage />} />
        </Routes>
      </TodoProvider>
    </AuthProvider>
  </Router>
);

export default App;
