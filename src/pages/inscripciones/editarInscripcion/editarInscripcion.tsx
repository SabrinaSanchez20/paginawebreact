import React, { useState } from "react";

const opcionesEventos = [
  { value: "", label: "Por favor elige un evento" },
  { value: "taller-react", label: "Taller de React" },
  { value: "seminario-web", label: "Seminario de Desarrollo Web" },
  { value: "curso-python", label: "Curso de Python" },
  { value: "workshop-js", label: "Workshop de JavaScript" },
  { value: "bootcamp-fullstack", label: "Bootcamp Full Stack" },
];

const EditarInscripcion: React.FC = () => {
  const [nombre, setNombre] = useState("Juan Pérez");
  const [evento, setEvento] = useState("taller-react");
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !evento.trim()) {
      setMensaje({ tipo: "danger", texto: "Completa todos los campos correctamente." });
      if (typeof window !== "undefined" && typeof window.mostrarAlerta === "function") {
        window.mostrarAlerta("validacion", "Completa todos los campos correctamente.");
      }
      return;
    }
    setMensaje({ tipo: "success", texto: "Inscripción editada correctamente." });
    if (typeof window !== "undefined" && typeof window.mostrarAlerta === "function") {
      window.mostrarAlerta("exito", "Inscripción editada correctamente.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Editar Inscripción</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre del Participante</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="evento-select">
              Evento de Informática
            </label>
            <select
              name="evento"
              id="evento-select"
              className="form-control"
              value={evento}
              onChange={(e) => setEvento(e.target.value)}
              required
            >
              {opcionesEventos.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
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
    </div>
  );
};

export default EditarInscripcion;