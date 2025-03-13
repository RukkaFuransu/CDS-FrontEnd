import React from 'react';
import '../../pages/Custos.css';

const UserList = ({ filteredCosts }) => {
  return (
    <div className="licences-container">
      {filteredCosts.map((user) => (
        <div key={user.id} className="user-costs">
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Departamento:</strong> {user.department || 'Não informado'}</p>
          {user.officeLocation && user.officeLocation !== 'Não informado' && (
            <p><strong>Escritório:</strong> {user.officeLocation}</p>
          )}
          {user.jobTitle && user.jobTitle !== 'Não informado' && (
            <p><strong>Cargo:</strong> {user.jobTitle}</p>
          )}
          {user.zendesk && (
            <p className="zendesk-cost">
              <strong>Zendesk ({user.zendesk.charAt(0).toUpperCase() + user.zendesk.slice(1).toLowerCase()}): </strong>
              <span className="zendesk-price">
                R${user.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </p>
          )}
          <div className="licenses-list">
            {user.licenses.length > 0 ? (
              user.licenses.map((license, index) => (
                <div key={index} className="license-item">
                  <p><strong>{license.name}</strong>: R${license.price.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p>Sem Licenças</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;