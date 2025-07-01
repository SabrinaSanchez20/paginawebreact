import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDataManager } from "../../../hooks/useDataManager";

const EditarInscripcion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { inscripciones, eventos, usuarios, updateInscripcion } = useDataManager();
  
  const [usuarioId, setUsuarioId] = useState("");
  const [eventoId, setEventoId] = useState("");
  const [estado, setEstado] = useState("confirmada");
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);

  useEffect(() => {
    if (id && inscripciones.length > 0) {
      const inscripcion = inscripciones.find(i => i.id.toString() === id);
      if (inscripcion) {
        setUsuarioId(inscripcion.usuarioId.toString());
        setEventoId(inscripcion.eventoId.toString());
        setEstado(inscripcion.estado);
      } else {
        setMensaje({ tipo: "danger", texto: "Inscripción no encontrada." });
      }
    }
  }, [id, inscripciones]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId.trim() || !eventoId.trim()) {
      setMensaje({ tipo: "danger", texto: "Completa todos los campos correctamente." });
      return;
    }

    if (!id) {
      setMensaje({ tipo: "danger", texto: "ID de inscripción no válido." });
      return;
    }

    const inscripcionActualizada = {
      usuarioId,
      eventoId,
      estado
    };

    const success = await updateInscripcion(id, inscripcionActualizada);
    
    if (success) {
      setMensaje({ tipo: "success", texto: "Inscripción actualizada correctamente." });
      setTimeout(() => {
        navigate("/inscripciones");
      }, 2000);
    } else {
      setMensaje({ tipo: "danger", texto: "Error al actualizar la inscripción." });
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Editar Inscripción</h2>
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
        <button type="submit" className="btn btn-primary mt-4 fw-bold">
          Guardar Cambios
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

export default EditarInscripcion;