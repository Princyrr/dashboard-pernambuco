import React, { useState, useMemo } from 'react';
import { municipalities, crimeTypes } from '../data/mockData.js';

const DataTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'totalCases', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Agregar dados por município
  const municipalityStats = useMemo(() => {
    const stats = municipalities.map(municipality => {
      const municipalityCrimes = data.filter(item => item.municipalityId === municipality.id);
      
      const crimeStats = crimeTypes.reduce((acc, crimeType) => {
        const crimeCases = municipalityCrimes
          .filter(item => item.crimeType === crimeType.id)
          .reduce((sum, item) => sum + item.cases, 0);
        acc[crimeType.id] = crimeCases;
        return acc;
      }, {});

      const totalCases = municipalityCrimes.reduce((sum, item) => sum + item.cases, 0);
      const rate = (totalCases / municipality.population) * 100000;

      return {
        ...municipality,
        ...crimeStats,
        totalCases,
        rate: Math.round(rate * 100) / 100
      };
    });

    // Filtrar por termo de busca
    const filtered = stats.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    return sorted;
  }, [data, sortConfig, searchTerm]);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'desc' ? '↓' : '↑';
  };

  return (
    <div className="data-table-container">
      <div className="data-table__header">
        <h3 className="data-table__title">Dados por Município</h3>
        <div className="data-table__search">
          <input
            type="text"
            placeholder="Buscar município..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Buscar município"
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className="sortable-header"
                role="button"
                tabIndex="0"
                aria-label="Ordenar por município"
              >
                Município {getSortIcon('name')}
              </th>
              <th 
                onClick={() => handleSort('population')}
                className="sortable-header"
                role="button"
                tabIndex="0"
                aria-label="Ordenar por população"
              >
                População {getSortIcon('population')}
              </th>
              <th 
                onClick={() => handleSort('totalCases')}
                className="sortable-header"
                role="button"
                tabIndex="0"
                aria-label="Ordenar por total de casos"
              >
                Total {getSortIcon('totalCases')}
              </th>
              <th 
                onClick={() => handleSort('rate')}
                className="sortable-header"
                role="button"
                tabIndex="0"
                aria-label="Ordenar por taxa"
              >
                Taxa/100k {getSortIcon('rate')}
              </th>
              {crimeTypes.map(crime => (
                <th 
                  key={crime.id}
                  onClick={() => handleSort(crime.id)}
                  className="sortable-header"
                  role="button"
                  tabIndex="0"
                  aria-label={`Ordenar por ${crime.name}`}
                >
                  {crime.name} {getSortIcon(crime.id)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {municipalityStats.map(municipality => (
              <tr key={municipality.id}>
                <td className="municipality-name">{municipality.name}</td>
                <td className="number-cell">{municipality.population.toLocaleString('pt-BR')}</td>
                <td className="number-cell total-cases">{municipality.totalCases}</td>
                <td className="number-cell rate-cell">{municipality.rate}</td>
                {crimeTypes.map(crime => (
                  <td key={crime.id} className="number-cell">
                    {municipality[crime.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-info">
        <p>Mostrando {municipalityStats.length} de {municipalities.length} municípios</p>
      </div>
    </div>
  );
};

export default DataTable;