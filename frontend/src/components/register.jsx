// src/components/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import "../css files/login.css"
import Input from "./inputbox";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    cpassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (formData.password !== formData.cpassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:2000/register", formData, {
        withCredentials: true
      });

      if (res.status === 200) {
        setSuccess("Registration successful!");
        setError("");
        // redirect to login:
        window.location.href = "/"; 
      }
    } catch (err) {
      setError("Error during registration: " + err.response?.data || err.message);
      setSuccess("");
    }
  };

  return (
    <div className='body'>
    <div className='box'>      
    <h2>Register</h2>
      {error && <p style={{color:"red"}}>{error}</p>}
      {success && <p style={{color:"green"}}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <Input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Phone no:</label>
        <Input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Email-id:</label>
        <Input type="text" name="email" value={formData.email} onChange={handleChange} required />

        <label>Create Password:</label>
        <Input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Confirm Password:</label>
        <Input type="password" name="cpassword" value={formData.cpassword} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
    </div>
    </div>

  );
}

export default Register;
