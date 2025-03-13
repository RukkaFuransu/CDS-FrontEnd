import React, { useState } from 'react';
//import './LicenseSummary.css';

const LicenseSummary = ({ licenseSummary }) => {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  const toggleSummaryVisibility = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };

  return (
    <div className={`license-summary ${isSummaryVisible ? 'expanded' : 'minimized'}`}>
      <button onClick={toggleSummaryVisibility}>
        {isSummaryVisible ? 'Licenças' : 'Licenças'}
      </button>
      <div className={`license-summary-content ${isSummaryVisible ? 'expanded' : 'minimized'}`}>
        {isSummaryVisible && (
          licenseSummary.map((license, index) => (
            <div key={index} className="license-summary-item">
              <p>
                <strong>{license.name}</strong>: {license.quantity} x R${(license.totalPrice / license.quantity).toFixed(2)} = R${license.totalPrice.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LicenseSummary;