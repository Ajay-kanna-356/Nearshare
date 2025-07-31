import React, { useState } from 'react';
import '../css files/dropdown.css';

function Dropdown({ options, label, onChange, value }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  const handleSelect = (val, e) => {
    e.stopPropagation();
    if (typeof onChange === 'function') {
      onChange({ target: { value: val } });
    }
    setOpen(false);
  };

  return (
    <div className="drop" onClick={handleToggle}>
      <div className="option placeholder active">
        {options.find(opt => opt.value === value)?.name || label}
      </div>

      {open && (
        <div className="options-container">
          <div
            className={`option ${value === '' ? 'active' : ''}`}
            onClick={(e) => handleSelect('', e)}
          >
            {label}
          </div>

          {options.map((opt, i) => (
            <div
              key={i}
              className={`option ${value === opt.value ? 'active' : ''}`}
              onClick={(e) => handleSelect(opt.value, e)}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
