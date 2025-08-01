import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css files/Home.css'; 
import { useNavigate } from 'react-router-dom';
import Button from './button';
import Loading from './loading'; 

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // 🔸 Track loading
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:2000/home', { withCredentials: true })
      .then(res => {
        setPosts(res.data);
        setLoading(false); // 🔸 Done loading
      })
      .catch(err => {
        console.error('Failed to fetch posts:', err);
        setLoading(false); // 🔸 Still stop loading even if error
      });
  }, []);

  if (loading) return <Loading />; 

  return (
    <div>
      {/* 🔷 Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">NearShare</div>
        <div className="navbar-buttons">
          <Button onClick={() => navigate('/post')}>Post</Button>
          <Button onClick={() => navigate('/search')}>Search</Button>
          <Button onClick={() => navigate('/history')}>My Posts</Button>
          <Button onClick={() => navigate('/')}>Log Out</Button>
        </div>
      </nav>

      {/* 🔷 Posts Section */}
      <div className="posts">
        {posts.map((post, index) => (
          <div className="post" key={index}>
            <h2>{post.name}</h2>
            <br />
            <img src={`http://localhost:2000/${post.imgpath}`} alt="Post" />
            <h2>{post.username}</h2>
            <p>{post.description}</p>
            <Button onClick={() => navigate(`/details?id=${post._id}`)}>
              Get Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;