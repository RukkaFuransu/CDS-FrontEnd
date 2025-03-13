import React, { useEffect, useState } from 'react';
import './loading.css'; // Certifique-se de que o CSS está correto

const Loading = ({ isLoading }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
    }
  }, [isLoading]);

  return (
    <div className={`loading-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <img src="/loading.gif" alt="Carregando..." className="loading-gif" />
    </div>
  );
};

export default Loading;