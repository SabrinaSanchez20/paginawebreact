import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import './login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Email o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-card">
              <div className="login-header">
                <div className="login-icon">
                  <LogIn size={40} />
                </div>
                <h2 className="mb-1">Bienvenido</h2>
                <p className="text-muted">Inicia sesión para inscribirte a eventos</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <Mail size={16} className="me-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@email.com"
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
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <button
                  type="submit"
                  className="btn btn-primary btn-login"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>

              <div className="login-footer">
                <p className="mb-0">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/register" className="link-primary">
                    Regístrate aquí
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

export default Login;
