import React, { useState } from "react";

const opcionesEventos = [
  { value: "taller-react", label: "Taller de React" },
  { value: "seminario-web", label: "Seminario de Desarrollo Web" },
  { value: "curso-python", label: "Curso de Python" },
  { value: "workshop-js", label: "Workshop de JavaScript" },
  { value: "bootcamp-fullstack", label: "Bootcamp Full Stack" },
];

const MostrarInscripcion: React.FC = () => {
  const [nombre] = useState("Juan Pérez");
  const [evento] = useState("taller-react");

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Detalle de Inscripción</h2>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <strong>Nombre del Participante:</strong>
          <div>{nombre}</div>
        </div>
        <div className="mb-3">
          <strong>Evento:</strong>
          <div>
            {opcionesEventos.find(op => op.value === evento)?.label || evento}
          </div>
        </div>
        <a href="/inscripciones" className="btn btn-secondary mt-3">
          Volver a Inscripciones
        </a>
      </div>
    </div>
  );
};

export default MostrarInscripcion;