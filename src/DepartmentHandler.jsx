import React from 'react';

const DepartmentHandler = ({ costs, selectedDepartments, setSelectedDepartments, setFilteredCosts }) => {
  const handleDepartmentClick = (department) => {
    let updatedSelectedDepartments = [...selectedDepartments];
    
    if (selectedDepartments.includes(department)) {
      // Remove o departamento e os cargos e escritórios relacionados
      updatedSelectedDepartments = updatedSelectedDepartments.filter((dep) => {
        if (dep === department) return false;
        if (dep.startsWith(`${department}:`)) return false;
        return true;
      });
    } else {
      updatedSelectedDepartments.push(department);
    
      // Adiciona cargos e escritórios relacionados ao departamento
      const relatedJobTitlesAndOffices = costs
        .filter((user) => user.department === department)
        .flatMap((user) => {
          const officeLocation = user.officeLocation && user.officeLocation !== 'Não informado' ? `${department}:${user.officeLocation}` : `${department}:Não informado`;
          const jobTitle = user.jobTitle && user.jobTitle !== 'Não informado' ? `${department}:${user.officeLocation}:${user.jobTitle}` : `${department}:${user.officeLocation}:Não informado`;
          return [officeLocation, jobTitle];
        });
    
      updatedSelectedDepartments = [...new Set([...updatedSelectedDepartments, ...relatedJobTitlesAndOffices])];
    }
    
    setSelectedDepartments(updatedSelectedDepartments);
    
    if (updatedSelectedDepartments.length === 0) {
      setFilteredCosts(costs);
    } else {
      setFilteredCosts(
        costs.filter((user) =>
          updatedSelectedDepartments.includes(user.department) ||
          updatedSelectedDepartments.includes(`${user.department}:${user.officeLocation}`) ||
          updatedSelectedDepartments.includes(`${user.department}:${user.officeLocation}:${user.jobTitle}`)
        )
      );
    }
  };

  return null; // Este componente não renderiza nada, apenas encapsula a lógica
};

export default DepartmentHandler;