import React from "react";
import { useNavigate } from "react-router-dom";
import { useDataManager } from "../../../hooks/useDataManager";
import { useAuth } from "../../../context/AuthContext";
import { Calendar, Clock, Users, User, ArrowLeft, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

const MisInscripcionesPage: React.FC = () => {
  const navigate = useNavigate();
  const { inscripciones, eventos, solicitudesDesinscripcion, solicitarDesinscripcion } = useDataManager();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSolicitarDesinscripcion = async (inscripcionId: string | number) => {
    const result = await Swal.fire({
      title: 'Solicitar Desinscripción',
      text: '¿Estás seguro de que quieres solicitar la desinscripción de este evento?',
      input: 'textarea',
      inputLabel: 'Motivo (opcional)',
      inputPlaceholder: 'Escribe el motivo de tu desinscripción...',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Solicitar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const success = await solicitarDesinscripcion(inscripcionId, user.id, result.value);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "¡Solicitud Enviada!",
          text: "Tu solicitud de desinscripción ha sido enviada. Un administrador la revisará pronto.",
          confirmButtonColor: "#198754",
          confirmButtonText: "Aceptar"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo enviar la solicitud. Inténtalo más tarde.",
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Aceptar"
        });
      }
    }
  };

  const misInscripciones = inscripciones.filter(i => {
    if (!user || !user.id || !i.usuarioId) return false;
    return i.usuarioId.toString() === user.id.toString() && 
           i.estado === 'confirmada';
  });

  const getEvento = (eventoId: string | number) => {
    if (!eventoId) return null;
    return eventos.find(e => e.id && e.id.toString() === eventoId.toString());
  };

  const tieneSolicitudPendiente = (inscripcionId: string | number) => {
    if (!inscripcionId) return false;
    return solicitudesDesinscripcion.some(s => 
      s.inscripcionId && s.inscripcionId.toString() === inscripcionId.toString() && 
      s.estado === 'pendiente'
    );
  };

  const getSolicitudPendiente = (inscripcionId: string | number) => {
    if (!inscripcionId) return null;
    return solicitudesDesinscripcion.find(s => 
      s.inscripcionId && s.inscripcionId.toString() === inscripcionId.toString() && 
      s.estado === 'pendiente'
    );
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate('/eventos')}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="mb-0 text-dark fw-bold">Mis Inscripciones</h2>
      </div>

      <div className="mb-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/inscribirseEvento')}
        >
          Inscribirme a un Evento
        </button>
      </div>

      {misInscripciones.length === 0 ? (
        <div className="alert alert-info">
          <h5>No tienes inscripciones</h5>
          <p>Aún no te has inscrito a ningún evento. ¡Explora nuestros eventos disponibles!</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/inscribirseEvento')}
          >
            Ver Eventos Disponibles
          </button>
        </div>
      ) : (
        <div className="row">
          {misInscripciones.map((inscripcion) => {
            const evento = getEvento(inscripcion.eventoId);
            const solicitudPendiente = tieneSolicitudPendiente(inscripcion.id);
            const solicitud = getSolicitudPendiente(inscripcion.id);

            if (!evento) {
              return (
                <div key={inscripcion.id} className="col-lg-6 col-xl-4 mb-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body">
                      <div className="alert alert-warning">
                        <AlertCircle size={20} className="me-2" />
                        Evento no encontrado
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            const fechaEvento = new Date(evento.fecha);
            const hoy = new Date();
            const eventoTerminado = fechaEvento < hoy;

            return (
              <div key={inscripcion.id} className="col-lg-6 col-xl-4 mb-4">
                <div className="card h-100 shadow-sm border-0">
                  {evento.imagen && (
                    <img 
                      src={evento.imagen} 
                      alt={evento.nombre}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-dark fw-bold">{evento.nombre}</h5>
                    <p className="card-text text-muted flex-grow-1">{evento.descripcion}</p>
                    
                    <div className="mt-auto">
                      <div className="row text-sm mb-3">
                        <div className="col-6">
                          <div className="d-flex align-items-center mb-2">
                            <Calendar size={16} className="text-primary me-2" />
                            <small>{evento.fecha}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Clock size={16} className="text-primary me-2" />
                            <small>{evento.duracion}</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center mb-2">
                            <Users size={16} className="text-primary me-2" />
                            <small>{evento.cupos} cupos</small>
                          </div>
                        </div>
                      </div>
                      
                      {evento.instructor && (
                        <div className="d-flex align-items-center mb-3">
                          <User size={16} className="text-muted me-2" />
                          <small className="text-muted">Instructor: {evento.instructor}</small>
                        </div>
                      )}

                      <div className="mb-3">
                        <span className="badge bg-success me-2">Inscrito</span>
                        <small className="text-muted">Fecha inscripción: {inscripcion.fechaInscripcion}</small>
                      </div>

                      {solicitudPendiente && (
                        <div className="alert alert-warning py-2 mb-3">
                          <div className="d-flex align-items-center">
                            <AlertCircle size={16} className="me-2" />
                            <small>
                              <strong>Solicitud de desinscripción pendiente</strong>
                              <br />
                              Enviada el: {solicitud?.fechaSolicitud}
                              {solicitud?.motivo && (
                                <>
                                  <br />
                                  Motivo: {solicitud.motivo}
                                </>
                              )}
                            </small>
                          </div>
                        </div>
                      )}

                      <div className="d-grid">
                        {eventoTerminado ? (
                          <button className="btn btn-secondary" disabled>
                            Evento Finalizado
                          </button>
                        ) : solicitudPendiente ? (
                          <button className="btn btn-warning" disabled>
                            Solicitud Pendiente
                          </button>
                        ) : (
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleSolicitarDesinscripcion(inscripcion.id)}
                          >
                            Solicitar Desinscripción
                          </button>
                        )}
                      </div>
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

export default MisInscripcionesPage;
