import React, { useState, useEffect } from "react";
import axios from "axios";

function History() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("");

  
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:2000/history`, {
        params: { status },
        withCredentials: true, 
      });
      setPosts(res.data.userposts);
    } catch (err) {
      console.error("Unable to retrieve User Post", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [status]); // refresh when status changes

  
  const markAsSold = async (postId) => {
  try {
    const confirmed = window.confirm("Mark this post as sold?");
    if (!confirmed) return;
    
    await axios.post(`http://localhost:2000/mark_sold/${postId}`, {}, { withCredentials: true });

    setPosts(prev =>
      prev.map(p => p._id === postId ? { ...p, status: 'sold' } : p)
    );

  } catch (err) {
    console.error("Error marking as sold", err);
  }
};


  return (
    <div>
      <h2>My Posts</h2>

      <label>Filter by Status: </label>
      <select value={status} onChange={ e=> setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="sold">Sold</option>
      </select>

      <div className="posts">
        {posts.length === 0 ? (
          <p>No posts have been posted</p>
        ) : (
          posts.map((post) => (
            <div className="post" key={post._id}>
              <h2>{post.name}</h2>
              <img src={`http://localhost:2000/${post.imgpath}`} alt={post.name} />
              <h2>{post.username}</h2>
              <p>{post.description}</p>

              {post.status === "active" ? (
                <>
                  <p style={{ color: "green" }}><strong>Active</strong></p>
                  <button onClick={() => markAsSold(post._id)}>Mark As Sold</button>
                </>
              ) : (
                <p style={{ color: "red" }}><strong>Sold</strong></p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;
