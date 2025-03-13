import React from 'react';
//import './TotalCostBox.css';

const TotalCostBox = ({ totalCost, totalMicrosoft, totalZendesk }) => {
  return (
    <>
      <div className="total-cost-box">
        <p>Total de Custo das Licenças: R${totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="total-microsoft-box">
        <p>Microsoft: R${totalMicrosoft.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="total-zendesk-box">
        <p>Zendesk: R${totalZendesk.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    </>
  );
};

export default TotalCostBox;