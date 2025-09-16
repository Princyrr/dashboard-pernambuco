import React from 'react';
import { municipalities, crimeTypes, months } from '../data/mockData.js';

const FilterPanel = ({ filters, onFilterChange, onExportCSV }) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  return (
    <div className="filter-panel">
      <div className="filter-panel__row">
        <div className="filter-group">
          <label htmlFor="year-filter" className="filter-label">Ano</label>
          <select
            id="year-filter"
            className="filter-select"
            value={filters.year || ''}
            onChange={(e) => onFilterChange('year', e.target.value)}
          >
            <option value="">Todos os anos</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="month-filter" className="filter-label">Mês</label>
          <select
            id="month-filter"
            className="filter-select"
            value={filters.month || ''}
            onChange={(e) => onFilterChange('month', e.target.value)}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="crime-filter" className="filter-label">Tipo de Crime</label>
          <select
            id="crime-filter"
            className="filter-select"
            value={filters.crimeType || 'all'}
            onChange={(e) => onFilterChange('crimeType', e.target.value)}
          >
            <option value="all">Todos os crimes</option>
            {crimeTypes.map(crime => (
              <option key={crime.id} value={crime.id}>{crime.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="municipality-filter" className="filter-label">Município</label>
          <select
            id="municipality-filter"
            className="filter-select"
            value={filters.municipality || 'all'}
            onChange={(e) => onFilterChange('municipality', e.target.value)}
          >
            <option value="all">Todos os municípios</option>
            {municipalities.map(muni => (
              <option key={muni.id} value={muni.id}>{muni.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-panel__actions">
        <button
          className="btn btn--secondary"
          onClick={onExportCSV}
          title="Exportar dados filtrados para CSV"
        >
          📊 Exportar CSV
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;