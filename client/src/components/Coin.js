import React from 'react';
import './Coin.css';

const Coin = ({ size }) => {
  const coinStyle = {
    height: size,
    width: size,
    '--coin_diam': size,

  };

  return (
    <div className="coin" style={coinStyle}>
      <div className="front"></div>
    </div>
  );
};

export default Coin;
