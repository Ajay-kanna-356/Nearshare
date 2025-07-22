import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { set } from "mongoose";
import Dropdown from "./dropdown";

function Post(){
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState(''); 
    const [category , setCategory] = useState('');
    const [condition , setCondition] = useState('');
    const [imgpath, setImgpath] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    
    
  const handlePost = async (e) => {
    if (loading) return;
    setLoading(true);
    e.preventDefault();

    //using formdata since img or files cannot be parsed in json 
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('condition', condition);
    formData.append('img', imgpath);

  try {
    const response = await axios.post('http://localhost:2000/post', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    navigate('/home');
  } catch (error) {
    console.error('Post Error:', error.response?.data || error.message);
    setErrorMsg(error.response?.data || 'Failed to post');
  }
  finally{
    setLoading(false);
  }
}
    
    return (
    <div>
      
      <form onSubmit={handlePost}>
        <label>Name</label>
        <input
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
          required
        /><br /><br />

        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        /><br /><br />
        
        <Dropdown options={[
        { name: "Accessories", value: "accessories" },
        { name: "Kitchen Products", value: "kitchen" },
        { name: "Furnitures", value: "furniture" },
        { name: "Clothes", value: "clothes" },
        { name: "Electronics", value: "electronics" }
      ]}  value={category} label="-- Category --" onchange={e => setCategory(e.target.value)}/>
        <br />

        <Dropdown
          options={[
            { name: "New", value: "new" },
            { name: "Used", value: "used" },
            { name: "Refurbished", value: "refurbished" }
          ]}
          value={condition}
          label="-- Any Condition --"
          onchange={e => setCondition(e.target.value)}
        />
        <br />
        
        <label>Add Image:</label>
        <input type="file" name="img" accept="image/*" onChange={e=> setImgpath(e.target.files[0])}/>
        <button type="submit" disabled={loading}>Post</button>
        &nbsp;&nbsp;
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </form>
    </div>
  );
}


export default Post;