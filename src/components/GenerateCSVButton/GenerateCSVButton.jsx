import React from 'react';
import * as XLSX from 'xlsx';

const GenerateCSVButton = ({ filteredCosts }) => {
  const generateExcel = () => {
    const headers = ["Licenças", "Nome", "Email", "Departamento", "Escritório", "Cargo", "Microsoft", "Zendesk", "Total de Custo das Licenças"];
    
    const totalMicrosoft = filteredCosts.reduce((acc, user) => {
      const userMicrosoftCost = user.licenses.reduce((sum, license) => sum + license.price, 0);
      return acc + userMicrosoftCost;
    }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalZendesk = filteredCosts.reduce((acc, user) => {
      const userZendeskCost = user.price ? parseFloat(user.price) : 0;
      return acc + userZendeskCost;
    }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalCost = (parseFloat(totalMicrosoft.replace(/\./g, '').replace(',', '.')) + parseFloat(totalZendesk.replace(/\./g, '').replace(',', '.'))).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalRow = [
      "",
      "",
      "",
      "",
      "",
      "",
      `R$ ${totalMicrosoft}`,
      `R$ ${totalZendesk}`,
      `R$ ${totalCost}`
    ];

    const rows = filteredCosts.flatMap(user => {
      const userRows = user.licenses.map(license => {
        return [
          `${license.name} (R$ ${license.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
          user.name,
          user.email,
          user.department || 'Não informado',
          user.officeLocation || 'Não informado',
          user.jobTitle || 'Não informado',
          "",
          "",
          ""
        ];
      });

      if (user.zendesk) {
        userRows.push([
          `Zendesk (R$ ${user.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
          user.name,
          user.email,
          user.department || 'Não informado',
          user.officeLocation || 'Não informado',
          user.jobTitle || 'Não informado',
          "",
          "",
          ""
        ]);
      }

      return userRows;
    });

    const data = [
      headers,
      totalRow,
      ...rows
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Ajustar a largura das colunas automaticamente
    const maxLengths = data[0].map((_, colIndex) => Math.max(...data.map(row => (row[colIndex] || "").toString().length)));
    ws['!cols'] = maxLengths.map(length => ({ wch: length + 5 }));

    // Adicionar filtros
    ws['!autofilter'] = { ref: `A1:I${data.length}` };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Licencas");

    XLSX.writeFile(wb, "licencas.xlsx");
  };

  return (
    <button onClick={generateExcel} className="botao-csv">
      Baixar Excel
    </button>
  );
};

export default GenerateCSVButton;