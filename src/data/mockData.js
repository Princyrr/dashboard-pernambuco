// Dados simulados para desenvolvimento
export const municipalities = [
  { id: 1, name: 'Recife', population: 1653461, lat: -8.0476, lng: -34.8770 },
  { id: 2, name: 'Jaboatão dos Guararapes', population: 706867, lat: -8.1130, lng: -35.0151 },
  { id: 3, name: 'Olinda', population: 393115, lat: -8.0089, lng: -34.8553 },
  { id: 4, name: 'Caruaru', population: 367217, lat: -8.2766, lng: -35.9819 },
  { id: 5, name: 'Petrolina', population: 354317, lat: -9.3891, lng: -40.5030 },
  { id: 6, name: 'Paulista', population: 329117, lat: -7.9407, lng: -34.8728 },
  { id: 7, name: 'Cabo de Santo Agostinho', population: 208758, lat: -8.2112, lng: -35.0349 },
  { id: 8, name: 'Camaragibe', population: 162551, lat: -8.0207, lng: -35.0371 },
  { id: 9, name: 'Garanhuns', population: 140577, lat: -8.8920, lng: -36.4955 },
  { id: 10, name: 'Vitória de Santo Antão', population: 140389, lat: -8.1186, lng: -35.2936 },
  { id: 11, name: 'Igarassu', population: 117019, lat: -7.8347, lng: -34.9058 },
  { id: 12, name: 'São Lourenço da Mata', population: 114079, lat: -8.0022, lng: -35.0198 },
  { id: 13, name: 'Santa Cruz do Capibaribe', population: 108251, lat: -7.9571, lng: -36.2071 },
  { id: 14, name: 'Abreu e Lima', population: 105050, lat: -7.9064, lng: -34.8967 },
  { id: 15, name: 'Ipojuca', population: 102492, lat: -8.3996, lng: -35.0623 }
];

export const crimeTypes = [
  { id: 'homicidio', name: 'Homicídio', color: '#dc2626' },
  { id: 'furto', name: 'Furto', color: '#ea580c' },
  { id: 'roubo', name: 'Roubo', color: '#d97706' },
  { id: 'estupro', name: 'Estupro', color: '#7c2d12' },
  { id: 'lesao_corporal', name: 'Lesão Corporal', color: '#92400e' }
];

// Fatores por município (maior = mais casos)
const municipalityFactor = {
  1: 1.7,   // Recife
  2: 1,   // Jaboatão
  3: 1.1, // Olinda
  4: 0.5, // Caruaru
  5: 0.6, // Petrolina
  6: 0.6, // Paulista
  7: 1,   // Cabo
  8: 1,   // Camaragibe
  9: 0.4, // Garanhuns
  10: 0.4, // Vitória
  11: 0.4, // Igarassu
  12: 0.4, // São Lourenço
  13: 0.4, // Santa Cruz
  14: 0.4, // Abreu e Lima
  15: 0.5  // Ipojuca
};

// Gerar dados simulados de crimes
const generateCrimeData = () => {
  const data = [];
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  municipalities.forEach(municipality => {
    years.forEach(year => {
      for (let month = 1; month <= 12; month++) {
        crimeTypes.forEach(crimeType => {
          const baseRate = {
            'homicidio': 5,
            'furto': 10,
            'roubo': 30,
            'estupro': 5,
            'lesao_corporal': 40
          }[crimeType.id];

          const populationFactor = municipality.population / 100000;
          const seasonalVariation = Math.sin((month - 1) * Math.PI / 6) * 0.3 + 1;
          const randomVariation = 0.7 + Math.random() * 0.6;

          const cases = Math.round(
            baseRate * populationFactor * seasonalVariation * randomVariation * municipalityFactor[municipality.id]
          );

          data.push({
            id: `${municipality.id}-${year}-${month}-${crimeType.id}`,
            municipalityId: municipality.id,
            municipalityName: municipality.name,
            year,
            month,
            crimeType: crimeType.id,
            crimeTypeName: crimeType.name,
            cases,
            population: municipality.population,
            rate: (cases / municipality.population) * 100000,
            date: new Date(year, month - 1, 1)
          });
        });
      }
    });
  });

  return data;
};

export const crimeData = generateCrimeData();

// Função para filtrar dados
export const filterData = (filters) => {
  return crimeData.filter(item => {
    if (filters.year && item.year !== parseInt(filters.year)) return false;
    if (filters.month && item.month !== parseInt(filters.month)) return false;
    if (filters.crimeType && filters.crimeType !== 'all' && item.crimeType !== filters.crimeType) return false;
    if (filters.municipality && filters.municipality !== 'all' && item.municipalityId !== parseInt(filters.municipality)) return false;
    return true;
  });
};

// Função para calcular KPIs
export const calculateKPIs = (data) => {
  const totalCases = data.reduce((sum, item) => sum + item.cases, 0);
  const homicides = data.filter(item => item.crimeType === 'homicidio').reduce((sum, item) => sum + item.cases, 0);
  const thefts = data.filter(item => item.crimeType === 'furto').reduce((sum, item) => sum + item.cases, 0);
  const rapes = data.filter(item => item.crimeType === 'estupro').reduce((sum, item) => sum + item.cases, 0);

  const totalPopulation = municipalities.reduce((sum, muni) => sum + muni.population, 0);
  const ratePerHundredThousand = (totalCases / totalPopulation) * 100000;

  return {
    totalCases,
    homicides,
    thefts,
    rapes,
    ratePerHundredThousand: Math.round(ratePerHundredThousand * 100) / 100
  };
};

export const months = [
  { value: '', label: 'Todos os meses' },
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' }
];
