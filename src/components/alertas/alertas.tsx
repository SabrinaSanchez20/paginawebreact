import React, { useEffect } from "react";
import './alertas.css';

const AlertasGlobales: React.FC = () => {
  useEffect(() => {
    (window as any).mostrarAlerta = (tipo: string, mensaje: string) => {
      (window as any).cerrarTodasAlertas();
      if (tipo === 'exito') {
        const mensajeExito = document.getElementById('mensajeExito');
        const alertaExito = document.getElementById('alertaExito');
        if (mensajeExito && alertaExito) {
          mensajeExito.textContent = mensaje;
          alertaExito.style.display = 'block';
        }
      } else if (tipo === 'error') {
        const mensajeError = document.getElementById('mensajeError');
        const alertaError = document.getElementById('alertaError');
        if (mensajeError && alertaError) {
          mensajeError.textContent = mensaje;
          alertaError.style.display = 'block';
        }
      } else if (tipo === 'validacion') {
        const mensajeValidacion = document.getElementById('mensajeValidacion');
        const alertaValidacion = document.getElementById('alertaValidacion');
        if (mensajeValidacion && alertaValidacion) {
          mensajeValidacion.textContent = mensaje;
          alertaValidacion.style.display = 'block';
        }
      }
    };
    (window as any).cerrarAlerta = (id: string) => {
      const alerta = document.getElementById(id);
      if (alerta) alerta.style.display = 'none';
    };
    (window as any).cerrarTodasAlertas = () => {
      const exito = document.getElementById('alertaExito');
      const error = document.getElementById('alertaError');
      const validacion = document.getElementById('alertaValidacion');
      if (exito) exito.style.display = 'none';
      if (error) error.style.display = 'none';
      if (validacion) validacion.style.display = 'none';
    };
  }, []);

  return (
    <>
      <div className="alerta alerta-exito" id="alertaExito" style={{display: "none"}}>
        <span className="alerta-mensaje" id="mensajeExito"></span>
        <button className="alerta-cerrar" onClick={() => (window as any).cerrarAlerta('alertaExito')}>&times;</button>
      </div>
      <div className="alerta alerta-error" id="alertaError" style={{display: "none"}}>
        <span className="alerta-mensaje" id="mensajeError"></span>
        <button className="alerta-cerrar" onClick={() => (window as any).cerrarAlerta('alertaError')}>&times;</button>
      </div>
      <div className="alerta alerta-validacion" id="alertaValidacion" style={{display: "none"}}>
        <span className="alerta-mensaje" id="mensajeValidacion"></span>
        <button className="alerta-cerrar" onClick={() => (window as any).cerrarAlerta('alertaValidacion')}>&times;</button>
      </div>
    </>
  );
};

export default AlertasGlobales;

declare global {
  interface Window {
    mostrarAlerta: (tipo: string, mensaje: string) => void;
    cerrarAlerta: (id: string) => void;
    cerrarTodasAlertas: () => void;
  }
}