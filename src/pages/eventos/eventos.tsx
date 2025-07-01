import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDataManager } from "../../hooks/useDataManager";
import { alertaEliminar } from "../../components/alertas/alertaEliminar/alertaEliminar";
import { Calendar, Users, MapPin, Clock, Star, Search, Filter, Plus } from "lucide-react";
import Swal from "sweetalert2";
import './eventos.css';

const EventosPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const navigate = useNavigate();
  const { isAdmin, user, isAuthenticated } = useAuth();
  const { eventos, inscripciones, deleteEvento, inscribirseEvento, loading, error } = useDataManager();

  const handleEliminar = (id: number | string) => {
    alertaEliminar(async () => {
      await deleteEvento(id);
    });
  };

  const handleInscripcion = async (eventoId: number | string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user || !user.id) {
      console.error('Usuario no válido');
      return;
    }

    try {
      const yaInscrito = inscripciones.some(
        inscripcion => {
          // Verificar que los valores no sean null antes de convertir a string
          if (!inscripcion.usuarioId || !inscripcion.eventoId) return false;
          
          return inscripcion.usuarioId.toString() === user.id.toString() && 
                 inscripcion.eventoId.toString() === eventoId.toString() &&
                 inscripcion.estado === 'confirmada';
        }
      );

      if (yaInscrito) {
        Swal.fire({
          icon: "info",
          title: "Ya inscrito",
          text: "Ya estás inscrito en este evento.",
          confirmButtonColor: "#0d6efd",
          confirmButtonText: "Aceptar"
        });
        return;
      }

      const success = await inscribirseEvento(eventoId, user.id);
      
      if (success) {
        Swal.fire({
          icon: "success",
          title: "¡Inscrito!",
          text: "Te has inscrito exitosamente al evento.",
          confirmButtonColor: "#198754",
          confirmButtonText: "Aceptar"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo completar la inscripción.",
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Aceptar"
        });
      }
    } catch (error) {
      console.error('Error en inscripción:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al procesar la inscripción.",
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Aceptar"
      });
    }
  };

  // Indicadores de estado de carga
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando eventos...</p>
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

  const estaInscrito = (eventoId: number | string) => {
    if (!user || !user.id) return false;
    
    return inscripciones.some(
      inscripcion => {
        // Verificar que los valores no sean null antes de convertir a string
        if (!inscripcion.usuarioId || !inscripcion.eventoId) return false;
        
        return inscripcion.usuarioId.toString() === user.id.toString() && 
               inscripcion.eventoId.toString() === eventoId.toString() &&
               inscripcion.estado === 'confirmada';
      }
    );
  };

  const eventosFiltrados = eventos.filter(
    (evento) => {
      const matchBusqueda = evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           evento.fecha.includes(busqueda) ||
                           evento.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = categoriaFiltro === "" || evento.categoria === categoriaFiltro;
      return matchBusqueda && matchCategoria;
    }
  );

  const categorias = Array.from(new Set(eventos.map(evento => evento.categoria).filter(Boolean)));

  return (
    <div className="eventos-page">
      <div className="container py-5">
        {/* Header */}
        <div className="eventos-header">
          <div className="row align-items-center mb-5">
            <div className="col-lg-8">
              <h1 className="page-title">
                <Calendar className="me-3" size={40} />
                Eventos Disponibles
              </h1>
              <p className="page-description">
                Descubre eventos increíbles y únete a experiencias que transformarán tu crecimiento personal y profesional.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              {isAdmin && (
                <Link to="/crearEvento" className="btn btn-primary btn-lg">
                  <Plus size={20} className="me-2" />
                  Crear Evento
                </Link>
              )}
              {isAuthenticated && !isAdmin && (
                <Link to="/inscribirseEvento" className="btn btn-success btn-lg">
                  <Users size={20} className="me-2" />
                  Ver Todos los Eventos
                </Link>
              )}
              {!isAuthenticated && (
                <Link to="/inscribirseEvento" className="btn btn-primary btn-lg">
                  <Calendar size={20} className="me-2" />
                  Explorar Eventos
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filtros-section mb-5">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Buscar por nombre, fecha o descripción..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="filter-box">
                <Filter size={20} className="filter-icon" />
                <select
                  className="form-select filter-select"
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Eventos */}
        {eventosFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Calendar size={80} />
            </div>
            <h3>No hay eventos disponibles</h3>
            <p>No encontramos eventos que coincidan con tu búsqueda. Intenta con otros términos.</p>
            {isAdmin && (
              <Link to="/crearEvento" className="btn btn-primary">
                <Plus size={20} className="me-2" />
                Crear Primer Evento
              </Link>
            )}
          </div>
        ) : (
          <div className="eventos-grid">
            <div className="row g-4">
              {eventosFiltrados.map((evento) => (
                <div key={evento.id} className="col-lg-4 col-md-6">
                  <div className="evento-card">
                    <div className="evento-image">
                      <img
                        src={evento.imagen || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500'}
                        alt={evento.nombre}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500';
                        }}
                      />
                      {evento.categoria && (
                        <div className="evento-categoria">{evento.categoria}</div>
                      )}
                      {evento.precio && (
                        <div className="evento-precio">${evento.precio}</div>
                      )}
                    </div>
                    
                    <div className="evento-content">
                      <div className="evento-header">
                        <h3 className="evento-titulo">{evento.nombre}</h3>
                        <div className="evento-rating">
                          <Star size={16} fill="currentColor" />
                          <span>4.8</span>
                        </div>
                      </div>
                      
                      <p className="evento-descripcion">{evento.descripcion}</p>
                      
                      <div className="evento-details">
                        <div className="detail-item">
                          <Calendar size={16} />
                          <span>{new Date(evento.fecha).toLocaleDateString('es-ES')}</span>
                        </div>
                        {evento.duracion && (
                          <div className="detail-item">
                            <Clock size={16} />
                            <span>{evento.duracion}</span>
                          </div>
                        )}
                        <div className="detail-item">
                          <Users size={16} />
                          <span>{evento.disponibles || evento.cupos} cupos disponibles</span>
                        </div>
                        {evento.instructor && (
                          <div className="detail-item">
                            <MapPin size={16} />
                            <span>{evento.instructor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="evento-actions">
                      <button
                        className="btn btn-outline-primary flex-fill"
                        onClick={() => navigate(`/mostrarEvento/${evento.id}`)}
                      >
                        Ver Detalles
                      </button>
                      
                      {isAuthenticated && !isAdmin && (
                        <button
                          className={`btn flex-fill ms-2 ${
                            estaInscrito(evento.id) 
                              ? 'btn-success disabled' 
                              : 'btn-primary'
                          }`}
                          onClick={() => handleInscripcion(evento.id)}
                          disabled={estaInscrito(evento.id)}
                        >
                          {estaInscrito(evento.id) ? 'Inscrito ✓' : 'Inscribirse'}
                        </button>
                      )}
                      
                      {!isAuthenticated && (
                        <button
                          className="btn btn-primary flex-fill ms-2"
                          onClick={() => navigate('/login')}
                        >
                          Iniciar Sesión
                        </button>
                      )}
                      
                      {isAdmin && (
                        <div className="admin-actions">
                          <Link
                            to={`/editarEvento/${evento.id}`}
                            className="btn btn-warning btn-sm"
                          >
                            Editar
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminar(evento.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventosPage;