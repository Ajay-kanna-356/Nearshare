import React, { useState } from 'react';
import '../css files/dropdown.css';

function Dropdown({ options, label, onChange, value }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSelect = (val, e) => {
    e.stopPropagation();
    if (typeof onChange === 'function') {
      onChange({ target: { value: val } });
    }
    setOpen(false);
  };

  return (
    <div className={`drop ${open ? 'visible opacity withBG' : ''}`} onClick={handleToggle}>
      <div className="option placeholder active">
        {options.find(opt => opt.value === value)?.name || label}
      </div>

      {open && (
        <>
          {/* Add default "Any" option */}
          <div
            className={`option ${value === '' ? 'active' : ''}`}
            data-value=""
            onClick={(e) => handleSelect('', e)}
          >
            {label}
          </div>

          {options.map((opt, i) => (
            <div
              key={i}
              className={`option ${value === opt.value ? 'active' : ''}`}
              data-value={opt.value}
              onClick={(e) => handleSelect(opt.value, e)}
            >
              {opt.name}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Dropdown;
