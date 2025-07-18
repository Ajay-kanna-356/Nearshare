// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate(); // ✅ Declare here
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:2000/', { email, password }, {
        withCredentials: true
      });
      
      navigate('/home'); // ✅ Redirect after successful login
    } catch (error) {
      console.log(error)
      console.error('Login error:', error.response?.data || error.message);
      setErrorMsg(error.response?.data || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        /><br /><br />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        /><br /><br />

        <button type="submit">Login</button>
        &nbsp;&nbsp;
        <a href="/register">Register</a>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </form>
    </div>
  );
}

export default Login;
