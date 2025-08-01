import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from './button';
import Loading from './loading'; 

function SearchResults() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const query = location.search;
        const res = await axios.get(`http://localhost:2000/search${query}`, {
          withCredentials: true
        });
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching search results:", err);
          setLoading(false);
      }
    };
    fetchResults();
  }, [location.search]);
  
if (loading) return <Loading />;

  return (
    <div>
      <Button className='searchbtn' onClick={()=>navigate('/search')}>Search</Button>  
      <h2>{posts.length} Results Found</h2>
      {posts.length === 0 ? (
        <p>No results found</p>
      ) : (
        <div className="posts">
          {posts.map(post => (
            <div className="post" key={post._id}>
              <h2>{post.name}</h2>
              <img src={`http://localhost:2000/${post.imgpath}`} alt={post.name} />
              <h3>{post.username}</h3>
              <p>{post.description}</p>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .posts {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 20px;
          justify-content: center;
        }
        .post {
          width: 300px;
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 10px;
          box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
          text-align: center;
          background-color: #f9f9f9;
        }
        .post img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}

export default SearchResults;