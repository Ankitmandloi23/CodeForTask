import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

const App = () => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Check if a token exists in local storage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSignup = async () => {
    try {
       //alert("yes");
      const response = await axios.post('http://localhost:5050/signup', {
        email: emailOrMobile,
        mobile: emailOrMobile,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5050/login', {
        emailOrMobile,
        password,
      });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5050/logout');
      setToken('');
      localStorage.removeItem('token');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleGetTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5050/dashboard', {
        headers: { Authorization: token },
      });
      setTodos(response.data.todos);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="container">
      {!token ? (
        <div className="auth-form">
          <h2>Signup</h2>
          <input
            type="text"
            placeholder="Email or Mobile"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" onClick={handleSignup}>
            Signup
          </button>

          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email or Mobile"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      ) : (
        <div className="dashboard">
          <h2>Dashboard</h2>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="btn" onClick={handleGetTodos}>
            Get Todos
          </button>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
