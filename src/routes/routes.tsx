import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/index/index";
import EventosPage from "../pages/eventos/eventos";
import CrearEvento from "../pages/eventos/crearEvento/crearEvento";
import EditarEvento from "../pages/eventos/editarEvento/editarEvento";
import MostrarEvento from "../pages/eventos/mostrarEvento/mostrarEvento";
import InscripcionesPage from "../pages/inscripciones/inscripciones";
import ConfiguracionPage from "../pages/configuracion/configuracion";
import CrearInscripcion from "../pages/inscripciones/crearInscripcion/crearInscripcion";
import EditarInscripcion from "../pages/inscripciones/editarInscripcion/editarInscripcion";
import MostrarInscripcion from "../pages/inscripciones/mostrarInscripcion/mostrarInscripcion";
import Login from "../pages/auth/login/login";
import Register from "../pages/auth/register/register";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import InscribirseEventoPage from "../pages/eventos/inscribirseEvento/inscribirseEvento";
import MisInscripcionesPage from "../pages/usuarios/misInscripciones/misInscripciones";
import SolicitudesDesinscripcionPage from "../pages/inscripciones/solicitudesDesinscripcion/solicitudesDesinscripcion";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/eventos" element={<EventosPage />} />
    <Route path="/mostrarEvento/:id" element={<MostrarEvento />} />
    <Route path="/inscribirseEvento" element={<InscribirseEventoPage />} />
    
    {/* Rutas protegidas - solo para usuarios autenticados */}
    <Route path="/misInscripciones" element={
      <ProtectedRoute>
        <MisInscripcionesPage />
      </ProtectedRoute>
    } />
    
    {/* Rutas protegidas - solo para administradores */}
    <Route path="/crearEvento" element={
      <ProtectedRoute requireAdmin>
        <CrearEvento />
      </ProtectedRoute>
    } />
    <Route path="/editarEvento/:id" element={
      <ProtectedRoute requireAdmin>
        <EditarEvento />
      </ProtectedRoute>
    } />
    <Route path="/inscripciones" element={
      <ProtectedRoute requireAdmin>
        <InscripcionesPage />
      </ProtectedRoute>
    } />
    <Route path="/configuracion" element={
      <ProtectedRoute requireAdmin>
        <ConfiguracionPage />
      </ProtectedRoute>
    } />
    <Route path="/crearInscripcion" element={
      <ProtectedRoute requireAdmin>
        <CrearInscripcion />
      </ProtectedRoute>
    } />
    <Route path="/editarInscripcion/:id" element={
      <ProtectedRoute requireAdmin>
        <EditarInscripcion />
      </ProtectedRoute>
    } />
    <Route path="/mostrarInscripcion/:id" element={
      <ProtectedRoute requireAdmin>
        <MostrarInscripcion />
      </ProtectedRoute>
    } />
    <Route path="/solicitudesDesinscripcion" element={
      <ProtectedRoute requireAdmin>
        <SolicitudesDesinscripcionPage />
      </ProtectedRoute>
    } />
  </Routes>
);

export default AppRoutes;