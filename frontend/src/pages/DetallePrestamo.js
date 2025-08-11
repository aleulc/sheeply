import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const DetallePrestamo = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [prestamo, setPrestamo] = useState(null);
  const [registroPagos, setRegistroPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagoModal, setPagoModal] = useState({
    open: false,
    cuota: null
  });
  const [isVisible, setIsVisible] = useState(false);

  // Obtener datos del préstamo
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener información del préstamo
        const prestamoResponse = await api.get(`/prestamos/${id}`);
        setPrestamo(prestamoResponse.data);
        
        // Obtener registro de pagos
        const pagosResponse = await api.get(`/prestamos/${id}/plan-pagos`);
        setRegistroPagos(pagosResponse.data);
        
        // Animación de entrada después de cargar los datos
        setTimeout(() => setIsVisible(true), 100);
      } catch (err) {
        setError('Error al cargar los datos del préstamo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Abrir modal de pago
  const handleOpenPago = (cuota) => {
    setPagoModal({
      open: true,
      cuota
    });
  };

  // Cerrar modal
  const handleClosePago = () => {
    setPagoModal({
      open: false,
      cuota: null
    });
  };

  // Registrar pago
  const handleRegistrarPago = async (formData) => {
    try {
      await api.post(`/prestamos/${id}/pagar`, {
        cuota_id: pagoModal.cuota.id,
        monto: formData.monto,
        fecha_pago: formData.fecha_pago
      });
      
      // Actualizar datos
      const [prestamoResponse, pagosResponse] = await Promise.all([
        api.get(`/prestamos/${id}`),
        api.get(`/prestamos/${id}/plan-pagos`)
      ]);
      
      setPrestamo(prestamoResponse.data);
      setRegistroPagos(pagosResponse.data);
      
      handleClosePago();
    } catch (err) {
      console.error(err);
      alert('Error al registrar el pago');
    }
  };

  // Colores para estados
  const estadoColors = {
    'Pendiente': 'bg-yellow-50 border-yellow-200 text-yellow-700',
    'Pagado': 'bg-green-50 border-green-200 text-green-700',
    'Vencido': 'bg-red-50 border-red-200 text-red-700'
  };

  // Iconos para estados
  const estadoIcons = {
    'Pendiente': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V6z" clipRule="evenodd" />
      </svg>
    ),
    'Pagado': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    'Vencido': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  };

  // Calcular deuda restante
  const calcularDeudaRestante = (cuota) => {
    if (!prestamo) return 0;
    
    const totalAPagar = prestamo.monto * (1 + prestamo.recargo / 100);
    const montoCuota = totalAPagar / prestamo.plazo;
    const cuotasRestantes = prestamo.plazo - cuota.numero_cuota;
    
    return (cuotasRestantes * montoCuota).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando detalles del préstamo...</p>
          <p className="text-gray-500 text-sm mt-2">Por favor espere un momento</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-2xl mx-auto mt-10">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-12 w-12 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error al cargar el préstamo</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-2">Por favor intente recargar la página o contacte a soporte técnico.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
                >
                  Recargar página
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!prestamo) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">Préstamo no encontrado</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          El préstamo solicitado no existe o no se pudo cargar.
        </p>
        <Link 
          to="/prestamos" 
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors duration-300"
        >
          Volver al listado de préstamos
        </Link>
      </div>
    );
  }

  // Calcular valores importantes
  const totalAPagar = prestamo.monto * (1 + prestamo.recargo / 100);
  const montoCuota = totalAPagar / prestamo.plazo;

  return (
    <div className={`space-y-8 transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            Detalle del Préstamo
          </h1>
          <div className="flex items-center space-x-3 mt-2">
            <div className={`px-3 py-1 inline-flex items-center text-sm font-medium rounded-full border ${
              estadoColors[prestamo.estado] || 'bg-gray-100 border-gray-200 text-gray-800'
            } transition-colors duration-300`}>
              {estadoIcons[prestamo.estado] || ''}
              {prestamo.estado}
            </div>
            <Link to={`/prestamos`} className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Volver al listado
            </Link>
          </div>
        </div>
      </div>

      {/* Información general */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalles del préstamo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2 transition-all duration-500 hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Información del Préstamo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Monto Total", value: `$${totalAPagar.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Monto Pendiente", value: `$${prestamo.monto_pendiente.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { label: "Plazo", value: `${prestamo.plazo} semanas`, icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
              { label: "Fecha de Inicio", value: new Date(prestamo.fecha_inicio).toLocaleDateString(), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { label: "Cuota Semanal", value: `$${montoCuota.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
              { label: "Recargo", value: `${prestamo.recargo}%`, icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:bg-indigo-50">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                </div>
                <p className="text-lg font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Información del cliente */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-500 hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Información del Cliente
          </h2>
          <div className="space-y-5">
            <div className="flex items-center mb-6">
              <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{prestamo.nombre} {prestamo.apellidos}</h3>
                <p className="text-gray-600">ID: {prestamo.cliente_id}</p>
              </div>
            </div>
            
            {[
              { label: "Teléfono", value: prestamo.telefono || 'N/A', icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
              { label: "Dirección", value: prestamo.direccion || 'N/A', icon: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" }
            ].map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-4">
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                </div>
                <p className="text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Información del Aval*/}
      {prestamo.requiere_aval && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-500 hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2 text-indigo-600" 
                viewBox="0 0 20 20" 
                fill="currentColor">
              <path fillRule="evenodd" 
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" />
            </svg>
            Información del Aval
          </h2>
          
          <div className="space-y-5">
            <div className="flex items-center mb-6">
              <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor">
                  <path strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {prestamo.aval?.nombre_a || 'N/A'} {prestamo.aval?.apellidos_a || ''}
                </h3>
                <p className="text-gray-600">Aval del préstamo #{id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { 
                  label: "Nombre completo", 
                  value: `${prestamo.aval?.nombre_a || 'N/A'} ${prestamo.aval?.apellidos_a || ''}`,
                  icon: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                },
                { 
                  label: "Teléfono", 
                  value: prestamo.aval?.telefono_a || 'N/A',
                  icon: "M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" 
                },
                { 
                  label: "Dirección", 
                  value: prestamo.aval?.direccion_a || 'N/A',
                  icon: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                },
              ].map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-gray-500 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor">
                      <path strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d={item.icon} />
                    </svg>
                    <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                  </div>
                  <p className="text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Registro de Pagos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-md">
        <div>
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Registro de Pagos
              </h3>
              <p className="text-sm text-gray-500">
                {registroPagos.length} cuotas en total
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Semana</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto a Pagar</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deuda Restante</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {registroPagos.map((cuota, index) => (
                  <tr 
                    key={cuota.id} 
                    className={`transition-all duration-300 ease-out hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {cuota.numero_cuota}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(cuota.fecha_pago).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${cuota.monto_total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${calcularDeudaRestante(cuota)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full border ${
                        estadoColors[cuota.estado] || 'bg-gray-100 border-gray-200 text-gray-800'
                      } transition-colors duration-300`}>
                        {estadoIcons[cuota.estado] || ''}
                        {cuota.estado}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {cuota.estado !== 'Pagado' && (
                        <button
                          onClick={() => handleOpenPago(cuota)}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center transition-colors duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Registrar pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para registrar pago */}
      {pagoModal.open && (
        <ModalPago 
          cuota={pagoModal.cuota}
          onClose={handleClosePago}
          onConfirm={handleRegistrarPago}
        />
      )}
    </div>
  );
};

// Componente Modal para registrar pago
const ModalPago = ({ cuota, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    monto: cuota.monto_total,
    fecha_pago: new Date().toLocaleDateString('en-CA') // Fecha actual en formato YYYY-MM-DD
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-500 scale-100 opacity-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-800">Registrar Pago</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Monto a pagar
              </label>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="fecha_pago" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Fecha de pago
              </label>
              <input
                type="date"
                id="fecha_pago"
                name="fecha_pago"
                value={formData.fecha_pago}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md"
              >
                Confirmar Pago
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DetallePrestamo;