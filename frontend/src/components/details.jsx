import React, { useState, useEffect } from "react";
import axios from "axios";

function Details() {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get("id");

      try {
        const response = await axios.get(`http://localhost:2000/details?id=${postId}`, {
          withCredentials: true,
        });

        setPost(response.data.post);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    fetchPostDetails();
  }, []);

  if (!post) {
    return <p>Loading post details...</p>;
  }

  return (
    <div>
      <h1>Post: {post.name}</h1>
      <p><strong>Description:</strong> {post.description}</p>
      <p><strong>Posted by:</strong> {post.username} ({post.emailId})</p>
      <p><strong>Phone:</strong> {post.phoneNum || "Not Available"}</p>
      <p><strong>Address:</strong> {post.address}</p>
      <p><strong>Status:</strong> {post.status}</p>
    </div>
  );
}

export default Details;
