// client/src/pages/NuevoPrestamo.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const NuevoPrestamo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [showAval, setShowAval] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Formulario principal
  const [formData, setFormData] = useState({
    cliente_id: '',
    monto: '',
    plazo: '16', // Plazo por defecto en semanas
    fecha_inicio: new Date().toISOString().split('T')[0],
    aval: null
  });
  
  // Nuevo estado para el recargo porcentual
  const [recargo, setRecargo] = useState('58.4'); // 58.4% para el ejemplo: 1000 * 1.584 = 1584
  
  // Formulario para nuevo cliente
  const [newClientData, setNewClientData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    direccion: ''
  });
  
  // Formulario para aval
  const [avalData, setAvalData] = useState({
    nombre_a: '',
    apellidos_a: '',
    telefono_a: '',
    direccion_a: ''
  });

  // Obtener lista de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (err) {
        setError('Error al cargar clientes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientes();
  }, []);

  // Manejar cambios en formulario principal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error al cambiar
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Manejar cambio en el recargo
  const handleRecargoChange = (e) => {
    setRecargo(e.target.value);
  };

  // Manejar cambios en formulario de nuevo cliente
  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClientData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en formulario de aval
  const handleAvalChange = (e) => {
    const { name, value } = e.target;
    setAvalData(prev => ({ ...prev, [name]: value }));
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.cliente_id) {
      errors.cliente_id = 'Debe seleccionar un cliente';
    }
    
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      errors.monto = 'Monto debe ser mayor a cero';
    }
    
    // Validar recargo
    if (!recargo || parseFloat(recargo) <= 0) {
      errors.recargo = 'Recargo inválido';
    }
    
    if (!formData.plazo || parseInt(formData.plazo) <= 0) {
      errors.plazo = 'Plazo inválido';
    }
    
    if (!formData.fecha_inicio) {
      errors.fecha_inicio = 'Fecha de inicio requerida';
    }
    
    // Validar nuevo cliente si está activo
    if (showNewClient) {
      if (!newClientData.nombre.trim()) {
        errors.newClient = 'Nombre es requerido';
      }
      
      if (!newClientData.apellidos.trim()) {
        errors.newClient = 'Apellido es requerido';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Crear nuevo cliente
  const handleCreateClient = async () => {
    if (!newClientData.nombre || !newClientData.apellidos) {
      setFormErrors({ newClient: 'Nombre y apellido son obligatorios' });
      return;
    }
    
    try {
      const response = await api.post('/clientes', newClientData);
      setClientes(prev => [...prev, response.data]);
      setFormData(prev => ({ ...prev, cliente_id: response.data.id }));
      setShowNewClient(false);
      setFormErrors(prev => ({ ...prev, newClient: null }));
    } catch (err) {
      console.error(err);
      alert('Error al crear cliente');
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Determinar si se requiere aval
    const requiereAval = showAval && (
      avalData.nombre_a.trim() !== '' || 
      avalData.apellidos_a.trim() !== ''
    );
    
    // Preparar datos para enviar
    const prestamoData = {
      ...formData,
      monto: parseFloat(formData.monto),
      recargo: parseFloat(recargo), // Guardamos el recargo como valor numérico
      plazo: parseInt(formData.plazo),
      aval: requiereAval ? avalData : null
    };
    
    try {
      const response = await api.post('/prestamos', prestamoData);
      alert('Préstamo creado exitosamente');
      navigate(`/prestamos/${response.data.id}`);
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || 'Error al crear préstamo');
    }
  };

  // Calcular cuota semanal
  const calcularCuota = () => {
    if (!formData.monto || !recargo || !formData.plazo) return '0.00';
    
    const monto = parseFloat(formData.monto);
    const recargoDecimal = parseFloat(recargo) / 100;
    const plazo = parseInt(formData.plazo);
    
    if (monto <= 0 || plazo <= 0) return '0.00';
    
    const total = monto * (1 + recargoDecimal);
    const cuotaSemanal = total / plazo;
    
    return cuotaSemanal.toFixed(2);
  };

  // Calcular total a pagar
  const calcularTotal = () => {
    if (!formData.monto || !recargo) return '0.00';
    
    const monto = parseFloat(formData.monto);
    const recargoDecimal = parseFloat(recargo) / 100;
    
    return (monto * (1 + recargoDecimal)).toFixed(2);
  };

  // Calcular recargo en dinero
  const calcularRecargo = () => {
    if (!formData.monto || !recargo) return '0.00';
    
    const monto = parseFloat(formData.monto);
    const recargoDecimal = parseFloat(recargo) / 100;
    
    return (monto * recargoDecimal).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Préstamo</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selección de cliente */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Información del Cliente</h2>
            
            {!showNewClient ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cliente_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Seleccionar cliente existente
                  </label>
                  <select
                    id="cliente_id"
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.cliente_id 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Seleccione un cliente...</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellidos} - {cliente.telefono}
                      </option>
                    ))}
                  </select>
                  {formErrors.cliente_id && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.cliente_id}</p>
                  )}
                </div>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowNewClient(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Registrar nuevo cliente
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-medium text-gray-700">Nuevo Cliente</h3>
                  <button
                    type="button"
                    onClick={() => setShowNewClient(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={newClientData.nombre}
                      onChange={handleNewClientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={newClientData.apellidos}
                      onChange={handleNewClientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
        
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={newClientData.telefono}
                      onChange={handleNewClientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <textarea
                      id="direccion"
                      name="direccion"
                      value={newClientData.direccion}
                      onChange={handleNewClientChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCreateClient}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Guardar Cliente
                  </button>
                </div>
                
                {formErrors.newClient && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.newClient}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Aval - Sección desplegable */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Aval</h2>
              <button
                type="button"
                onClick={() => setShowAval(!showAval)}
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                {showAval ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Ocultar aval
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Agregar aval
                  </>
                )}
              </button>
            </div>
            
            {showAval && (
              <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="aval_nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      id="nombre_a"
                      name="nombre_a"
                      value={avalData.nombre_a}
                      onChange={handleAvalChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="apellidos_a" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      id="apellidos_a"
                      name="apellidos_a"
                      value={avalData.apellidos_a}
                      onChange={handleAvalChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telefono_a" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono_a"
                      name="telefono_a"
                      value={avalData.telefono_a}
                      onChange={handleAvalChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="direccion_a" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <textarea
                      id="direccion_a"
                      name="direccion_a"
                      value={avalData.direccion_a}
                      onChange={handleAvalChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detalles del préstamo */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles del Préstamo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">Monto solicitado *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="monto"
                    name="monto"
                    value={formData.monto}
                    onChange={handleChange}
                    className={`block w-full pl-8 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.monto 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                {formErrors.monto && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.monto}</p>
                )}
              </div>
              
              {/* Campo de recargo porcentual */}
              <div>
                <label htmlFor="recargo" className="block text-sm font-medium text-gray-700 mb-1">Recargo (%) *</label>
                <div className="relative">
                  <input
                    type="number"
                    id="recargo"
                    name="recargo"
                    value={recargo}
                    onChange={handleRecargoChange}
                    className={`block w-full pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.recargo 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.1"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                {formErrors.recargo && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.recargo}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="plazo" className="block text-sm font-medium text-gray-700 mb-1">Plazo (semanas) *</label>
                <input
                  type="number"
                  id="plazo"
                  name="plazo"
                  value={formData.plazo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    formErrors.plazo 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  min="1"
                  required
                />
                {formErrors.plazo && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.plazo}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio *</label>
                <input
                  type="date"
                  id="fecha_inicio"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    formErrors.fecha_inicio 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {formErrors.fecha_inicio && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.fecha_inicio}</p>
                )}
              </div>
              
              {/* Resumen de cálculo */}
              <div className="md:col-span-3">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-blue-800">Cuota semanal</p>
                      <p className="text-xl font-bold text-blue-800">${calcularCuota()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800">Total a pagar</p>
                      <p className="text-xl font-bold text-blue-800">
                        ${calcularTotal()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800">Recargo total</p>
                      <p className="text-xl font-bold text-blue-800">
                        ${calcularRecargo()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/prestamos')}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Guardar y Generar Plan de Pagos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoPrestamo;