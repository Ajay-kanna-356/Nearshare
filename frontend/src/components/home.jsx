import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css'; // Move your style here

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:2000/home', { withCredentials: true }) // You will create this route in Express
      .then(res => {
        setPosts(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch posts:', err);
      });
  }, []);

  return (
    <div>
      <button onClick={() => window.location.href = '/post'}>Post</button>
      <button onClick={() => window.location.href = '/searchpage'}>Search</button>
      <button onClick={() => window.location.href = '/history'}>My Posts</button>
      <button onClick={() => window.location.href = '/logout'}>Log Out</button>

      <div className="posts">
        {posts.map((post, index) => (
          <div className="post" key={index}>
            <button onClick={() => window.location.href = `/details?email=${post.emailId}`}>
              Get Details
            </button>
            <h2>{post.name}</h2>
            <br />
            <img src={`http://localhost:2000/${post.imgpath}`} alt="Post" />
            <h2>{post.username}</h2>
            <p>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
