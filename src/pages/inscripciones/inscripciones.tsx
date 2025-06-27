import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Inscripcion {
  nombre: string;
  evento: string;
}

const opcionesEventos = [
  { value: "", label: "Por favor elige un evento" },
  { value: "taller-react", label: "Taller de React" },
  { value: "seminario-web", label: "Seminario de Desarrollo Web" },
  { value: "curso-python", label: "Curso de Python" },
  { value: "workshop-js", label: "Workshop de JavaScript" },
  { value: "bootcamp-fullstack", label: "Bootcamp Full Stack" },
];

const InscripcionesPage: React.FC = () => {
  const [inscripciones] = useState<Inscripcion[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const inscripcionesFiltradas = inscripciones.filter(
    (insc) =>
      insc.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      opcionesEventos.find(op => op.value === insc.evento)?.label?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Inscripciones</h2>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control w-75"
          placeholder="Buscar por nombre o evento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Link
          to="/crearInscripcion"
          className="btn btn-success ms-3"
        >
          Crear Inscripción
        </Link>
      </div>

      <h4 className="fw-semibold mb-3">Lista de Inscripciones</h4>
      {inscripcionesFiltradas.length === 0 ? (
        <div className="alert alert-secondary mt-3">
          No hay inscripciones registradas.
        </div>
      ) : (
        <ul className="list-group mt-3">
          {inscripcionesFiltradas.map((insc, idx) => (
            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <span className="fw-bold text-dark">{insc.nombre}</span>
                <span className="text-muted">
                  {" "}
                  &mdash; {opcionesEventos.find(op => op.value === insc.evento)?.label}
                </span>
              </span>
              <span>
                <Link to="/mostrarInscripcion" className="btn btn-sm btn-info me-2">
                  Mostrar
                </Link>
                <Link to="/editarInscripcion" className="btn btn-sm btn-warning me-2">
                  Editar
                </Link>
                <Link to="/eliminarInscripcion" className="btn btn-sm btn-danger">
                  Eliminar
                </Link>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InscripcionesPage;