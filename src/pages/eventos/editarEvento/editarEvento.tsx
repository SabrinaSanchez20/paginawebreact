import React, { useState } from "react";

const EditarEvento: React.FC = () => {
  const [nombre, setNombre] = useState("Taller de React");
  const [fecha, setFecha] = useState("2025-07-01");
  const [descripcion, setDescripcion] = useState("Un taller práctico de React.");
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !fecha.trim() || !descripcion.trim()) {
      setMensaje({ tipo: "danger", texto: "Completa todos los campos correctamente." });
      if (typeof window !== "undefined" && typeof window.mostrarAlerta === "function") {
        window.mostrarAlerta("validacion", "Completa todos los campos correctamente.");
      }
      return;
    }
    setMensaje({ tipo: "success", texto: "Evento editado correctamente." });
    if (typeof window !== "undefined" && typeof window.mostrarAlerta === "function") {
      window.mostrarAlerta("exito", "Evento editado correctamente.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Editar Evento</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre del Evento</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row g-3 mt-3">
          <div className="col-12">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4 fw-bold">
          Guardar Cambios
        </button>
      </form>
      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} mt-3`} role="alert">
          {mensaje.texto}
        </div>
      )}
      <a href="/eventos" className="btn btn-secondary mt-3">
        Volver a Eventos
      </a>
    </div>
  );
};

export default EditarEvento;