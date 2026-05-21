# Project Objectives — QR Restaurante

**Proyecto 12: Control de accesos por QR a restaurantes**
**Materia**: Ingeniería Web (IW) | **Metodología**: UWE + SCRUMBAN
**Stack**: Next.js 15, Prisma/SQLite, TailwindCSS, TypeScript, JWT (jose)

---

## Requisitos Funcionales (RF)

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-01 | Registro y gestión de perfil de restaurante (nombre, dirección, tipoCocina, capacidadMaxima, horarios, coordenadas, teléfono, email) | Alta |
| RF-02 | Generación de código QR único por mesa/acceso (UUID v4 + HMAC + expiración configurable) | Alta |
| RF-03 | Registro de entrada mediante escaneo QR (validación hash, control aforo, acompañantes 0-10, registro de salida con cálculo de duración) | Alta |
| RF-04 | Control de aforo automatizado (alerta al 80%, bloqueo al 100%, dashboard en tiempo real) | Alta |

## Requisitos de Información (RI)

| ID | Descripción |
|----|-------------|
| RI-01 | Datos del restaurante: nombre, dirección, tipoCocina, capacidadMaxima, horarios, coordenadas, teléfono, email |
| RI-02 | Registro de afluencia: visitas con timestamps, duración, acompañantes |

## Requisitos No Funcionales (RNF)

| ID | Descripción |
|----|-------------|
| RNF-01 | Diseño responsive (móvil primero, tablet, desktop) |
| RNF-02 | Seguridad QR: firma HMAC con clave secreta, expiración, UUID v4 |
| RNF-03 | Alertas automáticas al superar 80% de aforo |

## Requisitos Implícitos (derivados de HUs)
- Valoración de restaurantes (1-5 estrellas + comentario opcional, máx 500 caracteres)
- Reportes de afluencia para administrador (exportables PDF/CSV)

---

## Modelo de Contenido (entidades y campos)

### Restaurante
`id`, `nombre`, `direccion`, `tipoCocina`, `capacidadMaxima`, `horarioApertura`, `horarioCierre`, `latitud`, `longitud`, `telefono`, `email`, `contrasenaHash`, `createdAt`, `updatedAt`

### Cliente
`id`, `nombre`, `email`, `contrasenaHash`, `telefono`, `createdAt`, `updatedAt`

### Visita
`id`, `timestampEntrada`, `timestampSalida` (nullable), `duracionMinutos` (calculado), `estado` (activa/completada/cancelada), `acompanantes`
→ Relaciones: N:1 Restaurante, N:1 Cliente, N:1 CodigoQR

### CodigoQR
`uuid`, `idMesa`, `activo` (booleano), `fechaCreacion`, `fechaExpiracion` (nullable)
→ Relaciones: N:1 Restaurante, 1:N Visita

### Valoracion
`id`, `puntuacion` (1-5), `comentario` (nullable, máx 500), `timestamp`
→ Relaciones: N:1 Restaurante, N:1 Cliente

### Administrador
`id`, `nombre`, `email`, `contrasenaHash`, `rol`, `createdAt`, `updatedAt`

---

## Vistas del Sistema (9 vistas)

| Vista | Nombre | Actor | Requisitos |
|-------|--------|-------|------------|
| V-01 | Home / Inicio (hero, destacados, filtros rápidos) | Todos | RF-03, RF-04 |
| V-02 | Listado de Restaurantes (filtros: tipo cocina, cercanía, disponibilidad + ordenación) | Cliente | RF-03, RNF-01 |
| V-03 | Detalle de Restaurante (info, QR, valoraciones, botón escanear) | Cliente | RF-02, RF-03 |
| V-04 | Escaneo QR / Registro de Entrada (cámara, acompañantes 0-10, validación) | Cliente | RF-03, RF-04 |
| V-05 | Registro de Restaurante (formulario completo + geocodificación) | Admin/Rest | RF-01, RF-02 |
| V-06 | Panel de Control del Restaurante (dashboard KPIs, gestión QR, alertas) | Restaurante | RF-04, RI-02 |
| V-07 | Mis Visitas (lista, registro de salida, link a valorar) | Cliente | RF-03, RI-02 |
| V-08 | Valoración (selector estrellas, comentario, prevenir duplicados) | Cliente | Implícito |
| V-09 | Reportes de Afluencia (métricas, gráficos, exportación) | Admin | RI-02, Implícito |

---

## Práctica 4: Testing (28 TC + BD + Seguridad)

Ejes: Usabilidad/Interfaz, Funcionalidad, Base de Datos, Compatibilidad, Rendimiento/Seguridad.
Ver `objetivo/P4_IW.pdf` y `overleaf/sections/04_practica4.tex` para detalle de casos.

---

## Reglas para el desarrollo

1. **NO desviarse de estos objetivos** — todo el código debe apuntar a cumplir estos requisitos
2. **SDD para cada cambio** — propuesta → specs → design → tasks → apply → verify → archive
3. **Pruebas locales del usuario** — yo verifico, el usuario prueba en local antes de archivar
4. **Seguridad primero** — Prisma select explícito, nunca exponer datos sensibles, validar entradas
5. **Preferir server components** sobre client components cuando sea posible
6. **Voseo en textos visibles** ("explorá", "intentá", "volvé")
