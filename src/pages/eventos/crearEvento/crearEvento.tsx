import React, { useState } from "react";
import { alertaCrear } from "../../../components/alertas/alertaCrear/alertaCrear";

const CrearEvento: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cupos, setCupos] = useState<number>(0);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !fecha.trim() || !descripcion.trim() || cupos < 1) {
      setMensaje({ tipo: "danger", texto: "Completa todos los campos correctamente." });
      return;
    }

    let eventosGuardados = [];
    const localEventos = localStorage.getItem("eventos");
    if (localEventos) {
      eventosGuardados = JSON.parse(localEventos);
    } else {
      fetch("/src/data/data.json")
        .then((res) => res.json())
        .then((data) => {
          eventosGuardados = data.eventos || [];
          agregarEvento(eventosGuardados);
        });
      return;
    }
    agregarEvento(eventosGuardados);
  };

  function agregarEvento(eventosGuardados: any[]) {
    const nuevoEvento = {
      id: eventosGuardados.length > 0 ? eventosGuardados[eventosGuardados.length - 1].id + 1 : 1,
      nombre,
      fecha,
      descripcion,
      cupos
    };
    eventosGuardados.push(nuevoEvento);
    localStorage.setItem("eventos", JSON.stringify(eventosGuardados));
    setMensaje({ tipo: "success", texto: "Evento creado correctamente." });
    alertaCrear();
    setNombre("");
    setFecha("");
    setDescripcion("");
    setCupos(0);
  }

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
          <div className="col-md-6">
            <label className="form-label">Cupos</label>
            <input
              type="number"
              className="form-control"
              value={cupos}
              min={1}
              onChange={(e) => setCupos(Number(e.target.value))}
              placeholder="Cantidad de cupos"
              required
            />
          </div>
          <div className="col-md-6"></div>
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