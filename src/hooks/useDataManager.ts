import { useState, useEffect } from 'react';

export interface Evento {
  id: number | string;
  nombre: string;
  fecha: string;
  descripcion: string;
  cupos: number;
  disponibles?: number;
  imagen?: string;
  instructor?: string;
  duracion?: string;
  precio?: number;
  categoria?: string;
}

export interface Inscripcion {
  id: number | string;
  usuarioId: number | string;
  eventoId: number | string;
  fechaInscripcion: string;
  estado: string;
}

export interface SolicitudDesinscripcion {
  id: number | string;
  inscripcionId: number | string;
  usuarioId: number | string;
  eventoId: number | string;
  fechaSolicitud: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  motivo?: string;
}

export interface Usuario {
  id: number | string;
  nombre: string;
  email: string;
  password?: string;
  telefono?: string;
  isAdmin: boolean;
  fechaRegistro?: string;
}

// Hook personalizado para manejar datos con localStorage como respaldo
export const useDataManager = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [solicitudesDesinscripcion, setSolicitudesDesinscripcion] = useState<SolicitudDesinscripcion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar datos
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Limpiar usuarios del localStorage si existen
      cleanupUsersFromLocalStorage();
      
      // Primero intentar cargar desde localStorage como fallback inmediato
      loadFromLocalStorage();
      
      // Luego intentar sincronizar con el servidor
      try {
        await Promise.all([
          loadEventos(),
          loadInscripciones(),
          loadUsuarios(),
          loadSolicitudesDesinscripcion()
        ]);
      } catch (serverError) {
        console.log('Servidor no disponible, usando datos locales');
        // Los datos de localStorage ya están cargados
      }
    } catch (err) {
      console.error('Error al inicializar datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar usuarios del localStorage
  const cleanupUsersFromLocalStorage = () => {
    if (localStorage.getItem('usuarios')) {
      localStorage.removeItem('usuarios');
    }
  };

  const loadFromLocalStorage = () => {
    // Cargar eventos
    const localEventos = localStorage.getItem('eventos');
    if (localEventos) {
      setEventos(JSON.parse(localEventos));
    }

    // Cargar inscripciones
    const localInscripciones = localStorage.getItem('inscripciones');
    if (localInscripciones) {
      setInscripciones(JSON.parse(localInscripciones));
    }

    // Cargar solicitudes de desinscripción
    const localSolicitudes = localStorage.getItem('solicitudesDesinscripcion');
    if (localSolicitudes) {
      setSolicitudesDesinscripcion(JSON.parse(localSolicitudes));
    }

    // NO cargar usuarios desde localStorage - Solo desde servidor
  };

  // EVENTOS
  const loadEventos = async () => {
    try {
      const response = await fetch('http://localhost:3000/eventos');
      if (response.ok) {
        const data = await response.json();
        setEventos(data);
        localStorage.setItem('eventos', JSON.stringify(data));
      }
    } catch (error) {
      const localEventos = localStorage.getItem('eventos');
      if (localEventos) {
        setEventos(JSON.parse(localEventos));
      }
    }
  };

  const createEvento = async (evento: Omit<Evento, 'id'>): Promise<boolean> => {
    try {
      const newEvento = {
        ...evento,
        id: Date.now(),
        disponibles: evento.cupos
      };

      // Intentar crear en servidor
      try {
        const response = await fetch('http://localhost:3000/eventos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvento),
        });

        if (response.ok) {
          const createdEvento = await response.json();
          setEventos(prev => [...prev, createdEvento]);
          
          // Actualizar localStorage
          const updatedEventos = [...eventos, createdEvento];
          localStorage.setItem('eventos', JSON.stringify(updatedEventos));
          return true;
        }
      } catch (serverError) {
        console.log('Servidor no disponible, guardando en localStorage');
      }

      // Fallback a localStorage
      const updatedEventos = [...eventos, newEvento];
      setEventos(updatedEventos);
      localStorage.setItem('eventos', JSON.stringify(updatedEventos));
      return true;
    } catch (error) {
      setError('Error al crear evento');
      return false;
    }
  };

  const updateEvento = async (id: number | string, eventoData: Partial<Evento>): Promise<boolean> => {
    try {
      // Intentar actualizar en servidor
      try {
        const response = await fetch(`http://localhost:3000/eventos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventoData),
        });

        if (response.ok) {
          const updatedEvento = await response.json();
          setEventos(prev => prev.map(e => e.id === id ? updatedEvento : e));
          
          // Actualizar localStorage
          const updatedEventos = eventos.map(e => e.id === id ? updatedEvento : e);
          localStorage.setItem('eventos', JSON.stringify(updatedEventos));
          return true;
        }
      } catch (serverError) {
        console.log('Servidor no disponible, actualizando en localStorage');
      }

      // Fallback a localStorage
      const updatedEventos = eventos.map(e => 
        e.id === id ? { ...e, ...eventoData } : e
      );
      setEventos(updatedEventos);
      localStorage.setItem('eventos', JSON.stringify(updatedEventos));
      return true;
    } catch (error) {
      setError('Error al actualizar evento');
      return false;
    }
  };

  const deleteEvento = async (id: number | string): Promise<boolean> => {
    try {
      // Intentar eliminar del servidor
      try {
        const response = await fetch(`http://localhost:3000/eventos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setEventos(prev => prev.filter(e => e.id !== id));
          
          // Actualizar localStorage
          const updatedEventos = eventos.filter(e => e.id !== id);
          localStorage.setItem('eventos', JSON.stringify(updatedEventos));
          return true;
        }
      } catch (serverError) {
        console.log('Servidor no disponible, eliminando de localStorage');
      }

      // Fallback a localStorage
      const updatedEventos = eventos.filter(e => e.id !== id);
      setEventos(updatedEventos);
      localStorage.setItem('eventos', JSON.stringify(updatedEventos));
      return true;
    } catch (error) {
      setError('Error al eliminar evento');
      return false;
    }
  };

  // INSCRIPCIONES
  const loadInscripciones = async () => {
    try {
      const response = await fetch('http://localhost:3000/inscripciones');
      if (response.ok) {
        const data = await response.json();
        setInscripciones(data);
        localStorage.setItem('inscripciones', JSON.stringify(data));
      }
    } catch (error) {
      const localInscripciones = localStorage.getItem('inscripciones');
      if (localInscripciones) {
        setInscripciones(JSON.parse(localInscripciones));
      }
    }
  };

  const createInscripcion = async (inscripcion: Omit<Inscripcion, 'id'>): Promise<boolean> => {
    try {
      const newInscripcion: Inscripcion = {
        ...inscripcion,
        id: Date.now().toString(),
        fechaInscripcion: inscripcion.fechaInscripcion || new Date().toISOString().split('T')[0],
        estado: inscripcion.estado || 'confirmada'
      };

      // Intentar crear en servidor
      try {
        const response = await fetch('http://localhost:3000/inscripciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInscripcion),
        });

        if (response.ok) {
          const createdInscripcion = await response.json();
          setInscripciones(prev => [...prev, createdInscripcion]);
          
          // Actualizar localStorage
          const updatedInscripciones = [...inscripciones, createdInscripcion];
          localStorage.setItem('inscripciones', JSON.stringify(updatedInscripciones));
          return true;
        }
      } catch (serverError) {
        console.log('Servidor no disponible, guardando inscripción en localStorage');
      }

      // Fallback a localStorage
      const updatedInscripciones = [...inscripciones, newInscripcion];
      setInscripciones(updatedInscripciones);
      localStorage.setItem('inscripciones', JSON.stringify(updatedInscripciones));
      return true;
    } catch (error) {
      setError('Error al crear inscripción');
      return false;
    }
  };

  const updateInscripcion = async (id: number | string, inscripcionData: Partial<Inscripcion>): Promise<boolean> => {
    try {
      // Intentar actualizar en servidor
      try {
        const response = await fetch(`http://localhost:3000/inscripciones/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inscripcionData),
        });

        if (response.ok) {
          const updatedInscripcion = await response.json();
          setInscripciones(prev => prev.map(i => i.id === id ? updatedInscripcion : i));
          
          // Actualizar localStorage
          const updatedInscripciones = inscripciones.map(i => i.id === id ? updatedInscripcion : i);
          localStorage.setItem('inscripciones', JSON.stringify(updatedInscripciones));
          return true;
        }
      } catch (serverError) {
        console.log('Servidor no disponible, actualizando inscripción en localStorage');
      }

      // Fallback a localStorage
      const updatedInscripciones = inscripciones.map(i => 
        i.id === id ? { ...i, ...inscripcionData } : i
      );
      setInscripciones(updatedInscripciones);
      localStorage.setItem('inscripciones', JSON.stringify(updatedInscripciones));
      return true;
    } catch (error) {
      setError('Error al actualizar inscripción');
      return false;
    }
  };

  const deleteInscripcion = async (id: number | string): Promise<boolean> => {
    try {
      // Intentar eliminar del servidor
      try {
        const response = await fetch(`http://localhost:3000/inscripciones/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setInscripciones(prev => prev.filter(i => i.id !== id));
          
          // Actualizar localStorage
          const updatedInscripciones = inscripciones.filter(i => i.id !== id);
          localStorage.setItem('inscripciones', JSON.stringify(updatedInscripciones));
          return true;
        }
      } catch (serverError) {
        console.log('Servidor no disponible, eliminando inscripción de localStorage');
      }

      // Fallback a localStorage
      const updatedInscripciones = inscripciones.filter(i => i.id !== id);
      setInscripciones(updatedInscripciones);
      localStorage.setItem('inscripciones', JSON.stringify(updatedInscripciones));
      return true;
    } catch (error) {
      setError('Error al eliminar inscripción');
      return false;
    }
  };

  // USUARIOS - Solo desde servidor, no localStorage
  const loadUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
        // NO guardar en localStorage
      } else {
        setUsuarios([]); // Array vacío si no hay servidor
      }
    } catch (error) {
      setUsuarios([]); // Array vacío si no hay conexión
    }
  };

  const createUsuario = async (usuario: Omit<Usuario, 'id'>): Promise<boolean> => {
    try {
      const newUsuario = {
        ...usuario,
        id: Date.now().toString(),
        fechaRegistro: new Date().toISOString().split('T')[0]
      };

      // SOLO intentar crear en servidor - NO localStorage
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUsuario),
      });

      if (response.ok) {
        const createdUsuario = await response.json();
        setUsuarios(prev => [...prev, createdUsuario]);
        return true;
      } else {
        throw new Error('Error del servidor al crear usuario');
      }
    } catch (error) {
      setError('Error: Usuarios requieren conexión al servidor');
      return false;
    }
  };

  const updateUsuario = async (id: number | string, usuarioData: Partial<Usuario>): Promise<boolean> => {
    try {
      // SOLO actualizar en servidor - NO localStorage
      const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData),
      });

      if (response.ok) {
        const updatedUsuario = await response.json();
        setUsuarios(prev => prev.map(u => u.id === id ? updatedUsuario : u));
        return true;
      } else {
        throw new Error('Error del servidor al actualizar usuario');
      }
    } catch (error) {
      setError('Error: Usuarios requieren conexión al servidor');
      return false;
    }
  };

  const deleteUsuario = async (id: number | string): Promise<boolean> => {
    try {
      // SOLO eliminar del servidor - NO localStorage
      const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsuarios(prev => prev.filter(u => u.id !== id));
        return true;
      } else {
        throw new Error('Error del servidor al eliminar usuario');
      }
    } catch (error) {
      setError('Error: Usuarios requieren conexión al servidor');
      return false;
    }
  };

  // SOLICITUDES DE DESINSCRIPCIÓN
  const loadSolicitudesDesinscripcion = async () => {
    try {
      const response = await fetch('http://localhost:3000/solicitudesDesinscripcion');
      if (response.ok) {
        const data = await response.json();
        setSolicitudesDesinscripcion(data);
        localStorage.setItem('solicitudesDesinscripcion', JSON.stringify(data));
      }
    } catch (error) {
      const localSolicitudes = localStorage.getItem('solicitudesDesinscripcion');
      if (localSolicitudes) {
        setSolicitudesDesinscripcion(JSON.parse(localSolicitudes));
      } else {
        setSolicitudesDesinscripcion([]);
      }
    }
  };

  const createSolicitudDesinscripcion = async (solicitud: Omit<SolicitudDesinscripcion, 'id' | 'fechaSolicitud' | 'estado'>): Promise<boolean> => {
    try {
      const newSolicitud: SolicitudDesinscripcion = {
        ...solicitud,
        id: Date.now().toString(),
        fechaSolicitud: new Date().toISOString().split('T')[0],
        estado: 'pendiente'
      };

      // Intentar crear en servidor
      try {
        const response = await fetch('http://localhost:3000/solicitudesDesinscripcion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSolicitud),
        });

        if (response.ok) {
          const createdSolicitud = await response.json();
          setSolicitudesDesinscripcion(prev => [...prev, createdSolicitud]);
          
          // Actualizar localStorage
          const updatedSolicitudes = [...solicitudesDesinscripcion, createdSolicitud];
          localStorage.setItem('solicitudesDesinscripcion', JSON.stringify(updatedSolicitudes));
          return true;
        }
      } catch (serverError) {
        console.log('Servidor no disponible, guardando solicitud en localStorage');
      }

      // Fallback a localStorage
      const updatedSolicitudes = [...solicitudesDesinscripcion, newSolicitud];
      setSolicitudesDesinscripcion(updatedSolicitudes);
      localStorage.setItem('solicitudesDesinscripcion', JSON.stringify(updatedSolicitudes));
      return true;
    } catch (error) {
      setError('Error al crear solicitud de desinscripción');
      return false;
    }
  };

  const updateSolicitudDesinscripcion = async (id: number | string, estado: 'aprobada' | 'rechazada'): Promise<boolean> => {
    try {
      const solicitudData = { estado };

      // Intentar actualizar en servidor
      try {
        const response = await fetch(`http://localhost:3000/solicitudesDesinscripcion/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(solicitudData),
        });

        if (response.ok) {
          const updatedSolicitud = await response.json();
          setSolicitudesDesinscripcion(prev => prev.map(s => s.id === id ? updatedSolicitud : s));
          
          // Si se aprueba, eliminar la inscripción
          if (estado === 'aprobada') {
            const solicitud = solicitudesDesinscripcion.find(s => s.id === id);
            if (solicitud) {
              await deleteInscripcion(solicitud.inscripcionId);
            }
          }
          
          // Actualizar localStorage
          const updatedSolicitudes = solicitudesDesinscripcion.map(s => s.id === id ? updatedSolicitud : s);
          localStorage.setItem('solicitudesDesinscripcion', JSON.stringify(updatedSolicitudes));
          return true;
        }
      } catch (serverError) {
        console.log('Servidor no disponible, actualizando solicitud en localStorage');
      }

      // Fallback a localStorage
      const updatedSolicitudes = solicitudesDesinscripcion.map(s => 
        s.id === id ? { ...s, estado } : s
      );
      setSolicitudesDesinscripcion(updatedSolicitudes);
      
      // Si se aprueba, eliminar la inscripción
      if (estado === 'aprobada') {
        const solicitud = solicitudesDesinscripcion.find(s => s.id === id);
        if (solicitud) {
          await deleteInscripcion(solicitud.inscripcionId);
        }
      }
      
      localStorage.setItem('solicitudesDesinscripcion', JSON.stringify(updatedSolicitudes));
      return true;
    } catch (error) {
      setError('Error al actualizar solicitud de desinscripción');
      return false;
    }
  };

  // FUNCIONES DE USUARIO PARA INSCRIPCIONES
  const inscribirseEvento = async (eventoId: number | string, usuarioId: number | string): Promise<boolean> => {
    try {
      // Verificar si ya está inscrito
      const yaInscrito = inscripciones.some(i => 
        i.eventoId.toString() === eventoId.toString() && 
        i.usuarioId.toString() === usuarioId.toString() &&
        i.estado === 'confirmada'
      );

      if (yaInscrito) {
        setError('Ya estás inscrito en este evento');
        return false;
      }

      // Verificar cupos disponibles
      const evento = eventos.find(e => e.id.toString() === eventoId.toString());
      if (!evento) {
        setError('Evento no encontrado');
        return false;
      }

      const inscritosEvento = inscripciones.filter(i => 
        i.eventoId.toString() === eventoId.toString() && 
        i.estado === 'confirmada'
      ).length;

      if (inscritosEvento >= evento.cupos) {
        setError('No hay cupos disponibles para este evento');
        return false;
      }

      // Crear inscripción
      return await createInscripcion({
        usuarioId,
        eventoId,
        fechaInscripcion: new Date().toISOString().split('T')[0],
        estado: 'confirmada'
      });
    } catch (error) {
      setError('Error al inscribirse al evento');
      return false;
    }
  };

  const solicitarDesinscripcion = async (inscripcionId: number | string, usuarioId: number | string, motivo?: string): Promise<boolean> => {
    try {
      const inscripcion = inscripciones.find(i => i.id.toString() === inscripcionId.toString());
      if (!inscripcion) {
        setError('Inscripción no encontrada');
        return false;
      }

      // Verificar que la inscripción pertenece al usuario
      if (inscripcion.usuarioId.toString() !== usuarioId.toString()) {
        setError('No tienes permisos para desinscribirte de esta inscripción');
        return false;
      }

      // Verificar si ya existe una solicitud pendiente
      const solicitudExistente = solicitudesDesinscripcion.some(s => 
        s.inscripcionId.toString() === inscripcionId.toString() && 
        s.estado === 'pendiente'
      );

      if (solicitudExistente) {
        setError('Ya tienes una solicitud de desinscripción pendiente para este evento');
        return false;
      }

      return await createSolicitudDesinscripcion({
        inscripcionId,
        usuarioId,
        eventoId: inscripcion.eventoId,
        motivo
      });
    } catch (error) {
      setError('Error al solicitar desinscripción');
      return false;
    }
  };

  return {
    // Estado
    eventos,
    inscripciones,
    usuarios,
    solicitudesDesinscripcion,
    loading,
    error,
    
    // Métodos de eventos
    loadEventos,
    createEvento,
    updateEvento,
    deleteEvento,
    
    // Métodos de inscripciones
    loadInscripciones,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,
    
    // Métodos de solicitudes de desinscripción
    loadSolicitudesDesinscripcion,
    createSolicitudDesinscripcion,
    updateSolicitudDesinscripcion,
    
    // Métodos de usuario para eventos
    inscribirseEvento,
    solicitarDesinscripcion,
    
    // Métodos de usuarios
    loadUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    
    // Utilidades
    initializeData,
    setError
  };
};
