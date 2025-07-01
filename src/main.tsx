import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/nav/nav';
import AppRoutes from './routes/routes';
import Footer from './components/footer/footer';
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

const App = () => {
  return (
    <AuthProvider>
      <Nav />
      <AppRoutes />
      <Footer />
    </AuthProvider>
  );
};

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('❌ No se encontró el elemento root');
}
