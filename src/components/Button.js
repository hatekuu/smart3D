import React from 'react';

const Button = ({ onClick, children, style }) => {
  return (
    <button onClick={onClick} style={{ padding: '10px 20px', cursor: 'pointer', ...style }}>
      {children}
    </button>
  );
};

export default Button;