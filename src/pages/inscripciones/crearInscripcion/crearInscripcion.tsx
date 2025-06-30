import React, { useState } from "react";
import { alertaCrear } from "../../../components/alertas/alertaCrear/alertaCrear";

const opcionesEventos = [
  { value: "", label: "Por favor elige un evento" },
  { value: "taller-react", label: "Taller de React" },
  { value: "seminario-web", label: "Seminario de Desarrollo Web" },
  { value: "curso-python", label: "Curso de Python" },
  { value: "workshop-js", label: "Workshop de JavaScript" },
  { value: "bootcamp-fullstack", label: "Bootcamp Full Stack" },
];

const CrearInscripcion: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [evento, setEvento] = useState("");
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !evento.trim()) {
      setMensaje({ tipo: "danger", texto: "Completa todos los campos correctamente." });
      return;
    }

    let inscripcionesGuardadas = [];
    const localInscripciones = localStorage.getItem("inscripciones");
    if (localInscripciones) {
      inscripcionesGuardadas = JSON.parse(localInscripciones);
      agregarInscripcion(inscripcionesGuardadas);
    } else {
      fetch("/src/data/data.json")
        .then((res) => res.json())
        .then((data) => {
          inscripcionesGuardadas = data.inscripciones || [];
          agregarInscripcion(inscripcionesGuardadas);
        });
      return;
    }
  };

  function agregarInscripcion(inscripcionesGuardadas: any[]) {
    const nuevaInscripcion = {
      id: inscripcionesGuardadas.length > 0 ? inscripcionesGuardadas[inscripcionesGuardadas.length - 1].id + 1 : 1,
      nombre,
      evento
    };
    inscripcionesGuardadas.push(nuevaInscripcion);
    localStorage.setItem("inscripciones", JSON.stringify(inscripcionesGuardadas));
    setMensaje({ tipo: "success", texto: "Inscripción creada correctamente." });
    alertaCrear();
    setNombre("");
    setEvento("");
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Crear Inscripción</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre del Participante</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez"
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
        <button type="submit" className="btn btn-success mt-4 fw-bold">
          Guardar Inscripción
        </button>
      </form>
      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} mt-3`} role="alert">
          {mensaje.texto}
        </div>
      )}
      <a href="/inscripciones" className="btn btn-secondary mt-3">
        Volver a Inscripciones
      </a> 
    </div>
  );
} 

export default CrearInscripcion;