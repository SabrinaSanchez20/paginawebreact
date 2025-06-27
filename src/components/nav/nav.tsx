import React from "react";
import { NavLink, Link } from "react-router-dom";
import './nav.css';

const navItems = [
  { path: "/", label: "Inicio", exact: true },
  { path: "/eventos", label: "Eventos" },
  { path: "/inscripciones", label: "Inscripciones" },
  { path: "/configuracion", label: "Configuración" },
];

const Nav: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span role="img" aria-label="logo">🎓</span>
          Gestor de Eventos
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                  end={item.exact}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;