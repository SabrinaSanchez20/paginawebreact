import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataManager } from "../../../hooks/useDataManager";
import { useAuth } from "../../../context/AuthContext";
import { Calendar, User, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import Swal from "sweetalert2";

const SolicitudesDesinscripcionPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const navigate = useNavigate();
  const { solicitudesDesinscripcion, usuarios, eventos, inscripciones, updateSolicitudDesinscripcion } = useDataManager();
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    navigate('/eventos');
    return null;
  }

  const handleAprobar = async (solicitudId: string | number) => {
    const result = await Swal.fire({
      title: '¿Aprobar solicitud?',
      text: 'Esto eliminará la inscripción del usuario al evento.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const success = await updateSolicitudDesinscripcion(solicitudId, 'aprobada');
      if (success) {
        Swal.fire({
          icon: "success",
          title: "¡Aprobada!",
          text: "La solicitud ha sido aprobada y el usuario ha sido desinscrito.",
          confirmButtonColor: "#198754",
          confirmButtonText: "Aceptar"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo aprobar la solicitud.",
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Aceptar"
        });
      }
    }
  };

  const handleRechazar = async (solicitudId: string | number) => {
    const result = await Swal.fire({
      title: 'Rechazar Solicitud',
      text: '¿Estás seguro de que quieres rechazar esta solicitud?',
      input: 'textarea',
      inputLabel: 'Motivo del rechazo (opcional)',
      inputPlaceholder: 'Escribe el motivo del rechazo...',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const success = await updateSolicitudDesinscripcion(solicitudId, 'rechazada');
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Rechazada",
          text: "La solicitud ha sido rechazada.",
          confirmButtonColor: "#198754",
          confirmButtonText: "Aceptar"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo rechazar la solicitud.",
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Aceptar"
        });
      }
    }
  };

  const getUsuario = (usuarioId: string | number) => {
    return usuarios.find(u => u.id.toString() === usuarioId.toString());
  };

  const getEvento = (eventoId: string | number) => {
    return eventos.find(e => e.id.toString() === eventoId.toString());
  };

  const getInscripcion = (inscripcionId: string | number) => {
    return inscripciones.find(i => i.id.toString() === inscripcionId.toString());
  };

  const solicitudesFiltradas = solicitudesDesinscripcion.filter(solicitud => {
    const usuario = getUsuario(solicitud.usuarioId);
    const evento = getEvento(solicitud.eventoId);
    
    const cumpleBusqueda = !busqueda || 
      usuario?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      evento?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      solicitud.motivo?.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleEstado = !estadoFiltro || solicitud.estado === estadoFiltro;
    
    return cumpleBusqueda && cumpleEstado;
  });

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate('/inscripciones')}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="mb-0 text-dark fw-bold">Solicitudes de Desinscripción</h2>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por usuario, evento o motivo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>
      </div>

      {solicitudesFiltradas.length === 0 ? (
        <div className="alert alert-info">
          <h5>No hay solicitudes</h5>
          <p>No se encontraron solicitudes de desinscripción con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="row">
          {solicitudesFiltradas.map((solicitud) => {
            const usuario = getUsuario(solicitud.usuarioId);
            const evento = getEvento(solicitud.eventoId);
            const inscripcion = getInscripcion(solicitud.inscripcionId);

            return (
              <div key={solicitud.id} className="col-lg-6 col-xl-4 mb-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="card-title text-dark fw-bold mb-0">
                        Solicitud #{solicitud.id}
                      </h6>
                      <span className={`badge ${
                        solicitud.estado === 'pendiente' ? 'bg-warning' :
                        solicitud.estado === 'aprobada' ? 'bg-success' : 'bg-danger'
                      }`}>
                        {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <User size={16} className="text-primary me-2" />
                        <strong>Usuario:</strong>
                        <span className="ms-2">{usuario?.nombre || 'Usuario no encontrado'}</span>
                      </div>
                      
                      <div className="d-flex align-items-center mb-2">
                        <Calendar size={16} className="text-primary me-2" />
                        <strong>Evento:</strong>
                        <span className="ms-2">{evento?.nombre || 'Evento no encontrado'}</span>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <Clock size={16} className="text-primary me-2" />
                        <strong>Fecha solicitud:</strong>
                        <span className="ms-2">{solicitud.fechaSolicitud}</span>
                      </div>
                    </div>

                    {solicitud.motivo && (
                      <div className="mb-3">
                        <strong>Motivo:</strong>
                        <p className="text-muted mt-1 mb-0">{solicitud.motivo}</p>
                      </div>
                    )}

                    {inscripcion && (
                      <div className="mb-3">
                        <small className="text-muted">
                          Fecha inscripción: {inscripcion.fechaInscripcion}
                        </small>
                      </div>
                    )}

                    <div className="mt-auto">
                      {solicitud.estado === 'pendiente' ? (
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleAprobar(solicitud.id)}
                          >
                            <CheckCircle size={16} className="me-1" />
                            Aprobar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRechazar(solicitud.id)}
                          >
                            <XCircle size={16} className="me-1" />
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <small className="text-muted">
                            Solicitud {solicitud.estado === 'aprobada' ? 'aprobada' : 'rechazada'}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SolicitudesDesinscripcionPage;
