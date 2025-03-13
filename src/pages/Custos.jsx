import React, { useEffect, useState } from 'react';
import Filter from '../components/Filter/filter.jsx';
import Loading from '../components/Loading/loading.jsx';
import Titulo from '../components/Titulo/Titulo.jsx';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import UserList from '../components/UserList/UserList.jsx';
import TotalCostBox from '../components/TotalCostBox/TotalCostBox.jsx';
import LicenseSummary from '../components/LicenseSummary/LicenseSummary.jsx';
import Logo from '../components/Logo/Logo.jsx';
import '../css/App.css';
import '../components/TotalCostBox/TotalCostBox.css';
import './Custos.css';
import '../components/LicenseSummary/LicenseSummary.css';
import '../components/Filter/filter.css';
import '../components/SearchBar/SearchBar.css';
import departmentData from '../../departamentos.json';

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

function Custos() {
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPage, setShowPage] = useState(false);
  const [filteredCosts, setFilteredCosts] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLicenses, setSelectedLicenses] = useState([]);
  const allLicenses = [...new Set(costs.flatMap(user => [...user.licenses.map(lic => lic.name), user.zendesk ? 'Zendesk' : null].filter(Boolean)))];
  const [totalCost, setTotalCost] = useState(0);
  const [totalMicrosoft, setTotalMicrosoft] = useState(0);
  const [totalZendesk, setTotalZendesk] = useState(0);
  const [licenseSummary, setLicenseSummary] = useState([]);

  const departmentPresets = departmentData.departmentPresets;

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL);
        const data = await response.json();
        const licenseCosts = data.map((user, index) => ({
          id: index,
          name: user.name,
          department: user.department,
          email: user.email,
          jobTitle: user.jobTitle,
          zendesk: user.zendesk,
          price: user.price ? parseFloat(user.price.replace('.', '').replace(',', '.')) : 0,
          officeLocation: user.officeLocation,
          licenses: user.licenses.map((license) => ({
            name: license.name,
            price: license.price,
          })),
        }));
  
        setCosts(licenseCosts);
        setFilteredCosts(licenseCosts);
        setUserCount(licenseCosts.length);
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => setShowPage(true), 500);
        }, 1000);
      } catch (error) {
        console.error('Erro ao buscar dados de custos:', error);
        setLoading(false);
      }
    };
    fetchCosts();
  }, []);

  useEffect(() => {
    setUserCount(filteredCosts.length);
  }, [filteredCosts]);

  const calculateTotalCost = () => {
    const total = filteredCosts.reduce((acc, user) => {
      const userCost = user.licenses.reduce((sum, license) => sum + license.price, 0);
      const zendeskCost = user.price ? parseFloat(user.price) : 0;
      return acc + userCost + zendeskCost;
    }, 0);
    setTotalCost(total);
  };

  const handleLicenseClick = (license) => {
    let updatedSelectedLicenses;

    if (selectedLicenses.includes(license)) {
      updatedSelectedLicenses = selectedLicenses.filter((lic) => lic !== license);
    } else {
      updatedSelectedLicenses = [...selectedLicenses, license];
    }

    setSelectedLicenses(updatedSelectedLicenses);

    if (updatedSelectedLicenses.length === 0) {
      setFilteredCosts(costs);
    } else {
      setFilteredCosts(
        costs.filter((user) =>
          user.licenses.some((lic) => updatedSelectedLicenses.includes(lic.name)) ||
          (user.zendesk && updatedSelectedLicenses.includes('Zendesk'))
        )
      );
    }
  };

  const calculateTotalMicrosoft = () => {
    const total = filteredCosts.reduce((acc, user) => {
      const userCost = user.licenses.reduce((sum, license) => sum + license.price, 0);
      return acc + userCost;
    }, 0);
    setTotalMicrosoft(total);
  };

  const calculateTotalZendesk = () => {
    const total = filteredCosts.reduce((acc, user) => {
      const zendeskCost = user.price ? parseFloat(user.price) : 0;
      return acc + zendeskCost;
    }, 0);
    setTotalZendesk(total);
  };

  const calculateLicenseSummary = () => {
    const summary = filteredCosts.flatMap(user => [
      ...user.licenses,
      ...(user.zendesk ? [{ name: 'Zendesk', price: user.price }] : []),
    ])
    .reduce((acc, license) => {
      const existingLicense = acc.find(item => item.name === license.name);
      if (existingLicense) {
        existingLicense.quantity += 1;
        existingLicense.totalPrice += license.price;
      } else {
        acc.push({ name: license.name, quantity: 1, totalPrice: license.price });
      }
      return acc;
    }, []);
    setLicenseSummary(summary);
  };

  useEffect(() => {
    calculateTotalCost();
    calculateTotalMicrosoft();
    calculateTotalZendesk();
    calculateLicenseSummary();
  }, [filteredCosts]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = costs.filter((user) => {
      const normalizedQuery = removeAccents(query);
      const normalizedName = removeAccents(user.name.toLowerCase());
      const normalizedEmail = removeAccents(user.email.toLowerCase());

      return normalizedName.includes(normalizedQuery) || normalizedEmail.includes(normalizedQuery);
    });

    setFilteredCosts(filteredData);
  };

  const handleDepartmentClick = (department) => {
    let updatedSelectedDepartments = [...selectedDepartments];
    
    if (selectedDepartments.includes(department)) {
      updatedSelectedDepartments = updatedSelectedDepartments.filter((dep) => {
        if (dep === department) return false;
        if (dep.startsWith(`${department}:`)) return false;
        return true;
      });
    } else {
      updatedSelectedDepartments.push(department);
    
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

  const departments = [
    ...new Set(costs.map((user) => user.department)),
  ].sort((a, b) => (a || '').localeCompare(b || ''));

  const toggleFilterVisibility = (visible) => {
    setFilterVisible(visible);
  };

  const handlePresetChange = (presetDepartments, isChecked) => {
    let updatedSelectedDepartments = [...selectedDepartments];
    
    if (isChecked) {
      const departmentsAndJobsAndOffices = presetDepartments.reduce((acc, department) => {
        const jobsAndOffices = costs
          .filter((user) => user.department === department)
          .flatMap((user) => {
            const officeLocation = user.officeLocation && user.officeLocation !== 'Não informado' ? `${department}:${user.officeLocation}` : null;
            const jobTitle = user.jobTitle && user.jobTitle !== 'Não informado' ? `${department}:${user.officeLocation}:${user.jobTitle}` : null;
            return [officeLocation, jobTitle].filter(Boolean);
          });
    
        return [...acc, department, ...jobsAndOffices];
      }, []);
    
      updatedSelectedDepartments = [...new Set([...updatedSelectedDepartments, ...departmentsAndJobsAndOffices])];
    } else {
      updatedSelectedDepartments = updatedSelectedDepartments.filter(
        (dep) => !presetDepartments.includes(dep) && !presetDepartments.some(preset => dep.startsWith(`${preset}:`))
      );
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

  const resetFilters = () => {
    setSelectedDepartments([]);
    setFilteredCosts(costs);
  };

  return (
    <div className="Custos">
      <Loading isLoading={loading} />
      {!loading && (
        <div className={`content ${showPage ? 'fade-enter-active' : ''}`}>
          <Titulo />
          <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} filteredCosts={filteredCosts} />
          <div className="user-count">
            <span></span>
            <p>Usuários: {userCount}</p>
          </div>
          <Filter
            departmentPresets={departmentPresets}
            selectedDepartments={selectedDepartments}
            handlePresetChange={handlePresetChange}
            departments={departments}
            handleDepartmentClick={handleDepartmentClick}
            selectedLicenses={selectedLicenses}
            handleLicenseClick={handleLicenseClick}
            allLicenses={allLicenses}
            filterVisible={filterVisible}
            toggleFilterVisibility={toggleFilterVisibility}
            costs={costs}
          />
          <UserList filteredCosts={filteredCosts} />
          <TotalCostBox totalCost={totalCost} totalMicrosoft={totalMicrosoft} totalZendesk={totalZendesk} />
          <LicenseSummary licenseSummary={licenseSummary} />
          <Logo />
        </div>
      )}
    </div>
  );
}

export default Custos;