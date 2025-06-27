import React, { useState } from "react";

const EliminarEvento: React.FC = () => {
  const [nombre] = useState("Taller de React");
  const [fecha] = useState("2025-07-01");
  const [confirmado, setConfirmado] = useState(false);

  const handleEliminar = () => {
    setConfirmado(true);
    if (typeof window !== "undefined" && typeof window.mostrarAlerta === "function") {
      window.mostrarAlerta("exito", "El evento ha sido eliminado correctamente.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-danger fw-bold">Eliminar Evento</h2>
      {!confirmado ? (
        <div className="alert alert-warning">
          <p>
            ¿Estás seguro que deseas eliminar el evento <strong>{nombre}</strong> con fecha <strong>{fecha}</strong>?
          </p>
          <button className="btn btn-danger me-2" onClick={handleEliminar}>
            Sí, eliminar
          </button>
          <a href="/eventos" className="btn btn-secondary">
            Cancelar
          </a>
        </div>
      ) : (
        <div className="alert alert-success">
          El evento ha sido eliminado correctamente.
        </div>
      )}
    </div>
  );
};

export default EliminarEvento;