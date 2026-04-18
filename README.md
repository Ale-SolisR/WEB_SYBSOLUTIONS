# SYB Solutions – Sitio Web Corporativo

Sitio web empresarial completo con portal de capacitaciones y panel de administración.

## Stack tecnológico

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + CSS variables para temas
- **NextAuth.js** – Autenticación con SQL Server
- **mssql** – Conexión a SQL Server
- **Framer Motion** – Animaciones
- **React Hook Form** – Formularios
- **Lucide React** – Íconos

## Configuración inicial

### 1. Instalar Node.js
Descarga Node.js 20 LTS desde https://nodejs.org

### 2. Instalar dependencias
```bash
cd C:\Users\aleja\WEB_SYBSOLUTIONS
npm install
```

### 3. Inicializar la base de datos
Ejecuta el script SQL en SQL Server Management Studio:
```
scripts/init-db.sql
```

O usa el endpoint de inicialización (una sola vez):
```bash
curl -X POST http://localhost:3000/api/init
```

### 4. Configurar variables de entorno
El archivo `.env.local` ya está configurado. Para producción (Netlify), agrega las variables en el dashboard de Netlify.

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

Abre http://localhost:3000

## Credenciales

### Admin del sitio
- Email: `sybsolutionscr@gmail.com`
- Password: `Admin123!`
- Panel: http://localhost:3000/admin

### Usuarios normales
Cualquier usuario activo en la tabla `core.USUARIO` del SQL Server.

## Deployment en Netlify

1. Conectar repositorio: https://app.netlify.com/teams/ale-solisr/projects
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Plugin: `@netlify/plugin-nextjs` (ya configurado en netlify.toml)
5. Agregar variables de entorno en Netlify Dashboard

## Temas disponibles

🔵 Azul · 🌑 Oscuro · ☀️ Claro · 🔴 Rojo · 🟠 Naranja · 🎄 Navidad · 💝 San Valentín · 🐣 Pascua

Los temas de temporada se detectan automáticamente según la fecha.
