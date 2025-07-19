// src/components/Register.jsx
import React, { useState } from "react";
import axios from "axios";

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
    <div>
      <h2>Register</h2>
      {error && <p style={{color:"red"}}>{error}</p>}
      {success && <p style={{color:"green"}}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required /><br /><br />

        <label>Phone no:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required /><br /><br />

        <label>Email-id:</label>
        <input type="text" name="email" value={formData.email} onChange={handleChange} required /><br /><br />

        <label>Create Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required /><br /><br />

        <label>Confirm Password:</label>
        <input type="password" name="cpassword" value={formData.cpassword} onChange={handleChange} required /><br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
