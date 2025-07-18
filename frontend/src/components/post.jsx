import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { set } from "mongoose";

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
        
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">-- Category --</option>
          <option value="accessories">Accessories</option>
          <option value="kitchen">Kitchen Products</option>
          <option value="furniture">Furnitures</option>
          <option value="clothes">Clothes</option>
          <option value="electronics">Electronics</option>
        </select><br /><br />

        <select value={condition} onChange={e => setCondition(e.target.value)}>
            <option value="">--Any Condition--</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbised</option>
        </select>
        <br /><br />
        
        <label>Add Image:</label>
        <input type="file" name="img" accept="image/*" onChange={e=> setImgpath(e.target.files[0])}/>
        <br /><br />
        <button type="submit" disabled={loading}>Post</button>
        &nbsp;&nbsp;
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </form>
    </div>
  );
}


export default Post;