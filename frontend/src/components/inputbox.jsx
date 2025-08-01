import React from 'react';
import '../css files/input.css'; // optional if you're using custom styles

function Input({ label, type = 'text', value, onChange, name, placeholder, required, error,className = '' }) {
  return (
 
    <div className="input-group">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        required={required}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
      />
    </div>
  );
}

export default Input;
