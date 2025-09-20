# PetsCartagena

Plataforma de adopción de mascotas en Cartagena, Colombia, que conecta a personas que buscan adoptar mascotas con dueños responsables que necesitan dar en adopción a sus animales.

## 🐾 Características Principales

### Para Adoptantes
- **Catálogo de Mascotas**: Explora mascotas disponibles para adopción con fotos, descripciones detalladas
- **Búsqueda Avanzada**: Filtra por tipo de mascota (DOG, CAT, RABBIT, BIRD, FISH, HAMSTER, TURTLE, OTHER)
- **Filtros Detallados**: Por tamaño (SMALL, MEDIUM, LARGE, EXTRA_LARGE), edad, género y ubicación
- **Sistema de Chat**: Comunícate directamente con los dueños de las mascotas en tiempo real
- **Proceso de Adopción**: Solicitud formal de adopción con seguimiento de estados
- **Galería de Imágenes**: Visualiza múltiples fotos por mascota

### Para Dueños de Mascotas
- **Gestión de Mascotas**: Agrega y administra las mascotas que quieres dar en adopción
- **Galería de Fotos**: Sube hasta 5 fotos para cada mascota
- **Información Completa**: Registra nombre, tipo, raza, edad, descripción, comida favorita, juguetes preferidos y tratamiento médico
- **Control de Solicitudes**: Revisa y gestiona las solicitudes de adopción (PENDING, ACCEPTED, REJECTED, CANCELLED)
- **Comunicación Directa**: Chatea con posibles adoptantes
- **Control de Disponibilidad**: Marca mascotas como disponibles/no disponibles

### Para Administradores
- **Panel de Control**: Gestión completa de usuarios, mascotas y adopciones
- **Estadísticas**: Dashboard con métricas de la plataforma (total de mascotas, adopciones, usuarios, chats)
- **Moderación**: Gestión de usuarios y mascotas
- **Gestión de Roles**: Control de permisos (USER, OWNER, ADMIN)

## 🏗️ Arquitectura de la Aplicación

### Stack Tecnológico
- **Frontend**: Next.js 15.3.5 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4 con componentes shadcn/ui
- **Base de Datos**: SQLite con Prisma ORM 6.11.1
- **Autenticación**: Sistema JWT personalizado + bcryptjs para hash de contraseñas
- **Comunicación en Tiempo Real**: Socket.IO 4.8.1
- **Almacenamiento**: Sistema de archivos local para imágenes
- **Servidor Personalizado**: Servidor HTTP con integración Socket.IO y Next.js

### Estructura del Proyecto
```
src/
├── app/                    # Rutas de la aplicación (App Router)
│   ├── api/               # Rutas API
│   │   ├── auth/          # Autenticación
│   │   ├── pets/          # Gestión de mascotas
│   │   ├── admin/         # Endpoints administrativos
│   │   └── chats/         # Sistema de mensajería
│   ├── auth/              # Páginas de autenticación
│   ├── admin/             # Panel de administración
│   ├── dashboard/         # Dashboard de usuarios
│   └── landing/           # Páginas principales
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── landing/          # Componentes de la página principal
├── contexts/              # Contextos de React
├── lib/                   # Utilidades y configuración
└── hooks/                 # Custom hooks
```

## 🚀 Funcionalidades Detalladas

### Sistema de Autenticación
- **Roles de Usuario**:
  - **USER**: Adoptantes que buscan mascotas
  - **OWNER**: Dueños que dan mascotas en adopción
  - **ADMIN**: Administradores del sistema

- **Características**:
  - Registro e inicio de sesión con bcryptjs
  - Tokens JWT con expiración de 7 días
  - Autenticación dual: JWT + cookies/localStorage
  - Redirección basada en roles
  - Protección de rutas con middleware
  - Context API para gestión de estado de autenticación

### API Endpoints Implementados

#### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `GET /api/auth/error` - Manejo de errores de autenticación

#### Gestión de Mascotas
- `POST /api/pets` - Crear nueva mascota (requiere rol OWNER)
- `GET /api/pets/available` - Obtener mascotas disponibles
- `GET /api/pets/my-pets` - Obtener mascotas del usuario autenticado

#### Sistema de Chat
- `POST /api/chats/create` - Crear nuevo chat
- `GET /api/chats/[id]` - Obtener mensajes de un chat específico
- `POST /api/chats/[id]` - Enviar mensaje a un chat

#### Panel de Administración
- `GET /api/admin/stats` - Estadísticas del dashboard (requiere rol ADMIN)
- `/api/admin/users/*` - Gestión de usuarios
- `/api/admin/pets/*` - Gestión de mascotas

#### Utilidades
- `GET /api/health` - Health check del servidor
- `POST /api/test-users/create` - Crear usuarios de prueba

### Gestión de Mascotas
- **CRUD Completo**: Crear, leer, actualizar y eliminar mascotas
- **Subida de Imágenes**: Hasta 5 imágenes por mascota con almacenamiento local
- **Tipos de Mascota**: DOG, CAT, RABBIT, BIRD, FISH, HAMSTER, TURTLE, OTHER
- **Información Detallada**:
  - Nombre, tipo, raza, edad (en meses), tamaño, género
  - Color, descripción personalizada
  - Comida favorita, juguetes preferidos
  - Tratamientos médicos
  - Estado de disponibilidad

### Sistema de Adopción
- **Solicitudes Formales**: Proceso estructurado para solicitudes de adopción
- **Estados de Solicitud**:
  - PENDING: Pendiente de revisión
  - ACCEPTED: Aceptada
  - REJECTED: Rechazada
  - CANCELLED: Cancelada
- **Relaciones**: Una mascota puede tener múltiples solicitudes, pero solo una por usuario

### Sistema de Mensajería en Tiempo Real
- **Socket.IO Integration**: Servidor personalizado con integración Socket.IO
- **Chat Bidireccional**: Comunicación entre adoptantes y dueños
- **Eventos en Tiempo Real**:
  - `join_chat` - Unirse a sala de chat
  - `leave_chat` - Salir de sala de chat
  - `send_message` - Enviar mensaje
- **Historial de Conversaciones**: Guardado completo en base de datos
- **Notificaciones**: Alertas en tiempo real para nuevos mensajes

### Panel de Administración
- **Dashboard Principal**: Métricas y estadísticas en tiempo real
- **Gestión de Usuarios**: Listado, edición y gestión de roles
- **Gestión de Mascotas**: Moderación de publicaciones
- **Estadísticas Implementadas**:
  - Total de mascotas registradas
  - Total de adopciones completadas (ACCEPTED)
  - Total de usuarios registrados
  - Total de chats activos

### Características Técnicas Avanzadas
- **Servidor Personalizado**: Combinación de Next.js + Socket.IO en puerto 3000
- **Middleware de Autenticación**: Protección automática de rutas protegidas
- **Desarrollo con Hot Reload**: Configuración con nodemon para desarrollo
- **TypeScript Estricto**: Tipado fuerte en todo el proyecto
- **Shadcn/UI Components**: Más de 30 componentes UI implementados

## 📋 Requisitos del Sistema

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Variables de Entorno
```bash
# Base de Datos
DATABASE_URL="file:./dev.db"

# Autenticación
NEXTAUTH_SECRET="your-secret-key-here"

# Desarrollo (opcional)
NODE_ENV="development"
```

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd PetsCartagena
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
```bash
# Base de Datos
DATABASE_URL="file:./db/custom.db"

# Autenticación JWT
NEXTAUTH_SECRET="your-strong-secret-key-here"

# Entorno
NODE_ENV="development"
```

### 4. Configurar Base de Datos
```bash
# Generar Prisma Client
npm run db:generate

# Aplicar migraciones a la base de datos
npm run db:push

# (Opcional) Resetear base de datos
npm run db:reset
```

### 5. Ejecutar en Desarrollo
```bash
# Inicia el servidor personalizado con Socket.IO
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts NPM Disponibles
- `npm run dev` - Desarrollo con nodemon y hot-reload
- `npm run build` - Construir para producción
- `npm start` - Ejecutar en producción
- `npm run lint` - Linter ESLint
- `npm run db:push` - Aplicar cambios del schema a la BD
- `npm run db:generate` - Generar Prisma Client
- `npm run db:migrate` - Crear migraciones
- `npm run db:reset` - Resetear base de datos

## 🧪 Usuarios de Prueba

Para facilitar las pruebas, la aplicación incluye un endpoint para crear usuarios de prueba:

### Crear Usuarios de Prueba Automáticamente
1. **Endpoint**: `POST /api/test-users/create`
2. **Página de Prueba**: Visita `/test-users`
3. **Usuarios Creados**:
   - **Admin**: `admin@test.com` / `password123`
   - **Owner**: `owner@test.com` / `password123` 
   - **User**: `user@test.com` / `password123`

### Funcionalidades por Rol
- **ADMIN**: Acceso al panel de administración (`/admin`)
- **OWNER**: Puede crear mascotas y gestionar adopciones (`/dashboard`)
- **USER**: Puede explorar mascotas y solicitar adopciones (`/adopt`)

## ⚙️ Configuración Técnica

### Servidor Personalizado
El proyecto utiliza un servidor personalizado (`server.ts`) que combina:
- Next.js 15.3.5 con App Router
- Socket.IO 4.8.1 para tiempo real
- Puerto 3000 por defecto
- Configuración CORS para desarrollo

### Desarrollo con Nodemon
- Hot-reload automático con nodemon
- Logs guardados en `dev.log`
- Watching de archivos `.ts`, `.tsx`, `.js`, `.jsx`
- Reinicio automático del servidor

### Configuración de TypeScript
- Target ES2017
- Strict mode habilitado
- Path mapping configurado (`@/*` → `./src/*`)
- JSX preserve para Next.js

## 📁 Estructura de Base de Datos (Prisma Schema)

### Usuarios (users)
```sql
- id: String (cuid, primary key)
- email: String (unique)
- name: String? (optional)
- password: String? (hashed with bcrypt)
- phone: String? (optional)
- address: String? (optional)
- city: String? (optional)
- role: UserRole (USER, OWNER, ADMIN) @default(USER)
- avatar: String? (optional)
- bio: String? (optional)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
```

### Mascotas (pets)
```sql
- id: String (cuid, primary key)
- name: String
- type: PetType (DOG, CAT, RABBIT, BIRD, FISH, HAMSTER, TURTLE, OTHER)
- breed: String? (optional)
- age: Int (en meses)
- color: String? (optional)
- size: PetSize? (SMALL, MEDIUM, LARGE, EXTRA_LARGE)
- gender: PetGender? (MALE, FEMALE)
- description: String? (optional)
- favoriteFood: String? (optional)
- favoriteToy: String? (optional)
- medicalTreatment: String? (optional)
- isAvailable: Boolean @default(true)
- ownerId: String (foreign key)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
```

### Imágenes de Mascotas (pet_images)
```sql
- id: String (cuid, primary key)
- url: String
- petId: String (foreign key)
- order: Int @default(0)
```

### Solicitudes de Adopción (adoption_requests)
```sql
- id: String (cuid, primary key)
- status: AdoptionStatus (PENDING, ACCEPTED, REJECTED, CANCELLED) @default(PENDING)
- message: String? (optional)
- petId: String (foreign key)
- userId: String (foreign key)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
- @@unique([petId, userId]) // Una solicitud por usuario por mascota
```

### Chats (chats)
```sql
- id: String (cuid, primary key)
- user1Id: String (foreign key)
- user2Id: String (foreign key)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
- @@unique([user1Id, user2Id]) // Chat único entre dos usuarios
```

### Mensajes (messages)
```sql
- id: String (cuid, primary key)
- content: String
- senderId: String (foreign key)
- receiverId: String (foreign key)
- chatId: String (foreign key)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
```

### Relaciones de Base de Datos
- **Usuario → Mascotas**: Un usuario puede tener múltiples mascotas (1:N)
- **Usuario → Mensajes**: Un usuario puede enviar/recibir múltiples mensajes (1:N)
- **Usuario → Chats**: Un usuario puede participar en múltiples chats (N:M)
- **Usuario → Solicitudes**: Un usuario puede hacer múltiples solicitudes (1:N)
- **Mascota → Imágenes**: Una mascota puede tener múltiples imágenes (1:N)
- **Mascota → Solicitudes**: Una mascota puede recibir múltiples solicitudes (1:N)
- **Chat → Mensajes**: Un chat puede tener múltiples mensajes (1:N)

## 🔒 Seguridad y Validación

### Sistema de Autenticación Implementado
- **Hash de Contraseñas**: bcryptjs con salt rounds 12
- **Tokens JWT**: Expiración de 7 días, almacenados en cookies y localStorage
- **Middleware de Protección**: Verificación automática en rutas protegidas (`/dashboard`, `/admin`)
- **Validación de Roles**: Control de acceso basado en roles (USER, OWNER, ADMIN)
- **Gestión de Sesiones**: Context API para estado global de autenticación

### Validación de Datos
- **TypeScript Estricto**: Tipado fuerte en toda la aplicación
- **Validación de Formularios**: React Hook Form para validación en cliente
- **Prisma ORM**: Protección automática contra SQL Injection
- **Sanitización**: Validación de entradas en endpoints API
- **File Upload**: Validación de tipos y tamaños de imágenes

### Protección de Rutas
- **Middleware Next.js**: Protección automática de rutas sensibles
- **API Route Guards**: Verificación de tokens en endpoints
- **Role-based Access Control**: Función `requireRole()` para endpoints específicos
- **Error Handling**: Manejo seguro de errores de autenticación

## 🚀 Despliegue

### Producción
```bash
# Construir la aplicación
npm run build

# Iniciar servidor en producción
npm start
```

### Variables de Entorno Requeridas
```bash
# Base de Datos (requerida)
DATABASE_URL="file:./db/custom.db"

# Autenticación (obligatorio en producción)
NEXTAUTH_SECRET="generate-a-strong-secret-key-here"

# Entorno
NODE_ENV="production"
```

### Consideraciones de Despliegue
- **Puerto**: El servidor escucha en puerto 3000
- **Socket.IO**: Endpoint en `/api/socketio`
- **Logs**: Los logs se guardan en `server.log` en producción
- **Base de Datos**: SQLite local (considerar PostgreSQL para producción)
- **Imágenes**: Almacenamiento local en `public/uploads` (considerar CDN)

## 📊 Estado de Implementación

### ✅ Funcionalidades Completadas
- [x] Sistema de autenticación JWT completo
- [x] Registro y login de usuarios
- [x] Gestión de roles (USER, OWNER, ADMIN)
- [x] CRUD completo de mascotas
- [x] Subida de imágenes (hasta 5 por mascota)
- [x] Sistema de chat en tiempo real con Socket.IO
- [x] Solicitudes de adopción con estados
- [x] Panel de administración con estadísticas
- [x] Dashboard de usuarios por rol
- [x] Middleware de protección de rutas
- [x] Base de datos con relaciones complejas
- [x] API endpoints para todas las funcionalidades
- [x] UI completa con shadcn/ui components
- [x] Páginas de landing responsive
- [x] Sistema de usuarios de prueba

### 🔄 Posibles Mejoras Futuras
- [ ] Sistema de notificaciones push
- [ ] Integración con servicios de email
- [ ] Migración a PostgreSQL para producción
- [ ] CDN para almacenamiento de imágenes
- [ ] Sistema de valoraciones y reseñas
- [ ] Geolocalización y mapas
- [ ] Tests unitarios y de integración
- [ ] CI/CD pipeline
- [ ] Documentación API con Swagger
- [ ] Optimización SEO

## 📦 Dependencias Principales

### Frontend y UI
- **Next.js**: 15.3.5 (React framework)
- **React**: 19.0.0 (UI library)
- **TypeScript**: 5.x (Type safety)
- **Tailwind CSS**: 4.x (Styling)
- **shadcn/ui**: Componentes UI pre-construidos
- **Framer Motion**: 12.23.2 (Animaciones)
- **Lucide React**: 0.525.0 (Iconos)

### Backend y Base de Datos
- **Prisma**: 6.11.1 (ORM)
- **SQLite**: Base de datos embebida
- **bcryptjs**: 3.0.2 (Hash de contraseñas)
- **jsonwebtoken**: 9.0.2 (JWT tokens)
- **Socket.IO**: 4.8.1 (Tiempo real)

### Herramientas de Desarrollo
- **tsx**: 4.20.3 (TypeScript execution)
- **nodemon**: 3.1.10 (Development server)
- **ESLint**: 9.x (Linting)
- **PostCSS**: 4.x (CSS processing)

## 🤝 Contribuir

1. Hacer Fork del repositorio
2. Crear una rama de características (`git checkout -b feature/amazing-feature`)
3. Hacer Commit de los cambios (`git commit -m 'Add some amazing feature'`)
4. Hacer Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- A la comunidad de Next.js por el excelente framework
- A los contribuyentes de shadcn/ui por los componentes
- Al equipo de Prisma por el excelente ORM

## 📞 Contacto

Para preguntas o soporte, por favor contacta a:

- **Email**: contacto@petscartagena.com
- **Sitio Web**: [https://petscartagena.com](https://petscartagena.com)
- **GitHub**: [Issues del repositorio](https://github.com/tu-repo/petscartagena/issues)

---

**PetsCartagena** - Donde cada mascota encuentra un hogar loving 🐕🐈🐾