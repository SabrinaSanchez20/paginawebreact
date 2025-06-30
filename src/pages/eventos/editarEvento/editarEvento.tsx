import React, { useState, useEffect } from "react";

const EditarEvento: React.FC = () => {
  const [nombre, setNombre] = useState("Taller de React");
  const [fecha, setFecha] = useState("2025-07-01");
  const [descripcion, setDescripcion] = useState("Un taller práctico de React.");
  const [cupos, setCupos] = useState<number>(0);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);
  const [eventoId, setEventoId] = useState<number | null>(null);

  useEffect(() => {
    const eventoSeleccionado = localStorage.getItem("eventoSeleccionado");
    if (eventoSeleccionado) {
      const evento = JSON.parse(eventoSeleccionado);
      setEventoId(evento.id);
      setNombre(evento.nombre);
      setFecha(evento.fecha);
      setDescripcion(evento.descripcion);
      setCupos(evento.cupos ?? 0);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !fecha.trim() || !descripcion.trim() || cupos < 1) {
      setMensaje({ tipo: "danger", texto: "Completa todos los campos correctamente." });
      return;
    }

    let eventosGuardados: any[] = [];
    const localEventos = localStorage.getItem("eventos");
    if (localEventos) {
      eventosGuardados = JSON.parse(localEventos);
      actualizarEvento(eventosGuardados);
    } else {
      fetch("/src/data/data.json")
        .then((res) => res.json())
        .then((data) => {
          eventosGuardados = data.eventos || [];
          actualizarEvento(eventosGuardados);
        });
    }
  };

  function actualizarEvento(eventosGuardados: any[]) {
    if (eventoId == null) return;
    const index = eventosGuardados.findIndex((ev) => ev.id === eventoId);
    if (index !== -1) {
      eventosGuardados[index] = {
        ...eventosGuardados[index],
        nombre,
        fecha,
        descripcion,
        cupos
      };
      localStorage.setItem("eventos", JSON.stringify(eventosGuardados));
      setMensaje({ tipo: "success", texto: "Evento editado correctamente." });
    } else {
      setMensaje({ tipo: "danger", texto: "No se encontró el evento a editar." });
    }
  }

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