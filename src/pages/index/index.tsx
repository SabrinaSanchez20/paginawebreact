import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Calendar, Users, Star, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import './index.css';

const features = [
  {
    icon: <Calendar size={24} />,
    title: "Eventos Increíbles",
    description: "Descubre y participa en eventos únicos diseñados para enriquecer tu experiencia"
  },
  {
    icon: <Users size={24} />,
    title: "Comunidad Activa",
    description: "Conecta con personas que comparten tus intereses y pasiones"
  },
  {
    icon: <Star size={24} />,
    title: "Experiencias Memorables",
    description: "Vive momentos que marcarán la diferencia en tu crecimiento personal"
  }
];

const benefits = [
  "Registro rápido y sencillo",
  "Variedad de eventos disponibles",
  "Gestión inteligente de cupos",
  "Notificaciones en tiempo real",
  "Interfaz moderna e intuitiva"
];

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="hero-badge">
                  <Sparkles size={16} />
                  <span>Nuevas experiencias te esperan</span>
                </div>
                <h1 className="hero-title">
                  Descubre eventos que <span className="highlight">transformarán</span> tu experiencia
                </h1>
                <p className="hero-description">
                  Únete a nuestra comunidad y participa en eventos únicos diseñados para inspirar, conectar y crear momentos inolvidables.
                </p>
                <div className="hero-actions">
                  {isAuthenticated ? (
                    <div className="welcome-message">
                      <h4>¡Bienvenido, {user?.nombre}! 👋</h4>
                      <Link to="/eventos" className="btn btn-primary btn-hero">
                        Ver Eventos
                        <ArrowRight size={20} className="ms-2" />
                      </Link>
                    </div>
                  ) : (
                    <>
                      <Link to="/register" className="btn btn-primary btn-hero">
                        Únete Ahora
                        <ArrowRight size={20} className="ms-2" />
                      </Link>
                      <Link to="/eventos" className="btn btn-outline-light btn-hero-secondary">
                        Explorar Eventos
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <div className="hero-card card-1">
                  <Calendar size={32} />
                  <h5>Eventos en Vivo</h5>
                  <p>Participa en experiencias únicas</p>
                </div>
                <div className="hero-card card-2">
                  <Users size={32} />
                  <h5>Comunidad</h5>
                  <p>Conecta con personas increíbles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">¿Por qué elegirnos?</h2>
            <p className="section-description">
              Ofrecemos una experiencia completa para descubrir y participar en eventos increíbles
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title">Una plataforma diseñada para ti</h2>
              <p className="section-description mb-4">
                Hemos creado la experiencia perfecta para que puedas descubrir, inscribirte y disfrutar de eventos increíbles sin complicaciones.
              </p>
              <ul className="benefits-list">
                {benefits.map((benefit, index) => (
                  <li key={index} className="benefit-item">
                    <CheckCircle size={20} className="benefit-icon" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="benefits-image">
                <div className="floating-card card-stats">
                  <h3>500+</h3>
                  <p>Eventos realizados</p>
                </div>
                <div className="floating-card card-users">
                  <h3>2k+</h3>
                  <p>Usuarios activos</p>
                </div>
                <div className="floating-card card-rating">
                  <h3>4.9★</h3>
                  <p>Calificación promedio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h2 className="cta-title">¿Listo para comenzar tu aventura?</h2>
                <p className="cta-description">
                  Únete a miles de personas que ya están disfrutando de experiencias increíbles en nuestra plataforma.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-primary btn-cta">
                    Crear mi cuenta
                    <ArrowRight size={20} className="ms-2" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;