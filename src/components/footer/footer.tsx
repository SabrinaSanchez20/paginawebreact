import React from "react";
import './footer.css';

const footerLinks = [
  { href: "/privacy", label: "Política de privacidad" },
  { href: "/terms", label: "Términos de servicio" },
  { href: "/contact", label: "Contacto" },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer mt-auto py-3">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span className="text-muted mb-2 mb-md-0">
          © {year} Gestor de Eventos. Todos los derechos reservados.
        </span>
        <ul className="list-inline mb-0">
          {footerLinks.map((link) => (
            <li className="list-inline-item" key={link.href}>
              <a href={link.href} className="footer-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
