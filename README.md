# 🎓 EventHub - Sistema de Gestión de Eventos

Una plataforma moderna y atractiva para la gestión de eventos donde los clientes pueden descubrir e inscribirse a eventos únicos.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Login y Registro** de usuarios con validaciones completas
- **Roles de usuario**: Administradores y Clientes
- **Autenticación persistente** con localStorage
- **Protección de rutas** según permisos

### 🎯 Para Clientes
- **Explorar eventos** con diseño tipo tarjetas moderno
- **Filtros avanzados** por categoría y búsqueda
- **Inscripción a eventos** con un solo click
- **Vista detallada** de cada evento
- **Interfaz intuitiva** y responsive

### 👨‍💼 Para Administradores
- **Gestión completa de eventos** (crear, editar, eliminar)
- **Administración de inscripciones**
- **Panel de configuración**
- **Acceso a todas las funcionalidades**

### 🎨 Diseño Moderno
- **Gradientes atractivos** y animaciones fluidas
- **Diseño responsive** para todos los dispositivos
- **Navegación intuitiva** con iconos modernos
- **Feedback visual** en todas las acciones
- **Tema consistente** en toda la aplicación

## 🚀 Tecnologías Utilizadas

- **React 19** con TypeScript
- **React Router DOM** para navegación
- **Bootstrap 5** para componentes base
- **Lucide React** para iconos modernos
- **SweetAlert2** para alertas elegantes
- **JSON Server** para backend simulado
- **Vite** para desarrollo y build

## 📦 Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Instalar JSON Server globalmente
```bash
npm install -g json-server
```

### 3. Ejecutar la aplicación

#### Opción A: Script automático (Windows)
```bash
start.bat
```

#### Opción B: Manual
Abrir dos terminales:

**Terminal 1 - JSON Server:**
```bash
json-server --watch src/data/data.json --port 3000
```

**Terminal 2 - Aplicación:**
```bash
npm run dev
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **API/JSON Server**: http://localhost:3000

## 👥 Usuarios de Prueba

### Administrador
- **Email**: admin@eventhub.com
- **Contraseña**: admin123

### Cliente
- **Email**: juan@email.com
- **Contraseña**: user123

### Cliente 2
- **Email**: laura@email.com
- **Contraseña**: user123

## 🛠️ Funcionalidades Detalladas

### Sistema de Autenticación
```typescript
// Contexto de autenticación con todas las funciones
const { user, login, register, logout, isAuthenticated, isAdmin } = useAuth();
```

### Gestión de Eventos
- **Creación**: Formulario completo con validaciones
- **Edición**: Modificación de eventos existentes
- **Eliminación**: Con confirmación de seguridad
- **Visualización**: Cards modernas con toda la información

### Inscripciones
- **Automáticas**: Los clientes se inscriben directamente
- **Gestión**: Los administradores ven todas las inscripciones
- **Validaciones**: Evita inscripciones duplicadas

### Diseño Responsive
- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: Adaptación perfecta en tablets y desktop
- **Navegación**: Menú hamburguesa en móviles

## 🎨 Paleta de Colores

```css
/* Gradiente principal */
primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Colores de estado */
success: linear-gradient(135deg, #48bb78 0%, #38a169 100%)
warning: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)
danger: linear-gradient(135deg, #f56565 0%, #e53e3e 100%)

/* Colores neutros */
background: #f7fafc
text-primary: #2d3748
text-secondary: #718096
```

## 📱 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── nav/             # Navegación principal
│   ├── footer/          # Footer moderno
│   ├── alertas/         # Alertas personalizadas
│   └── ProtectedRoute/  # Protección de rutas
├── context/             # Contextos de React
│   └── AuthContext.tsx  # Gestión de autenticación
├── pages/               # Páginas principales
│   ├── index/          # Página de inicio
│   ├── auth/           # Login y registro
│   ├── eventos/        # Gestión de eventos
│   └── inscripciones/  # Gestión de inscripciones
├── routes/             # Configuración de rutas
├── data/               # Datos de prueba
└── assets/             # Recursos estáticos
```

## 🔄 API Endpoints

### Eventos
- `GET /eventos` - Listar todos los eventos
- `POST /eventos` - Crear nuevo evento
- `PUT /eventos/:id` - Actualizar evento
- `DELETE /eventos/:id` - Eliminar evento

### Inscripciones
- `GET /inscripciones` - Listar inscripciones
- `POST /inscripciones` - Nueva inscripción
- `DELETE /inscripciones/:id` - Cancelar inscripción

### Usuarios
- `GET /usuarios` - Listar usuarios
- `POST /usuarios` - Registro de usuario

## 🎯 Próximas Mejoras

- [ ] Dashboard de estadísticas
- [ ] Notificaciones push
- [ ] Sistema de calificaciones
- [ ] Chat en tiempo real
- [ ] Integración con calendario
- [ ] Pagos en línea
- [ ] Certificados de participación

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Desarrollado con ❤️ por el equipo de EventHub**

¡Gracias por usar nuestra plataforma de gestión de eventos! 🎉