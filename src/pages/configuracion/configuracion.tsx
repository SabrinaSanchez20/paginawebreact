import React, { useState } from "react";

const ConfiguracionPage: React.FC = () => {
  const [institucion, setInstitucion] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "danger"; texto: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institucion.trim() || !email.trim()) {
      setMensaje({ tipo: "danger", texto: "Por favor, completa todos los campos obligatorios." });
      return;
    }
    setMensaje({ tipo: "success", texto: "Configuración guardada correctamente." });
    // Aquí podrías guardar la configuración en un backend o localStorage
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark fw-bold">Configuración</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Nombre de la Institución <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            required
            placeholder="Ej: Instituto ABC"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico <span className="text-danger">*</span></label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ej: contacto@instituto.com"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: +54 11 1234-5678"
          />
        </div>
        <button type="submit" className="btn btn-success w-100 fw-bold">
          Guardar Configuración
        </button>
      </form>
      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} mt-3`} role="alert">
          {mensaje.texto}
        </div>
      )}
    </div>
  );
};

export default ConfiguracionPage;
