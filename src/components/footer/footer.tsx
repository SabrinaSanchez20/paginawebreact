import React from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";
import './footer.css';

const footerLinks = [
  { href: "/privacy", label: "Política de privacidad" },
  { href: "/terms", label: "Términos de servicio" },
  { href: "/contact", label: "Contacto" },
  { href: "/help", label: "Ayuda" },
];

const socialLinks = [
  { href: "https://github.com", icon: <Github size={20} />, label: "GitHub" },
  { href: "https://twitter.com", icon: <Twitter size={20} />, label: "Twitter" },
  { href: "https://linkedin.com", icon: <Linkedin size={20} />, label: "LinkedIn" },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="modern-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span className="logo-icon">🎓</span>
                <span className="logo-text">Eventify</span>
              </Link>
              <p className="footer-description">
                La plataforma líder para descubrir, inscribirse y participar en eventos únicos que transformarán tu experiencia.
              </p>
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-title">Enlaces</h5>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/eventos">Eventos</Link></li>
              <li><Link to="/register">Registro</Link></li>
              <li><Link to="/login">Iniciar Sesión</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Legal</h5>
            <ul className="footer-links">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Contacto</h5>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>info@eventify.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+56 2 1233 4568</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Santiago, Chile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright">
                © {year} Eventify. Todos los derechos reservados.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="made-with">
                Hecho con <Heart size={16} className="heart-icon" /> para una mejor experiencia
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
