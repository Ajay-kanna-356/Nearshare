import './App.css';

// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';
import Search from './components/search';
import SearchResults from './components/searchresult';
import Post from './components/post';
import History from './components/history';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/searchpage" element={<SearchResults />} />
      <Route path="/post" element={<Post />} />
      <Route path="/history" element={<History />} />

    </Routes>
  );
}

export default App;

