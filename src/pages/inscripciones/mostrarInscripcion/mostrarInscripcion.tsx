import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Inscripcion {
  id: number;
  nombre: string;
  evento: string;
}

const opcionesEventos = [
  { value: "", label: "Por favor elige un evento" },
  { value: "taller-react", label: "Taller de React" },
  { value: "seminario-web", label: "Seminario de Desarrollo Web" },
  { value: "curso-python", label: "Curso de Python" },
  { value: "workshop-js", label: "Workshop de JavaScript" },
  { value: "bootcamp-fullstack", label: "Bootcamp Full Stack" },
];

const MostrarInscripcion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inscripcion, setInscripcion] = useState<Inscripcion | null>(null);

  useEffect(() => {
    const idNumber = Number(id);

    // Buscar primero en localStorage
    const localInscripciones = localStorage.getItem("inscripciones");
    let encontrada: Inscripcion | undefined;
    if (localInscripciones) {
      const inscripciones = (JSON.parse(localInscripciones) as Inscripcion[]).map(insc => ({
        ...insc,
        id: Number(insc.id)
      }));
      encontrada = inscripciones.find((i) => i.id === idNumber);
    }
    if (encontrada) {
      setInscripcion(encontrada);
    } else {
      // Si no está en localStorage, buscar en data.json
      fetch("/src/data/data.json")
        .then((res) => res.json())
        .then((data) => {
          const insc = (data.inscripciones || [])
            .map((i: Inscripcion) => ({ ...i, id: Number(i.id) }))
            .find((i: Inscripcion) => i.id === idNumber);
          if (insc) setInscripcion(insc);
          else setInscripcion(null);
        })
        .catch(() => setInscripcion(null));
    }
  }, [id]);

  if (!inscripcion) {
    return (
      <div className="container py-5">
        <div className="alert alert-secondary mt-4">
          No se encontró información de la inscripción.
        </div>
        <Link to="/inscripciones" className="btn btn-secondary mt-4">
          Volver a Inscripciones
        </Link>
      </div>
    );
  }

  const eventoLabel =
    opcionesEventos.find((op) => op.value === inscripcion.evento)?.label || inscripcion.evento;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Detalle de la Inscripción</h2>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title fw-bold">{inscripcion.nombre}</h4>
          <p className="card-text mb-2">
            <strong>Evento:</strong> {eventoLabel}
          </p>
        </div>
      </div>
      <Link to="/inscripciones" className="btn btn-secondary mt-4">
        Volver a Inscripciones
      </Link>
    </div>
  );
};

export default MostrarInscripcion;