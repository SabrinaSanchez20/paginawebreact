import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import './register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const success = await register({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password
      });

      if (success) {
        navigate('/');
      } else {
        setError('Este email ya está registrado');
      }
    } catch (err) {
      setError('Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="register-card">
              <div className="register-header">
                <div className="register-icon">
                  <UserPlus size={40} />
                </div>
                <h2 className="mb-1">Crear Cuenta</h2>
                <p className="text-muted">Únete y descubre eventos increíbles</p>
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">
                    <User size={16} className="me-2" />
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <Mail size={16} className="me-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono" className="form-label">
                    <Phone size={16} className="me-2" />
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="form-control"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <Lock size={16} className="me-2" />
                    Contraseña
                  </label>
                  <div className="password-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    <Lock size={16} className="me-2" />
                    Confirmar contraseña
                  </label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-register"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              </form>

              <div className="register-footer">
                <p className="mb-0">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="link-primary">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
