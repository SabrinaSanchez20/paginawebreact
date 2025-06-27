import React from "react";

const features = [
  "Crear, editar y eliminar eventos o talleres",
  "Gestionar inscripciones de participantes",
  "Controlar cupos disponibles en cada evento",
];

const HomePage: React.FC = () => {
  return (
    <div className="container py-5">
      <section className="text-center mb-5">
        <h1 className="mb-3 fw-bold text-dark">Gestor de Eventos o Talleres</h1>
        <p className="lead text-secondary">
          Bienvenido al sistema profesional para la gestión de eventos y talleres.<br />
          Administra tus actividades, controla inscripciones y gestiona los cupos disponibles de manera sencilla y eficiente.
        </p>
      </section>
      <section className="mb-4">
        <h4 className="fw-semibold text-dark">¿Qué puedes hacer aquí?</h4>
        <ul className="list-group list-group-flush">
          {features.map((feature, idx) => (
            <li key={idx} className="list-group-item bg-transparent text-secondary">
              <span className="me-2" role="img" aria-label="check">✔️</span>
              {feature}
            </li>
          ))}
        </ul>
      </section>
      <div className="alert alert-secondary mt-4 shadow-sm">
        Ideal para instituciones educativas, centros de formación o cualquier organización que requiera administrar actividades y participantes.
      </div>
    </div>
  );
};

export default HomePage;