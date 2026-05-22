# Guion de Defensa Oral — QR Restaurante

## Credenciales del Seed

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@qr.com | Admin123! |
| Restaurante 1 | restaurante1@qr.com | Restaurante123! |
| Restaurante 2 | restaurante2@qr.com | Restaurante123! |
| Cliente 1 | cliente1@qr.com | Cliente123! |
| Cliente 2 | cliente2@qr.com | Cliente123! |

## Datos de prueba

| Restaurante | Tipo | Capacidad |
|-------------|------|-----------|
| El Buen Gusto (rst-001) | Española | 50 |
| La Terraza (rst-002) | Mediterránea | 80 |

| QR | Mesa | Restaurante |
|----|------|-------------|
| QR-001-A | Mesa 1 | El Buen Gusto |
| QR-001-B | Mesa 2 | El Buen Gusto |
| QR-002-A | Terraza 1 | La Terraza |

---

## ACTO 1 — Vista Pública (30 segundos)

> **"Empecemos por lo que ve cualquier persona que entra a la web."**

### 1.1 Home Page (V-01)
- Abrir `http://localhost:3000/`
- **Mostrar**: Hero gradiente naranja, CTAs "Registrate Gratis" y "Explorá Restaurantes"
- **Scroll**: Sección "Restaurantes Destacados" con cards de El Buen Gusto y La Terraza
- **Mostrar filtros**: Clic en "Española" → solo El Buen Gusto. Clic en "Todas" → ambos
- **Clic "Ver Todos →"** → navega a `/restaurantes`

### 1.2 Listado de Restaurantes (V-02)
- **Mostrar**: Listado con cards de ambos restaurantes
- Señalar: nombre, dirección, teléfono, horarios
- **Clic en "Ver Más"** de El Buen Gusto → navega a V-03

### 1.3 Detalle de Restaurante (V-03)
- **Mostrar**: Info del restaurante + códigos QR activos (Mesa 1, Mesa 2)
- **Scroll abajo**: Sección "Valoraciones" con promedio 5.0★ y valoración de María López
- Señalar que la valoración está LINKED desde que el cliente valoró

> **"Hasta aquí la experiencia pública. Ahora veamos cómo un cliente usa el sistema."**

---

## ACTO 2 — Flujo Cliente (2 minutos)

> **"Juan Pérez es un cliente. Ya tiene cuenta. Inicia sesión."**

### 2.1 Login
- Clic en "Iniciar Sesión"
- Email: `cliente1@qr.com` / Contraseña: `Cliente123!`
- Redirige a `/cliente` (dashboard del cliente)

### 2.2 Escaneo QR y Entrada (V-04)
- Clic en acceder a `/cliente/escanear`
- **Simular escaneo**: Pegar la URL de validación del QR-001-A
  - `http://localhost:3000/api/codigos-qr/QR-001-A/payload`
  - Copiar el payload (uuid + firma)
  - Usar `/cliente/escanear?uuid=QR-001-A`
- **Mostrar**: nombre del restaurante, dirección, capacidad actual
- Completar "acompañantes: 0"
- Clic "Confirmar entrada" → visita registrada ✅

> **"Entró al restaurante. La visita queda activa y el aforo se actualiza."**

### 2.3 Mis Visitas y Salida (V-07)
- Navegar a `/cliente/visitas`
- **Mostrar**: La visita recién creada en pestaña "Activas"
- Clic en "Registrar Salida" → confirmar
- La visita pasa a "Completadas"
- **Mostrar duración calculada**

### 2.4 Valorar Restaurante (V-08)
- En la visita completada, **mostrar el botón "Valorá este restaurante"** (púrpura)
- Clic → navega a `/cliente/valorar/[id]`
- **Mostrar**: Selector de estrellas (navegar con teclado: flechas + Enter)
- Seleccionar 4 estrellas
- Escribir comentario: "Muy buena experiencia, volveré"
- **Mostrar contador de caracteres** (35/500)
- Clic "Enviá tu valoración" → confirmación ✅

> **"El cliente ya valoró. Veamos qué ve el restaurante en su panel."**

---

## ACTO 3 — Panel Restaurante (1 minuto)

> **"Abrimos una ventana de incógnito para simular al dueño de El Buen Gusto."**

### 3.1 Login Restaurante
- Abrir ventana incógnito
- Login: `restaurante1@qr.com` / `Restaurante123!`
- Redirige a `/restaurante` (dashboard)

### 3.2 Dashboard (V-06)
- **Mostrar KPIs**: visitantes actuales, plazas disponibles, % ocupación, visitas activas
- **Mostrar OccupancyGauge**: barra de progreso con color (verde si <80%)
- **Mostrar QR Manager**: lista de códigos QR generados (Mesa 1, Mesa 2)
  - Toggle activar/desactivar QR
  - Botón "Generar QR" para crear uno nuevo (ej: Mesa 3)
  - Preview y descarga del QR en SVG

> **"El restaurante controla su aforo y gestiona sus QR. Cerremos con el admin."**

---

## ACTO 4 — Panel Admin (30 segundos)

> **"Cerramos incógnito y abrimos como admin."**

### 4.1 Admin
- Login: `admin@qr.com` / `Admin123!`
- **Mostrar**: Panel de administración con gestión de restaurantes y usuarios
  - (si existe contenido, si no explicar que es el panel global)

> **"Y esto es QR Restaurante. Control de accesos por QR con aforo en tiempo real, valoraciones integradas y panel de control para el restaurante."**

---

## ACTO 5 — Cierre (15 segundos)

### Resumen rápido de lo visto:
1. 🏠 Página pública con búsqueda y filtros
2. 📱 Cliente escanea QR → entra → sale → valora
3. 📊 Restaurante ve aforo en tiempo real, gestiona QR
4. ⭐ Sistema de valoraciones con prevención de duplicados
5. 🔒 Roles protegidos por JWT con middleware

### Tecnologías mencionables si preguntan:
- Next.js 15 (App Router, Server Components)
- Prisma ORM + SQLite
- TailwindCSS responsive
- JWT con jose + middleware RBAC
- Zod para validación
- HMAC-SHA256 para firma de QR
- ARIA para accesibilidad

---

## Notas para la presentación

- **NO leer el guion textualmente** — usalo como referencia de qué mostrar en cada paso
- **Enfocarse en el flujo completo**: el profesor valora más ver el ciclo end-to-end que cada detalle técnico
- **Si algo falla**: no te detengas, seguí al siguiente paso. Son datos de seed, se pueden regenerar
- **Tiempo total estimado**: 4-5 minutos (ideal para una defensa)
- **La app debe estar corriendo**: `./start-server.sh` antes de empezar
- **Ventana normal + incógnito**: para simular dos roles simultáneos (cliente y restaurante)
- **Desktop vs móvil**: si el profesor quiere ver responsive, abrir DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
