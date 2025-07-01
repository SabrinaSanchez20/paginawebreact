import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useDataManager } from "../../../hooks/useDataManager";
import { alertaEliminar } from "../../../components/alertas/alertaEliminar/alertaEliminar";
import { 
  Calendar, Users, MapPin, Clock, Star, DollarSign, Tag, 
  ArrowLeft, Edit, Trash2, UserPlus, CheckCircle, AlertCircle
} from "lucide-react";

const MostrarEvento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { eventos, inscripciones, deleteEvento, createInscripcion } = useDataManager();
  
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inscribiendo, setInscribiendo] = useState(false);

  useEffect(() => {
    if (eventos.length > 0) {
      const eventoEncontrado = eventos.find(e => e.id?.toString() === id);
      setEvento(eventoEncontrado || null);
      setLoading(false);
    }
  }, [id, eventos]);

  const handleEliminar = () => {
    alertaEliminar(async () => {
      await deleteEvento(id!);
      navigate('/eventos');
    });
  };

  const handleInscripcion = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setInscribiendo(true);
    try {
      const yaInscrito = inscripciones.some(
        inscripcion => inscripcion.usuarioId.toString() === user?.id?.toString() && 
                     inscripcion.eventoId.toString() === id
      );

      if (yaInscrito) {
        alert('Ya estás inscrito en este evento');
        return;
      }

      const nuevaInscripcion = {
        usuarioId: user?.id || '',
        eventoId: id || '',
        fechaInscripcion: new Date().toISOString().split('T')[0],
        estado: 'confirmada'
      };

      const success = await createInscripcion(nuevaInscripcion);
      
      if (success) {
        alert('¡Inscripción exitosa!');
      } else {
        alert('Error al procesar la inscripción');
      }
    } catch (error) {
      console.error('Error en inscripción:', error);
      alert('Error al procesar la inscripción');
    } finally {
      setInscribiendo(false);
    }
  };

  const estaInscrito = () => {
    return inscripciones.some(
      inscripcion => inscripcion.usuarioId.toString() === user?.id?.toString() && 
                    inscripcion.eventoId.toString() === id
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <AlertCircle size={64} className="text-muted mb-3" />
            <h3>Evento no encontrado</h3>
            <p className="text-muted">Lo sentimos, no pudimos encontrar el evento que buscas.</p>
            <Link to="/eventos" className="btn btn-primary">
              <ArrowLeft size={18} className="me-2" />
              Volver a Eventos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header con navegación */}
      <div className="d-flex align-items-center mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate('/eventos')}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="mb-0 text-dark fw-bold">Detalle del Evento</h2>
      </div>

      <div className="row g-4">
        {/* Imagen del evento */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <img
              src={evento.imagen || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500'}
              alt={evento.nombre}
              className="card-img-top"
              style={{ height: '300px', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500';
              }}
            />
            {evento.categoria && (
              <div className="position-absolute top-0 start-0 m-3">
                <span className="badge bg-primary fs-6">
                  <Tag size={14} className="me-1" />
                  {evento.categoria}
                </span>
              </div>
            )}
            {evento.precio && (
              <div className="position-absolute top-0 end-0 m-3">
                <span className="badge bg-success fs-6">
                  <DollarSign size={14} className="me-1" />
                  ${evento.precio}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Información del evento */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h3 className="card-title fw-bold text-primary mb-0">{evento.nombre}</h3>
                <div className="d-flex align-items-center text-warning">
                  <Star size={18} fill="currentColor" />
                  <span className="ms-1 fw-semibold">4.8</span>
                </div>
              </div>

              <p className="card-text text-muted mb-4">{evento.descripcion}</p>

              {/* Detalles del evento */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <Calendar size={18} className="text-primary me-2" />
                    <div>
                      <small className="text-muted d-block">Fecha</small>
                      <span className="fw-semibold">
                        {new Date(evento.fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <Users size={18} className="text-primary me-2" />
                    <div>
                      <small className="text-muted d-block">Cupos</small>
                      <span className="fw-semibold">
                        {evento.disponibles || evento.cupos} disponibles
                      </span>
                    </div>
                  </div>
                </div>

                {evento.duracion && (
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                      <Clock size={18} className="text-primary me-2" />
                      <div>
                        <small className="text-muted d-block">Duración</small>
                        <span className="fw-semibold">{evento.duracion}</span>
                      </div>
                    </div>
                  </div>
                )}

                {evento.instructor && (
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                      <MapPin size={18} className="text-primary me-2" />
                      <div>
                        <small className="text-muted d-block">Instructor</small>
                        <span className="fw-semibold">{evento.instructor}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Estado de inscripción */}
              {isAuthenticated && !isAdmin && estaInscrito() && (
                <div className="alert alert-success d-flex align-items-center mb-4">
                  <CheckCircle size={20} className="me-2" />
                  <span>¡Ya estás inscrito en este evento!</span>
                </div>
              )}

              {/* Botones de acción */}
              <div className="d-flex gap-2 flex-wrap">
                {/* Botones para usuarios normales */}
                {isAuthenticated && !isAdmin && (
                  <button
                    className={`btn flex-grow-1 ${
                      estaInscrito() 
                        ? 'btn-success disabled' 
                        : 'btn-primary'
                    }`}
                    onClick={handleInscripcion}
                    disabled={estaInscrito() || inscribiendo}
                  >
                    {inscribiendo ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Inscribiendo...
                      </>
                    ) : estaInscrito() ? (
                      <>
                        <CheckCircle size={18} className="me-2" />
                        Inscrito
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} className="me-2" />
                        Inscribirse
                      </>
                    )}
                  </button>
                )}

                {/* Botones para usuarios no autenticados */}
                {!isAuthenticated && (
                  <button
                    className="btn btn-primary flex-grow-1"
                    onClick={() => navigate('/login')}
                  >
                    <UserPlus size={18} className="me-2" />
                    Iniciar Sesión para Inscribirse
                  </button>
                )}

                {/* Botones para administradores */}
                {isAdmin && (
                  <>
                    <Link
                      to={`/editarEvento/${evento.id}`}
                      className="btn btn-warning"
                    >
                      <Edit size={18} className="me-2" />
                      Editar
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={handleEliminar}
                    >
                      <Trash2 size={18} className="me-2" />
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Información Adicional</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="text-center p-3 bg-light rounded">
                    <Users size={32} className="text-primary mb-2" />
                    <h6 className="mb-1">Capacidad</h6>
                    <span className="text-muted">{evento.cupos} personas</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center p-3 bg-light rounded">
                    <Calendar size={32} className="text-primary mb-2" />
                    <h6 className="mb-1">Modalidad</h6>
                    <span className="text-muted">Presencial</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center p-3 bg-light rounded">
                    <Star size={32} className="text-primary mb-2" />
                    <h6 className="mb-1">Certificado</h6>
                    <span className="text-muted">Incluido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostrarEvento;