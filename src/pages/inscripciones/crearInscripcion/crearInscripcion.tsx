import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataManager } from "../../../hooks/useDataManager";
import { alertaCrear } from "../../../components/alertas/alertaCrear/alertaCrear";

const CrearInscripcion: React.FC = () => {
  const [usuarioId, setUsuarioId] = useState("");
  const [eventoId, setEventoId] = useState("");
  const [estado, setEstado] = useState("confirmada");
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);
  const navigate = useNavigate();
  const { eventos, usuarios, createInscripcion } = useDataManager();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId.trim() || !eventoId.trim()) {
      setMensaje({ tipo: "danger", texto: "Completa todos los campos correctamente." });
      return;
    }

    const nuevaInscripcion = {
      usuarioId,
      eventoId,
      fechaInscripcion: new Date().toISOString().split('T')[0],
      estado
    };

    const success = await createInscripcion(nuevaInscripcion);
    
    if (success) {
      setMensaje({ tipo: "success", texto: "Inscripción creada correctamente." });
      alertaCrear();
      // Limpiar formulario
      setUsuarioId("");
      setEventoId("");
      setEstado("confirmada");
      
      setTimeout(() => {
        navigate("/inscripciones");
      }, 2000);
    } else {
      setMensaje({ tipo: "danger", texto: "Error al crear la inscripción." });
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Crear Inscripción</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Usuario</label>
            <select
              className="form-control"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              required
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} - {usuario.email}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Evento</label>
            <select
              className="form-control"
              value={eventoId}
              onChange={(e) => setEventoId(e.target.value)}
              required
            >
              <option value="">Seleccionar evento</option>
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.id}>
                  {evento.nombre} - {evento.fecha}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <label className="form-label">Estado</label>
            <select
              className="form-control"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            >
              <option value="confirmada">Confirmada</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-success mt-4 fw-bold">
          Guardar Inscripción
        </button>
      </form>
      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} mt-3`} role="alert">
          {mensaje.texto}
        </div>
      )}
      <button 
        type="button" 
        className="btn btn-secondary mt-3"
        onClick={() => navigate("/inscripciones")}
      >
        Volver a Inscripciones
      </button>
    </div>
  );
};

export default CrearInscripcion;