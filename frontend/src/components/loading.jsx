// Loading.jsx
import React from 'react';
import '../css files/loading.css'; 

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

export default Loading;
