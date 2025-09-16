import React, { useState, useMemo } from 'react';
import KPICard from './components/KPICard.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import TimeSeriesChart from './components/TimeSeriesChart.jsx';
import InteractiveMap from './components/InteractiveMap.jsx';
import DataTable from './components/DataTable.jsx';
import { filterData, calculateKPIs, crimeData } from './data/mockData.js';
import { exportToCSV } from './utils/exportUtils.js';
import './styles/main.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const [filters, setFilters] = useState({
    year: '',
    month: '',
    crimeType: 'all',
    municipality: 'all'
  });

  // Dados filtrados
  const filteredData = useMemo(() => {
    return filterData(filters);
  }, [filters]);

  // KPIs calculados
  const kpis = useMemo(() => {
    return calculateKPIs(filteredData);
  }, [filteredData]);

  // Manipular mudanças de filtro
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Exportar dados
  const handleExportCSV = () => {
    exportToCSV(filteredData, `violencia_pe_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Dashboard de Incidência de Violência</h1>
        <p className="dashboard__subtitle">Estado de Pernambuco(Dados Simulados)</p>
        <p className="dashboard__subtitle">Desenvolvido por Priscila Ramonna</p>
      </header>

      <main className="dashboard__content">
        {/* Filtros */}
        <section aria-labelledby="filters-title">
          <h2 id="filters-title" className="sr-only">Filtros de dados</h2>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onExportCSV={handleExportCSV}
          />
        </section>

        {/* KPIs */}
        <section aria-labelledby="kpis-title">
          <h2 id="kpis-title" className="sr-only">Indicadores principais</h2>
          <div className="kpi-grid">
            <KPICard
              title="Total de Ocorrências"
              value={kpis.totalCases.toLocaleString('pt-BR')}
              icon="📊"
              className="kpi-card--info"
            />
            <KPICard
              title="Homicídios"
              value={kpis.homicides.toLocaleString('pt-BR')}
              icon="🚨"
              className="kpi-card--danger"
            />
            <KPICard
              title="Furtos"
              value={kpis.thefts.toLocaleString('pt-BR')}
              icon="🔓"
              className="kpi-card--warning"
            />
            <KPICard
              title="Estupros"
              value={kpis.rapes.toLocaleString('pt-BR')}
              icon="⚠️"
              className="kpi-card--danger"
            />
            <KPICard
              title="Taxa por 100k hab"
              value={kpis.ratePerHundredThousand.toLocaleString('pt-BR')}
              subtitle="Todas as ocorrências"
              icon="📈"
              className="kpi-card--info"
            />
          </div>
        </section>

        {/* Gráfico temporal */}
        <section aria-labelledby="chart-title">
          <h2 id="chart-title" className="sr-only">Gráfico de evolução temporal</h2>
          <TimeSeriesChart data={filteredData} />
        </section>

        {/* Mapa */}
        <section aria-labelledby="map-title">
          <h2 id="map-title" className="sr-only">Mapa interativo</h2>
          <InteractiveMap 
            data={filteredData} 
            selectedCrime={filters.crimeType}
          />
        </section>

        {/* Tabela de dados */}
        <section aria-labelledby="table-title">
          <h2 id="table-title" className="sr-only">Tabela de dados por município</h2>
          <DataTable data={filteredData} />
        </section>
      </main>
    </div>
  );
}

export default App;