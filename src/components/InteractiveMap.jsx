import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { municipalities } from '../data/mockData.js';

// Componente para ajustar o zoom do mapa
const MapController = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, bounds]);
  
  return null;
};

const InteractiveMap = ({ data, selectedCrime }) => {
  const [mapBounds, setMapBounds] = useState(null);

  // Calcular intensidade de crimes por município
  const municipalityData = municipalities.map(municipality => {
    const municipalityCrimes = data.filter(item => 
      item.municipalityId === municipality.id &&
      (!selectedCrime || selectedCrime === 'all' || item.crimeType === selectedCrime)
    );
    
    const totalCases = municipalityCrimes.reduce((sum, item) => sum + item.cases, 0);
    const rate = (totalCases / municipality.population) * 100000;
    
    return {
      ...municipality,
      totalCases,
      rate: Math.round(rate * 100) / 100
    };
  });

  const maxRate = Math.max(...municipalityData.map(m => m.rate));

  const getCircleColor = (rate) => {
    const intensity = rate / maxRate;
    if (intensity > 0.8) return '#dc2626'; // Vermelho escuro
    if (intensity > 0.6) return '#ef4444'; // Vermelho médio  
    if (intensity > 0.4) return '#f97316'; // Laranja
    if (intensity > 0.2) return '#eab308'; // Amarelo
    return '#22c55e'; // Verde
  };

  const getCircleRadius = (rate) => {
    const intensity = rate / maxRate;
    return Math.max(5, intensity * 25);
  };

  useEffect(() => {
    const bounds = municipalities.map(m => [m.lat, m.lng]);
    setMapBounds(bounds);
  }, []);

  return (
    <div className="map-container">
      <div className="map-header">
        <h3 className="map-title">Mapa de Incidência por Município</h3>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#dc2626' }}></div>
            <span>Muito Alto</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Alto</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
            <span>Médio</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#eab308' }}></div>
            <span>Baixo</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
            <span>Muito Baixo</span>
          </div>
        </div>
      </div>
      
      <div className="map-wrapper">
        <MapContainer
          center={[-8.8137, -36.9541]}
          zoom={7}
          style={{ height: '400px', width: '100%', borderRadius: '8px' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {mapBounds && <MapController bounds={mapBounds} />}
          
          {municipalityData.map(municipality => (
            <CircleMarker
              key={municipality.id}
              center={[municipality.lat, municipality.lng]}
              radius={getCircleRadius(municipality.rate)}
              fillColor={getCircleColor(municipality.rate)}
              color="#ffffff"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            >
              <Popup>
                <div className="popup-content">
                  <h4 className="popup-title">{municipality.name}</h4>
                  <div className="popup-stats">
                    <p><strong>População:</strong> {municipality.population.toLocaleString('pt-BR')}</p>
                    <p><strong>Total de Casos:</strong> {municipality.totalCases}</p>
                    <p><strong>Taxa por 100k hab:</strong> {municipality.rate}</p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default InteractiveMap;