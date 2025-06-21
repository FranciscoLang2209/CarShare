# CarShare - Sistema de Compartición de Vehículos

Una aplicación web moderna para gestionar el uso compartido de vehículos, construida con Next.js 14, TypeScript, y Tailwind CSS.

## 🚀 Características

- **Autenticación de usuarios** - Sistema de registro y login seguro
- **Dashboard en tiempo real** - Estadísticas del vehículo y balance del usuario
- **Gestión de viajes** - Inicio y finalización de sesiones de viaje
- **Historial de viajes** - Lista detallada de todos los viajes realizados
- **Comunicación MQTT** - Control en tiempo real del vehículo
- **Interfaz moderna** - Diseño responsive con componentes accesibles

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript con tipado estricto
- **Estilos**: Tailwind CSS + shadcn/ui
- **Formularios**: React Hook Form + Zod validation
- **Estado global**: Context API + Custom Hooks
- **Comunicación**: MQTT.js para tiempo real
- **HTTP Cliente**: Fetch API con error handling

## 📦 Arquitectura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── (auth)/            # Grupo de rutas de autenticación
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── [component].tsx   # Componentes de negocio
├── constants/            # Constantes de la aplicación
├── context/              # Context providers
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuraciones
├── schemas/              # Esquemas de validación (Zod)
├── services/             # Servicios (API, MQTT, etc.)
└── types.d.ts           # Tipos TypeScript globales
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm, yarn, pnpm o bun

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone [repository-url]
   cd CarShare
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus configuraciones:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_MQTT_BROKER_URL=ws://100.25.245.208:9001
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

5. **Abrir en el navegador**
   - Visita [http://localhost:3000](http://localhost:3000)

## 🏗️ Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter de código

## 🔧 Patrones y Mejores Prácticas Implementadas

### 1. **Separación de Responsabilidades**
- **Servicios**: Lógica de API y MQTT aislada
- **Hooks**: Lógica de estado y efectos reutilizable
- **Componentes**: Solo presentación y UI

### 2. **Tipado Estricto**
- Interfaces TypeScript bien definidas
- Validación con Zod schemas
- Props tipadas en todos los componentes

### 3. **Manejo de Estado Moderno**
- Context API optimizado con useMemo/useCallback
- Custom hooks para lógica específica
- Estado local cuando es apropiado

### 4. **Optimización de Rendimiento**
- Componentes memoizados con React.memo
- Lazy loading de funciones con useCallback
- Optimización de re-renders

### 5. **Accesibilidad (a11y)**
- Semántica HTML correcta
- ARIA labels y roles
- Navegación por teclado
- Estados de carga descriptivos

### 6. **Manejo de Errores**
- Try-catch en todas las llamadas async
- Estados de error en la UI
- Logging consistente

## 🎨 Componentes Principales

### `Stats` - Dashboard Principal
- Información del vehículo
- Balance del usuario
- Control de sesiones

### `TripList` - Historial de Viajes
- Lista de viajes con paginación
- Cálculo automático de costos
- Estados de carga y error

### `SessionControl` - Control de Viajes
- Inicio/fin de sesiones via MQTT
- Estados de conexión
- Feedback visual

## 🔐 Autenticación y Seguridad

- Tokens almacenados en cookies HTTP-only
- Middleware de protección de rutas
- Validación de formularios en cliente y servidor
- Headers de seguridad configurados

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints optimizados
- Componentes adaptativos
- Touch-friendly interactions

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Docker
```dockerfile
# Incluir Dockerfile si es necesario
```

## 📚 Documentación de la API

El backend debe proporcionar los siguientes endpoints:

- `POST /auth/login` - Autenticación de usuario
- `POST /auth/register` - Registro de usuario
- `GET /user/sessions` - Obtener historial de viajes
- `POST /user/cost` - Obtener costo total del usuario

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollo Frontend**: [Tu Nombre]
- **Diseño UI/UX**: [Diseñador]
- **Backend**: [Backend Developer]

---

*Construido con ❤️ usando Next.js y TypeScript*
