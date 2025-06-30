import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  descripcion?: string;
  cupos: number;
}

const MostrarEvento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);

  useEffect(() => {
    const idNumber = Number(id);

    const localEventos = localStorage.getItem("eventos");
    let encontrado: Evento | undefined;
    if (localEventos) {
      const eventos = (JSON.parse(localEventos) as Evento[]).map(ev => ({
        ...ev,
        id: Number(ev.id)
      }));
      encontrado = eventos.find((e) => e.id === idNumber);
    }
    if (encontrado) {
      setEvento(encontrado);
    } else {
      fetch("/src/data/data.json")
        .then((res) => res.json())
        .then((data) => {
          const ev = (data.eventos || [])
            .map((e: Evento) => ({ ...e, id: Number(e.id) }))
            .find((e: Evento) => e.id === idNumber);
          if (ev) setEvento(ev);
          else setEvento(null);
        })
        .catch(() => setEvento(null));
    }
  }, [id]);

  if (!evento) {
    return (
      <div className="container py-5">
        <div className="alert alert-secondary mt-4">
          No se encontró información del evento.
        </div>
        <Link to="/eventos" className="btn btn-secondary mt-4">
          Volver a Eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Detalle del Evento</h2>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title fw-bold">{evento.nombre}</h4>
          <p className="card-text mb-2">
            <strong>Fecha:</strong> {evento.fecha}
          </p>
          <p className="card-text mb-2">
            <strong>Cupos:</strong> {evento.cupos}
          </p>
          <p className="card-text">
            <strong>Descripción:</strong> {evento.descripcion}
          </p>
        </div>
      </div>
      <Link to="/eventos" className="btn btn-secondary mt-4">
        Volver a Eventos
      </Link>
    </div>
  );
};

export default MostrarEvento;