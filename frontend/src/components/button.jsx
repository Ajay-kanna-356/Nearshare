// Button.jsx
import React from 'react';
import '../css files/button.css';

function Button({ children, onClick, type = 'button', disabled = false, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`default-button ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
