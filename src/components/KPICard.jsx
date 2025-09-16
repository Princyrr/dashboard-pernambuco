import React from 'react';

const KPICard = ({ title, value, subtitle, trend, icon, className = '' }) => {
  return (
    <div className={`kpi-card ${className}`}>
      <div className="kpi-card__header">
        <div className="kpi-card__icon">
          {icon}
        </div>
        <div className="kpi-card__trend">
          {trend && (
            <span className={`trend trend--${trend > 0 ? 'up' : 'down'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      <div className="kpi-card__content">
        <h3 className="kpi-card__title">{title}</h3>
        <div className="kpi-card__value">{value}</div>
        {subtitle && <p className="kpi-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default KPICard;