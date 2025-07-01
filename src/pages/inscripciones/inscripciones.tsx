import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDataManager } from "../../hooks/useDataManager";
import { alertaEliminar } from "../../components/alertas/alertaEliminar/alertaEliminar";

const InscripcionesPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();
  const { inscripciones, eventos, usuarios, deleteInscripcion, loading, error } = useDataManager();

  const handleEliminar = (id: number | string) => {
    alertaEliminar(async () => {
      await deleteInscripcion(id);
    });
  };

  const handleMostrar = (inscripcion: any) => {
    navigate(`/mostrarInscripcion/${inscripcion.id}`);
  };

  const handleEditar = (inscripcion: any) => {
    navigate(`/editarInscripcion/${inscripcion.id}`);
  };

  // Indicadores de estado de carga
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando inscripciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5>Error al cargar datos</h5>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getUsuarioNombre = (usuarioId: string | number) => {
    if (!usuarioId) return 'Usuario desconocido';
    const usuario = usuarios.find(u => u.id && u.id.toString() === usuarioId.toString());
    return usuario ? usuario.nombre : `Usuario ${usuarioId}`;
  };

  const getEventoNombre = (eventoId: string | number) => {
    if (!eventoId) return 'Evento desconocido';
    const evento = eventos.find(e => e.id && e.id.toString() === eventoId.toString());
    return evento ? evento.nombre : `Evento ${eventoId}`;
  };

  const inscripcionesFiltradas = inscripciones.filter(
    (insc) => {
      const nombreUsuario = getUsuarioNombre(insc.usuarioId);
      const nombreEvento = getEventoNombre(insc.eventoId);
      return nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
             nombreEvento.toLowerCase().includes(busqueda.toLowerCase()) ||
             insc.estado.toLowerCase().includes(busqueda.toLowerCase());
    }
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Inscripciones</h2>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar por usuario, evento o estado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="d-flex gap-2">
          <Link
            to="/solicitudesDesinscripcion"
            className="btn btn-warning"
          >
            Solicitudes de Desinscripción
          </Link>
          <Link
            to="/crearInscripcion"
            className="btn btn-success"
          >
            Crear Inscripción
          </Link>
        </div>
      </div>

      <h4 className="fw-semibold mb-3">Lista de Inscripciones</h4>
      {inscripcionesFiltradas.length === 0 ? (
        <div className="alert alert-secondary mt-3">
          No hay inscripciones registradas.
        </div>
      ) : (
        <ul className="list-group mt-3">
          {inscripcionesFiltradas.map((insc) => (
            <li key={insc.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <span className="fw-bold text-dark">{getUsuarioNombre(insc.usuarioId)}</span>
                <span className="text-muted">
                  {" "}
                  &mdash; {getEventoNombre(insc.eventoId)}
                </span>
                <span className={`badge ms-2 ${insc.estado === 'confirmada' ? 'bg-success' : insc.estado === 'pendiente' ? 'bg-warning' : 'bg-danger'}`}>
                  {insc.estado}
                </span>
                <span className="text-muted ms-2">
                  ({insc.fechaInscripcion})
                </span>
              </span>
              <span>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => handleMostrar(insc)}
                >
                  Mostrar
                </button>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditar(insc)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleEliminar(insc.id)}
                >
                  Eliminar
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <Link to="/eventos" className="btn btn-secondary mt-4">
        Volver a Eventos
      </Link>
    </div>
  );
}

export default InscripcionesPage;