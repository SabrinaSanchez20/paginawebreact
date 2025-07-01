import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDataManager } from "../../../hooks/useDataManager";
import { alertaCrear } from "../../../components/alertas/alertaCrear/alertaCrear";
import { Calendar, Users, MapPin, Clock, DollarSign, Tag, Image, FileText, Save, ArrowLeft } from "lucide-react";

const EditarEvento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { eventos, updateEvento } = useDataManager();
  
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    descripcion: "",
    cupos: 0,
    instructor: "",
    duracion: "",
    precio: 0,
    categoria: "",
    imagen: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);

  const categorias = [
    "Programación",
    "Tecnología", 
    "Diseño",
    "Marketing",
    "Negocios",
    "Educación",
    "Salud",
    "Arte",
    "Deportes",
    "Otros"
  ];

  useEffect(() => {
    if (id && eventos.length > 0) {
      const evento = eventos.find(e => e.id.toString() === id);
      if (evento) {
        setFormData({
          nombre: evento.nombre || "",
          fecha: evento.fecha || "",
          descripcion: evento.descripcion || "",
          cupos: evento.cupos || 0,
          instructor: evento.instructor || "",
          duracion: evento.duracion || "",
          precio: evento.precio || 0,
          categoria: evento.categoria || "",
          imagen: evento.imagen || ""
        });
      } else {
        setMensaje({ tipo: "danger", texto: "Evento no encontrado." });
      }
    }
  }, [id, eventos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cupos' || name === 'precio' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    // Validaciones
    if (!formData.nombre.trim() || !formData.fecha.trim() || !formData.descripcion.trim() || formData.cupos < 1) {
      setMensaje({ tipo: "danger", texto: "Por favor completa todos los campos obligatorios correctamente." });
      setLoading(false);
      return;
    }

    // Validar que la fecha no sea en el pasado
    const fechaEvento = new Date(formData.fecha);
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);
    
    if (fechaEvento < fechaHoy) {
      setMensaje({ tipo: "danger", texto: "La fecha del evento no puede ser en el pasado." });
      setLoading(false);
      return;
    }

    if (!id) {
      setMensaje({ tipo: "danger", texto: "ID de evento no válido." });
      setLoading(false);
      return;
    }

    try {
      const eventoActualizado = {
        ...formData,
        disponibles: formData.cupos
      };

      const success = await updateEvento(id, eventoActualizado);
      
      if (success) {
        setMensaje({ tipo: "success", texto: "¡Evento actualizado exitosamente!" });
        alertaCrear();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/eventos");
        }, 2000);
      } else {
        setMensaje({ tipo: "danger", texto: "Error al actualizar el evento. Inténtalo de nuevo." });
      }
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      setMensaje({ tipo: "danger", texto: "Error al actualizar el evento. Inténtalo de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <button
              type="button"
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate('/eventos')}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="mb-1 text-dark fw-bold">
                <Calendar className="me-2" size={28} />
                Editar Evento
              </h2>
              <p className="text-muted mb-0">Actualiza la información del evento</p>
            </div>
          </div>

          {/* Mensajes */}
          {mensaje && (
            <div className={`alert alert-${mensaje.tipo} mb-4`} role="alert">
              <div className="d-flex align-items-center">
                {mensaje.tipo === 'success' ? '✅' : '⚠️'} 
                <span className="ms-2">{mensaje.texto}</span>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3 shadow-sm">
            <div className="row g-4">
              {/* Nombre del Evento */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <FileText size={16} className="me-2" />
                  Nombre del Evento *
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Taller de React Avanzado"
                  required
                />
              </div>

              {/* Fecha */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <Calendar size={16} className="me-2" />
                  Fecha del Evento *
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Cupos */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <Users size={16} className="me-2" />
                  Cupos Disponibles *
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="cupos"
                  value={formData.cupos}
                  min={1}
                  max={1000}
                  onChange={handleInputChange}
                  placeholder="Cantidad de cupos"
                  required
                />
              </div>

              {/* Duración */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <Clock size={16} className="me-2" />
                  Duración
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleInputChange}
                  placeholder="Ej: 4 horas, 2 días"
                />
              </div>

              {/* Instructor */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <MapPin size={16} className="me-2" />
                  Instructor/Facilitador
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="Nombre del instructor"
                />
              </div>

              {/* Precio */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <DollarSign size={16} className="me-2" />
                  Precio (opcional)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="precio"
                  value={formData.precio}
                  min={0}
                  onChange={handleInputChange}
                  placeholder="0 para eventos gratuitos"
                />
              </div>

              {/* Categoría */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <Tag size={16} className="me-2" />
                  Categoría
                </label>
                <select
                  className="form-select"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Imagen */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <Image size={16} className="me-2" />
                  URL de Imagen
                </label>
                <input
                  type="url"
                  className="form-control"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <small className="text-muted">Si no proporcionas una imagen, se usará una por defecto</small>
              </div>

              {/* Descripción */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  <FileText size={16} className="me-2" />
                  Descripción del Evento *
                </label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe detalladamente el evento, objetivos, qué aprenderán los participantes..."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Botones */}
            <div className="d-flex gap-3 mt-4">
              <button 
                type="submit" 
                className="btn btn-primary px-4 py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save size={18} className="me-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="btn btn-outline-secondary px-4 py-2"
                onClick={() => navigate('/eventos')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarEvento;