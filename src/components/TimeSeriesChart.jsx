import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { crimeTypes } from '../data/mockData.js';

const TimeSeriesChart = ({ data = [], filters = {} }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="no-data">Nenhum dado disponível para os filtros selecionados.</p>;
  }

  // Determinar anos e meses do filtro ou padrão
  const currentYear = new Date().getFullYear();
  const years = filters.year ? [parseInt(filters.year)] : [currentYear - 2, currentYear - 1, currentYear];
  const months = filters.month ? [parseInt(filters.month)] : [1,2,3,4,5,6,7,8,9,10,11,12];

  // Inicializa todos os períodos com 0 para todos os crimes
  const aggregatedData = [];
  years.forEach(year => {
    months.forEach(month => {
      const periodData = { period: `${year}-${month.toString().padStart(2,'0')}`, date: new Date(year, month - 1, 1) };
      crimeTypes.forEach(crime => periodData[crime.id] = 0);
      aggregatedData.push(periodData);
    });
  });

  // Preenche os casos reais de forma segura
  data.forEach(item => {
    if (!item || item.year === undefined || item.month === undefined || !item.crimeType || item.cases === undefined) return;
    const key = `${item.year}-${item.month.toString().padStart(2,'0')}`;
    const period = aggregatedData.find(d => d.period === key);
    if (period) {
      period[item.crimeType] += item.cases;
    }
  });

  const chartData = aggregatedData.sort((a, b) => a.date - b.date);

  const formatTooltip = (value, name) => {
    const crimeType = crimeTypes.find(crime => crime.id === name);
    return [value, crimeType ? crimeType.name : name];
  };

  const formatXAxisLabel = (tickItem) => {
    const [year, month] = tickItem.split('-');
    return `${month}/${year.slice(-2)}`;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Evolução Temporal por Tipo de Crime</h3>
        <p className="chart-subtitle">Número de casos por mês</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxisLabel}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(label) => `Período: ${formatXAxisLabel(label)}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {crimeTypes.map(crime => (
              <Line
                key={crime.id}
                type="linear"
                dataKey={crime.id}
                stroke={crime.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={true}
                name={crime.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeSeriesChart;
