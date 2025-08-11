import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Prestamos from './pages/Prestamos';
import DetallePrestamo from './pages/DetallePrestamo';
import NuevoPrestamo from './pages/NuevoPrestamo';
import AvisoPrivacidad from './pages/aviso-privacidad';
import Terminos from './pages/terminos';


function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Verificando sesión...
      </div>
    );
  }

return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/aviso-privacidad" element={<AvisoPrivacidad/>} />
        <Route path="/terminos" element={<Terminos/>} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/prestamos/:id" element={<DetallePrestamo />} />
            <Route path="/prestamos/nuevo" element={<NuevoPrestamo />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;