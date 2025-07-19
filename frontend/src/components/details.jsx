import React, { useState, useEffect } from "react";
import axios from "axios";

function Details() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      try {
        const response = await axios.get(`http://localhost:2000/details?email=${email}`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserDetails();
  }, []);

  // Don't render until user is loaded
  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h1>Name: {user.name}</h1>
      <p>Email: {user.emailId}</p>
      <p>Phone No: {user.phoneNum}</p>
    </div>
  );
}

export default Details;
