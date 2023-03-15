import React from 'react';
import { useNavigate } from 'react-router-dom';
import ens from "./images/ens-logo.png";

export default function HomePage() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/domains');
  };

  return (
    <div className='home-page-container'>
      <h1 className='home-page-header'>New Dot Eth</h1>
      <p className='home-page-p'>.eth is taking over the world</p>
      <p className='home-page-p'>let's make it easier to onboard new users</p>
      <div className='ens-image-container'>
        <p className='home-page-p last'>powered by the</p>
        <img className='ens-image-home' src={ens} alt="enslogo" height="100"/>
        <p className='home-page-p last'>name wrapper</p>
    </div>
      <button className="header-button-main-page" onClick={handleButtonClick}>enter site</button>
    </div>
  );
}

