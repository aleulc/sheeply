import React, { useState, useEffect } from 'react';

const DashboardCard = ({ title, value, icon, color }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Animación de entrada y conteo del valor
  useEffect(() => {
    setIsVisible(true);
    
    // Animar el valor numérico
    if (typeof value === 'number') {
      let start = 0;
      const duration = 1500;
      const increment = Math.ceil(value / (duration / 16));
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(start);
        }
      }, 16);
      
      return () => clearInterval(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value]);

  // Determinar colores basados en la prop 'color'
  const getColors = () => {
    const colorMap = {
      blue: {
        border: 'from-blue-500 to-blue-600',
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-600'
      },
      green: {
        border: 'from-green-500 to-green-600',
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600'
      },
      orange: {
        border: 'from-orange-500 to-orange-600',
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        icon: 'bg-orange-100 text-orange-600',
        text: 'text-orange-600'
      },
      purple: {
        border: 'from-purple-500 to-purple-600',
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        icon: 'bg-purple-100 text-purple-600',
        text: 'text-purple-600'
      },
      default: {
        border: 'from-indigo-500 to-indigo-600',
        bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
        icon: 'bg-indigo-100 text-indigo-600',
        text: 'text-indigo-600'
      }
    };
    
    return colorMap[color] || colorMap.default;
  };
  
  const colors = getColors();

  return (
    <div 
      className={`
        rounded-2xl shadow-sm p-6 relative overflow-hidden
        transform transition-all duration-500 ease-out
        hover:shadow-lg hover:-translate-y-1
        ${colors.bg}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Borde degradado animado */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.border}`}></div>
      
      {/* Efecto de onda al hacer hover */}
      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -inset-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-20 animate-wave"></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center relative z-10">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {typeof value === 'number' ? animatedValue.toLocaleString() : animatedValue}
          </h3>
        </div>
        <div 
          className={`
            p-3 rounded-xl transition-all duration-500
            group-hover:scale-110 group-hover:rotate-6
            ${colors.icon}
          `}
        >
          {React.cloneElement(icon, {
            className: `w-6 h-6 transition-all duration-300 ${icon.props.className || ''}`
          })}
        </div>
      </div>
      
      {/* Indicador de tendencia (opcional) */}
      <div className="mt-4 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${colors.text}`}></div>
        <span className="text-xs text-gray-500">Últimos 30 días</span>
      </div>
    </div>
  );
};

export default DashboardCard;