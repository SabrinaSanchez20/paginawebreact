import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, Settings, Calendar, Users, Menu, X } from "lucide-react";
import './nav.css';

const Nav: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Inicio", exact: true, icon: <span role="img" aria-label="home">🏠</span> },
    { path: "/eventos", label: "Eventos", icon: <Calendar size={18} /> },
    ...(isAuthenticated && !isAdmin ? [
      { path: "/misInscripciones", label: "Mis Inscripciones", icon: <Users size={18} /> },
    ] : []),
    ...(isAdmin ? [
      { path: "/inscripciones", label: "Inscripciones", icon: <Users size={18} /> },
      { path: "/configuracion", label: "Configuración", icon: <Settings size={18} /> },
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeMenus}>
          <span className="brand-icon" role="img" aria-label="logo">🎓</span>
          <span className="brand-text">Eventify</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
                  }
                  end={item.exact}
                  onClick={closeMenus}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center gap-2 btn-link border-0"
                  onClick={toggleUserMenu}
                  aria-expanded={isUserMenuOpen}
                >
                  <User size={18} />
                  <span className="user-name">{user?.nombre}</span>
                  {isAdmin && <span className="badge bg-warning text-dark ms-1">Admin</span>}
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${isUserMenuOpen ? 'show' : ''}`}>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeMenus}>
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={closeMenus}>
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;