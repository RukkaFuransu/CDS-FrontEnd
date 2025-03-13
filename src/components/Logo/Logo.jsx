import React from 'react';

const Logo = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '20px',
        width: '100px',
        height: 'auto'
      }}
    >
      <img
        src="/audaces.png"
        alt="Logo"
        style={{
          width: '40%',
          height: 'auto',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default Logo;