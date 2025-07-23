// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css files/login.css';
import Input from './inputbox';
import Button from './button';
import { Link } from 'react-router-dom';

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
      setErrorMsg(error.response?.data || 'Login failed');
    }
  };

  return (
    <div className='body'>
    <div className='box'>
      <h2>Login</h2>
      
      <form onSubmit={handleLogin}>
      <Input
        label="Email:"
        type="email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required 
        error={errorMsg.includes('email') ? errorMsg : ''}
      />

        <Input 
         label = "Password:"
         type="password"
         name="password"
         value= {password}
         onChange={e => setPassword(e.target.value)}
         required
        />

        <Button type="submit">Login</Button>
        &nbsp;&nbsp;
        <Link to="/register"><Button>Register</Button></Link>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </form>
    </div>
  </div>
  );
}

export default Login;
