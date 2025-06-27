import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/index/index";
import EventosPage from "../pages/eventos/eventos";
import CrearEvento from "../pages/eventos/crearEvento/crearEvento";
import EditarEvento from "../pages/eventos/editarEvento/editarEvento";
import EliminarEvento from "../pages/eventos/eliminarEvento/eliminarEvento";
import MostrarEvento from "../pages/eventos/mostrarEvento/mostrarEvento";
import InscripcionesPage from "../pages/inscripciones/inscripciones";
import ConfiguracionPage from "../pages/configuracion/configuracion";
import CrearInscripcion from "../pages/inscripciones/crearInscripcion/crearInscripcion";
import EditarInscripcion from "../pages/inscripciones/editarInscripcion/editarInscripcion";
import EliminarInscripcion from "../pages/inscripciones/eliminarInscripcion/eliminarInscripcion";
import MostrarInscripcion from "../pages/inscripciones/mostrarInscripcion/mostrarInscripcion";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/eventos" element={<EventosPage />} />
    <Route path="/crearEvento" element={<CrearEvento />} />
    <Route path="/editarEvento" element={<EditarEvento />} />
    <Route path="/eliminarEvento" element={<EliminarEvento />} />
    <Route path="/mostrarEvento" element={<MostrarEvento />} />
    <Route path="/inscripciones" element={<InscripcionesPage />} />
    <Route path="/configuracion" element={<ConfiguracionPage />} />
    <Route path="/crearInscripcion" element={<CrearInscripcion />} />
    <Route path="/editarInscripcion" element={<EditarInscripcion />} />
    <Route path="/eliminarInscripcion" element={<EliminarInscripcion />} />
    <Route path="/mostrarInscripcion" element={<MostrarInscripcion />} />
  </Routes>
);

export default AppRoutes;