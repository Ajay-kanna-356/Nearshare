import React from 'react';
import '../css files/input.css'; // optional if you're using custom styles

function Input({ label, type = 'text', value, onChange, name, placeholder, required, error }) {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input-field ${error ? 'input-error' : ''}`}
      />
    </div>
  );
}

export default Input;
