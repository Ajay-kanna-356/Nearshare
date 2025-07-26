import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from "./dropdown";
import Button from "./button";

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

  // Fix infinite loop by using status instead of posts
  useEffect(() => {
    fetchPosts();
  }, [status]); 

  const markAsSold = async (postId) => {
    try {
      const confirmed = window.confirm("Mark this post as sold?");
      if (!confirmed) return;

      await axios.post(`http://localhost:2000/mark_sold/${postId}`, {}, { withCredentials: true });

      // Update only the affected post
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
      <Dropdown 
        options={[
          { name: "All", value: "" },
          { name: "Active", value: "active" },
          { name: "Sold", value: "sold" },
          { name: "Expired", value: "expired" }
        ]}
        value={status}
        label="Filter by Status:"
        onChange={e => setStatus(e.target.value)}
      />

      <div className="posts">
        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          posts.map((post) => (
            <div className="post" key={post._id}>
              <h2>{post.name}</h2>
              <img src={`http://localhost:2000/${post.imgpath}`} alt={post.name} />
              <h2>{post.username}</h2>
              <p>{post.description}</p>

              {post.status === "active" && (
                <>
                  <p style={{ color: "green" }}><strong>Active</strong></p>
                  <Button onClick={() => markAsSold(post._id)}>Mark As Sold</Button>
                </>
              )}
              {post.status === "sold" && (
                <p style={{ color: "red" }}><strong>Sold</strong></p>
              )}
              {post.status === "expired" && (
                <p style={{ color: "gray" }}><strong>Expired</strong></p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;

