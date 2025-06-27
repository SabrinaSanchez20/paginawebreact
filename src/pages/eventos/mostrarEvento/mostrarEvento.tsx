import React, { useState } from "react";

const MostrarEvento: React.FC = () => {
  const [nombre] = useState("Taller de React");
  const [fecha] = useState("2025-07-01");
  const [descripcion] = useState("Un taller práctico de React.");

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Detalle del Evento</h2>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <strong>Nombre del Evento:</strong>
          <div>{nombre}</div>
        </div>
        <div className="mb-3">
          <strong>Fecha:</strong>
          <div>{fecha}</div>
        </div>
        <div className="mb-3">
          <strong>Descripción:</strong>
          <div>{descripcion}</div>
        </div>
        <a href="/eventos" className="btn btn-secondary mt-3">
          Volver a Eventos
        </a>
      </div>
    </div>
  );
};

export default MostrarEvento;