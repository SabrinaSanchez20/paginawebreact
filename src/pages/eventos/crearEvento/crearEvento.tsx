import React, { useState } from "react";

const CrearEvento: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
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
    setMensaje({ tipo: "success", texto: "Evento creado correctamente." });
    if (typeof window !== "undefined" && typeof window.mostrarAlerta === "function") {
      window.mostrarAlerta("exito", "Evento creado correctamente.");
    }
    setNombre("");
    setFecha("");
    setDescripcion("");
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Crear Evento</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre del Evento</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Taller de React"
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
              placeholder="Describe el evento..."
              rows={3}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success mt-4 fw-bold">
          Guardar Evento
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

export default CrearEvento;