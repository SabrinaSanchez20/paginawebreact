import React, { useState } from "react";

const EliminarInscripcion: React.FC = () => {
  const [nombre] = useState("Juan Pérez");
  const [evento] = useState("Taller de React");
  const [confirmado, setConfirmado] = useState(false);

  const handleEliminar = () => {
    setConfirmado(true);
    if (typeof window !== "undefined" && typeof window.mostrarAlerta === "function") {
      window.mostrarAlerta("exito", "La inscripción ha sido eliminada correctamente.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-danger fw-bold">Eliminar Inscripción</h2>
      {!confirmado ? (
        <div className="alert alert-warning">
          <p>
            ¿Estás seguro que deseas eliminar la inscripción de <strong>{nombre}</strong> al evento <strong>{evento}</strong>?
          </p>
          <button className="btn btn-danger me-2" onClick={handleEliminar}>
            Sí, eliminar
          </button>
          <a href="/inscripciones" className="btn btn-secondary">
            Cancelar
          </a>
        </div>
      ) : (
        <div className="alert alert-success">
          La inscripción ha sido eliminada correctamente.
        </div>
      )}
    </div>
  );
};

export default EliminarInscripcion;