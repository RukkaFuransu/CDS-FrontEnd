import React, { useState, useRef, useEffect } from 'react';
//import './filter.css';

const Filter = ({
  departmentPresets,
  selectedDepartments,
  handlePresetChange,
  departments,
  handleDepartmentClick,
  selectedLicenses,
  handleLicenseClick,
  allLicenses,
  filterVisible,
  toggleFilterVisibility,
  costs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOffices, setExpandedOffices] = useState({});
  const [licenseSearchQuery, setLicenseSearchQuery] = useState('');
  const [expandedPresets, setExpandedPresets] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [expandedJobs, setExpandedJobs] = useState({});
  const buttonRef = useRef(null);
  const filterRef = useRef(null);

  // Função para verificar se há usuários ativos em um departamento específico
  const hasActiveUsersInDepartment = (department) => {
    return costs.some((user) => user.department === department);
  };

  // Função para verificar se um preset tem pelo menos um departamento com usuários ativos
  const hasActiveUsersInPreset = (presetDepartments) => {
    return presetDepartments.some((department) =>
      hasActiveUsersInDepartment(department)
    );
  };

  const filteredDepartments = departments.filter((department) =>
    department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLicenses = allLicenses.filter((license) =>
    license.toLowerCase().includes(licenseSearchQuery.toLowerCase())
  );

  const togglePresetExpansion = (presetName) => {
    setExpandedPresets((prevState) => ({
      ...prevState,
      [presetName]: !prevState[presetName],
    }));
  };

  const toggleJobExpansion = (jobName) => {
    setExpandedJobs((prevState) => ({
      ...prevState,
      [jobName]: !prevState[jobName],
    }));
  };

  const handleDepartmentClickWithJob = (department, officeLocation, jobTitle) => {
    handleDepartmentClick(department);  // Marca o departamento
    handleDepartmentClick(`${department}:${officeLocation}`);  // Marca o escritório
    handleDepartmentClick(`${department}:${officeLocation}:${jobTitle}`);  // Marca o cargo
  };

  const toggleDepartmentExpansion = (departmentName) => {
    setExpandedDepartments((prevState) => ({
      ...prevState,
      [departmentName]: !prevState[departmentName],
    }));
  };

  const handlePresetChangeWithJobs = (presetDepartments, isChecked) => {
    const departmentsToAdd = [];
    const jobsToAdd = [];
    const officesToAdd = [];

    presetDepartments.forEach((department) => {
      if (hasActiveUsersInDepartment(department)) { // Só adiciona se houver usuários ativos
        departmentsToAdd.push(department);
        const jobTitles = [...new Set(costs
          .filter((user) => user.department === department && user.officeLocation && user.officeLocation !== 'Não informado')
          .map((user) => `${department}:${user.officeLocation}`))];
        jobsToAdd.push(...jobTitles);

        jobTitles.forEach((officeLocation) => {
          const offices = [...new Set(costs
            .filter((user) => user.department === department && user.officeLocation === officeLocation.split(':')[1] && user.jobTitle)
            .map((user) => `${department}:${officeLocation}:${user.jobTitle}`))];
          officesToAdd.push(...offices);
        });
      }
    });

    handlePresetChange([...departmentsToAdd, ...jobsToAdd, ...officesToAdd], isChecked);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        toggleFilterVisibility(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleFilterVisibility]);

  const toggleOfficeExpansion = (officeName) => {
    setExpandedOffices((prevState) => ({
      ...prevState,
      [officeName]: !prevState[officeName],
    }));
  };

  return (
    <div>
      <button ref={buttonRef} onClick={toggleFilterVisibility} className="filter-button">
        Filtrar
      </button>
      <div ref={filterRef} className={`floating-filter ${filterVisible ? 'active' : ''}`}>
        <div>
          <h4>Presets</h4>
          {departmentPresets
            .filter((preset) => hasActiveUsersInPreset(preset.departments)) // Filtra presets com pelo menos um departamento ativo
            .map((preset, index) => (
              <div key={index} className="preset-container">
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span 
                    className="expand-symbol" 
                    onClick={() => togglePresetExpansion(preset.name)} 
                    style={{ cursor: 'pointer', marginRight: '8px' }}
                  >
                    {expandedPresets[preset.name] ? (
                      <span style={{ marginLeft: '2px', marginRight: '2px', verticalAlign: 'super' }}>-</span>
                    ) : (
                      <span style={{ verticalAlign: 'super' }}>+</span>
                    )}
                  </span>
                  <label className="preset-item" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <input
                      type="checkbox"
                      onChange={(e) => handlePresetChangeWithJobs(preset.departments, e.target.checked)}
                    />
                    <span>{preset.name}</span>
                  </label>
                </div>
                <div className={`expanded-departments ${expandedPresets[preset.name] ? 'active' : ''}`}>
                  {preset.departments
                    .filter((department) => hasActiveUsersInDepartment(department)) // Filtra departamentos com usuários ativos
                    .map((department, depIndex) => {
                      const jobTitles = [...new Set(costs
                        .filter((user) => user.department === department && user.officeLocation && user.officeLocation !== 'Não informado')
                        .map((user) => user.officeLocation))];

                      const jobsWithNoOffice = [...new Set(costs
                        .filter((user) => user.department === department && user.officeLocation === 'Não informado' && user.jobTitle && user.jobTitle !== 'Não informado')
                        .map((user) => user.jobTitle))];

                      return (
                        <div key={depIndex} className="department-container">
                          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <span
                              className="expand-symbol"
                              onClick={() => toggleDepartmentExpansion(department)}
                              style={{
                                cursor: 'pointer',
                                marginRight: '8px',
                                transform: 'translateY(-5px)',
                              }}
                            >
                              {expandedDepartments[department] ? (
                                <span style={{ marginLeft: '-2px', marginRight: '5px' }}>v</span>
                              ) : (
                                '>'
                              )}
                            </span>
                            <label className="department-item" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                              <input
                                type="checkbox"
                                checked={selectedDepartments.includes(department)}
                                onChange={() => handleDepartmentClick(department)}
                              />
                              <span>{department}</span>
                            </label>
                          </div>
                          <div className={`expanded-jobs ${expandedDepartments[department] ? 'active' : ''}`} style={{ marginLeft: '30px' }}>
                            {jobTitles.map((officeLocation, jobIndex) => {
                              const offices = [...new Set(costs
                                .filter((user) => 
                                  user.department === department && 
                                  user.officeLocation === officeLocation && 
                                  user.jobTitle && 
                                  user.jobTitle !== 'Não informado'
                                )
                                .map((user) => user.jobTitle))];

                              const hasJobTitles = offices.length > 0;

                              return (
                                <div key={jobIndex}>
                                  <div className="job-container" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    {hasJobTitles ? (
                                      <span
                                        className="expand-symbol"
                                        onClick={() => toggleJobExpansion(`${department}:${officeLocation}`)}
                                        style={{ cursor: 'pointer', marginRight: '8px', transform: 'translateY(-5px)', flexShrink: 0 }}
                                      >
                                        {expandedJobs[`${department}:${officeLocation}`] ? (
                                          <span style={{ marginLeft: '1px', marginRight: '1px' }}>v</span>
                                        ) : (
                                          '>'
                                        )}
                                      </span>
                                    ) : (
                                      <span style={{ marginRight: '18px', flexShrink: 0 }}></span>
                                    )}
                                    <label className="job-item" style={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
                                      <input
                                        type="checkbox"
                                        checked={selectedDepartments.includes(`${department}:${officeLocation}`)}
                                        onChange={() => handleDepartmentClick(`${department}:${officeLocation}`, true)}
                                        style={{ flexShrink: 0 }}
                                      />
                                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{officeLocation}</span>
                                    </label>
                                  </div>
                                  {hasJobTitles && expandedJobs[`${department}:${officeLocation}`] && (
                                    <div className="expanded-offices" style={{ marginLeft: '60px' }}>
                                      {offices.map((office, officeIndex) => (
                                        <div key={officeIndex} className="office-container" style={{ display: 'flex', alignItems: 'center', width: '160%' }}>
                                          <label className="office-item" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <span style={{ marginLeft: '-2px', marginRight: '5px' }}>↳</span>
                                            <input
                                              type="checkbox"
                                              checked={selectedDepartments.includes(`${department}:${officeLocation}:${office}`)}
                                              onChange={() => handleDepartmentClick(`${department}:${officeLocation}:${office}`, true)}
                                            />
                                            <span style={{ 
                                              overflow: 'visible',
                                              whiteSpace: 'normal',
                                              minWidth: '100px',
                                              flexGrow: 1,
                                            }}>
                                              {office}
                                            </span>
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {jobsWithNoOffice.length > 0 && (
                              <div>
                                <div className="job-container" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                  <span
                                    className="expand-symbol"
                                    onClick={() => toggleJobExpansion(`${department}:Não informado`)}
                                    style={{ cursor: 'pointer', marginRight: '8px', transform: expandedJobs[`${department}:Não informado`] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                  >
                                    {expandedJobs[`${department}:Não informado`] ? (
                                      <span style={{ marginLeft: '1px', marginRight: '1px' }}>v</span>
                                    ) : (
                                      '>'
                                    )}
                                  </span>
                                  <label className="job-item" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <input
                                      type="checkbox"
                                      checked={selectedDepartments.includes(`${department}:Não informado`)}
                                      onChange={() => handleDepartmentClick(`${department}:Não informado`, true)}
                                    />
                                    <span>Não informado</span>
                                  </label>
                                </div>
                                {expandedJobs[`${department}:Não informado`] && (
                                  <div className="expanded-offices" style={{ marginLeft: '60px' }}>
                                    {jobsWithNoOffice.map((job, jobIndex) => (
                                      <div key={jobIndex} className="office-container" style={{ display: 'flex', alignItems: 'center', width: '160%' }}>
                                        <label className="office-item" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                          <span style={{ marginLeft: '-2px', marginRight: '5px' }}>↳</span>
                                          <input
                                            type="checkbox"
                                            checked={selectedDepartments.includes(`${department}:Não informado:${job}`)}
                                            onChange={() => handleDepartmentClick(`${department}:Não informado:${job}`, true)}
                                          />
                                          <span>{job}</span>
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>

        <div>
          <h4>Todos</h4>
          <input
            type="text"
            className="pesquisa"
            placeholder="Buscar departamento"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {filteredDepartments.map((department, index) => (
            <label key={index} className="department-item">
              <input
                type="checkbox"
                checked={selectedDepartments.includes(department)}
                onChange={() => handleDepartmentClick(department)}
              />
              <span>{department || 'Não informado'}</span>
            </label>
          ))}
        </div>

        <div>
          <h4>Licenças</h4>
          <input
            type="text"
            className="pesquisa"
            placeholder="Buscar licença"
            value={licenseSearchQuery}
            onChange={(e) => setLicenseSearchQuery(e.target.value)}
          />
          {filteredLicenses.map((license, index) => (
            <label key={index} className="department-item">
              <input
                type="checkbox"
                checked={selectedLicenses.includes(license)}
                onChange={() => handleLicenseClick(license)}
              />
              <span>{license}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;