import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataManager } from "../../../hooks/useDataManager";
import { useAuth } from "../../../context/AuthContext";
import { Calendar, Clock, Users, DollarSign, User, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

const InscribirseEventoPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const navigate = useNavigate();
  const { eventos, inscripciones, inscribirseEvento } = useDataManager();
  const { user } = useAuth();

  const handleInscribirse = async (eventoId: string | number) => {
    if (!user) {
      navigate('/login');
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
  };

  const estaInscrito = (eventoId: string | number) => {
    if (!user) return false;
    return inscripciones.some(i => 
      i.eventoId.toString() === eventoId.toString() && 
      i.usuarioId.toString() === user.id.toString() &&
      i.estado === 'confirmada'
    );
  };

  const getCuposDisponibles = (evento: any) => {
    const inscritosEvento = inscripciones.filter(i => 
      i.eventoId.toString() === evento.id.toString() && 
      i.estado === 'confirmada'
    ).length;
    return evento.cupos - inscritosEvento;
  };

  const eventosDisponibles = eventos.filter(evento => {
    const fechaEvento = new Date(evento.fecha);
    const hoy = new Date();
    const cumpleBusqueda = evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          evento.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                          evento.instructor?.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleCategoria = !categoriaFiltro || evento.categoria === categoriaFiltro;
    
    return fechaEvento > hoy && cumpleBusqueda && cumpleCategoria;
  });

  const categorias = [...new Set(eventos.map(e => e.categoria).filter(Boolean))];

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate('/eventos')}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="mb-0 text-dark fw-bold">Inscribirme a Eventos</h2>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar eventos por nombre, descripción o instructor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
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

      {eventosDisponibles.length === 0 ? (
        <div className="alert alert-info">
          <h5>No hay eventos disponibles</h5>
          <p>No se encontraron eventos disponibles para inscripción con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="row">
          {eventosDisponibles.map((evento) => {
            const cuposDisponibles = getCuposDisponibles(evento);
            const yaInscrito = estaInscrito(evento.id);
            const sinCupos = cuposDisponibles <= 0;

            return (
              <div key={evento.id} className="col-lg-6 col-xl-4 mb-4">
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
                            <small>{cuposDisponibles} disponibles</small>
                          </div>
                          {evento.precio && (
                            <div className="d-flex align-items-center mb-2">
                              <DollarSign size={16} className="text-primary me-2" />
                              <small>${evento.precio.toLocaleString()}</small>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {evento.instructor && (
                        <div className="d-flex align-items-center mb-3">
                          <User size={16} className="text-muted me-2" />
                          <small className="text-muted">Instructor: {evento.instructor}</small>
                        </div>
                      )}

                      {evento.categoria && (
                        <span className="badge bg-secondary mb-3">{evento.categoria}</span>
                      )}

                      <div className="d-grid">
                        {!user ? (
                          <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/login')}
                          >
                            Iniciar Sesión para Inscribirme
                          </button>
                        ) : yaInscrito ? (
                          <button className="btn btn-success" disabled>
                            Ya estás inscrito
                          </button>
                        ) : sinCupos ? (
                          <button className="btn btn-secondary" disabled>
                            Sin cupos disponibles
                          </button>
                        ) : (
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleInscribirse(evento.id)}
                          >
                            Inscribirme
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

export default InscribirseEventoPage;
