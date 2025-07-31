// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css files/login.css';
import Input from './inputbox';
import Button from './button';
import { Link } from 'react-router-dom';
import DarkVeil from '../reactbits/dark';

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
  <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
    
    {/* Background Component */}
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <DarkVeil />
    </div>

    {/* Centered Login Box */}
    <div className="box" style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.85)', // optional translucent background
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)'
    }}>
      <h2>Login</h2>
      
      <form onSubmit={handleLogin}>
        <Input
          className="full"
          label="Email:"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required 
          error={errorMsg.includes('email') ? errorMsg : ''}
        />

        <Input 
          className="full"
          label="Password:"
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <Button type="submit" className="reglog">Login</Button>
        &nbsp;&nbsp;
        <Link to="/register"><Button className="reglog">Register</Button></Link>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </form>
    </div>
  </div>
);
}
export default Login;