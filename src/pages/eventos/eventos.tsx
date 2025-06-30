import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { alertaEliminar } from "../../components/alertas/alertaEliminar/alertaEliminar";

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  descripcion?: string;
  cupos: number;
}

const EventosPage: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const localEventos = localStorage.getItem("eventos");
    if (localEventos) {
      setEventos(JSON.parse(localEventos));
    } else {
      fetch("/src/data/data.json")
        .then((res) => res.json())
        .then((data) => setEventos(data.eventos || []));
    }
  }, []);

  const handleEliminar = (id: number) => {
    alertaEliminar(() => {
      const nuevosEventos = eventos.filter((evento) => evento.id !== id);
      setEventos(nuevosEventos);
      localStorage.setItem("eventos", JSON.stringify(nuevosEventos));
    });
  };

  const handleMostrar = (evento: Evento) => {
    navigate(`/mostrarEvento/${evento.id}`);
  };

  const eventosFiltrados = eventos.filter(
    (evento) =>
      evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      evento.fecha.includes(busqueda)
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Listado de Eventos</h2>
      <p className="mb-4 text-secondary">
        Aquí podrás ver, crear, editar y eliminar eventos o talleres. Gestiona las inscripciones y controla los cupos disponibles para cada actividad.
      </p>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control w-75"
          placeholder="Buscar evento por nombre o fecha..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Link to="/crearEvento" className="btn btn-success ms-3">
          Crear Evento
        </Link>
      </div>
      {eventosFiltrados.length === 0 ? (
        <div className="alert alert-secondary mt-4">
          No hay eventos registrados aún. ¡Comienza creando uno nuevo!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Cupos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.map((evento) => (
                <tr key={evento.id}>
                  <td className="fw-semibold">{evento.nombre}</td>
                  <td>{evento.fecha}</td>
                  <td>{evento.cupos}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleMostrar(evento)}
                    >
                      Mostrar
                    </button>
                    <Link
                      to="/editarEvento"
                      className="btn btn-sm btn-warning me-2"
                    >
                      Editar
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(evento.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/inscripciones" className="btn btn-secondary mt-4">
        Volver a Inscripciones
      </Link> 
    </div>
  );
}

export default EventosPage;