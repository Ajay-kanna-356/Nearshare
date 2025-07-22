import React from 'react';

function Dropdown({options,label,onchange,value}){
    return(
        <div className='dropdown'>
        <select value={value} onChange={onchange}>
          <option value="">{label}</option>
          {options.map(opt => (
            <option value={opt.value}>{opt.name}</option>
          ))}
        </select>
        </div>
    )
}

export default Dropdown