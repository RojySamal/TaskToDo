import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );
      const foundUser = response.data[0];
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (userName, email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/users", {
        userName,
        email,
        password,
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
