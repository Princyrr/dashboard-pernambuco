import Papa from 'papaparse';

export const exportToCSV = (data, filename = 'dados_violencia_pe.csv') => {
  // Transformar dados para formato tabular
  const csvData = data.map(item => ({
    'Município': item.municipalityName,
    'Ano': item.year,
    'Mês': item.month,
    'Tipo de Crime': item.crimeTypeName,
    'Número de Casos': item.cases,
    'População': item.population,
    'Taxa por 100k hab': item.rate.toFixed(2)
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const formatNumber = (num) => {
  return num.toLocaleString('pt-BR');
};

export const formatRate = (rate) => {
  return `${rate.toFixed(1)}`;
};