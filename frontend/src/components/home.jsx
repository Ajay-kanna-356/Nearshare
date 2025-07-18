import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css'; 
import { useNavigate } from 'react-router-dom';


function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate()
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
      <button onClick={()=> navigate('/post')}>Post</button>
      <button onClick={()=> navigate('/search')}>Search</button>
      <button onClick={()=> navigate('/history')}>My Posts</button>
      <button onClick={()=> navigate('/')}>Log Out</button>

      <div className="posts">
        {posts.map((post, index) => (
          <div className="post" key={index}>
            
            <h2>{post.name}</h2>
            <br />
            <img src={`http://localhost:2000/${post.imgpath}`} alt="Post" />
            <h2>{post.username}</h2>
            <p>{post.description}</p>
            <button onClick={() => window.location.href = `/details?email=${post.emailId}`}>
              Get Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
