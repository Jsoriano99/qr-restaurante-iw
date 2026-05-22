# QR Restaurante — Control de Accesos por QR

Aplicación web para automatizar el control de aforo en restaurantes mediante códigos QR. Los clientes escanean un QR al entrar y salir, el sistema actualiza la ocupación en tiempo real, y los restaurantes gestionan todo desde un panel de control.

---

## Tecnologías

| Capa | Stack |
|------|-------|
| Framework | Next.js 15 (App Router) |
| Base de datos | SQLite + Prisma ORM |
| Estilos | TailwindCSS 3 |
| Autenticación | JWT (jose) + middleware RBAC |
| Validación | Zod |
| QR | qrcode + HMAC-SHA256 |

---

## Requisitos previos

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jsoriano99/qr-restaurante-iw.git
cd qr-restaurante-iw

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env con la clave de firma QR
echo 'QR_HMAC_SECRET=restaurante-qr-hmac-secret-2026' > .env

# 4. Ejecutar migraciones (crea la base de datos SQLite)
npx prisma migrate dev

# 5. Poblar con datos de prueba
npx ts-node prisma/seed.ts

# 6. Arrancar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:3000**.

---

## Credenciales de prueba

El seed genera estos usuarios para probar la aplicación:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@qr.com | Admin123! |
| Restaurante 1 | restaurante1@qr.com | Restaurante123! |
| Restaurante 2 | restaurante2@qr.com | Restaurante123! |
| Cliente 1 | cliente1@qr.com | Cliente123! |
| Cliente 2 | cliente2@qr.com | Cliente123! |

### Datos de prueba incluidos

| Restaurante | Tipo cocina | Capacidad |
|-------------|-------------|-----------|
| El Buen Gusto | Española | 50 |
| La Terraza | Mediterránea | 80 |

Se incluyen códigos QR, visitas de ejemplo y valoraciones preexistentes.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                          # Home (V-01)
│   ├── layout.tsx                        # Layout raíz
│   ├── login/page.tsx                    # Login
│   ├── register/page.tsx                 # Registro
│   ├── admin/page.tsx                    # Panel admin
│   ├── cliente/
│   │   ├── page.tsx                      # Dashboard cliente
│   │   ├── escanear/page.tsx             # Escaneo QR (V-04)
│   │   ├── visitas/page.tsx              # Mis Visitas (V-07)
│   │   └── valorar/[restauranteId]/      # Valoración (V-08)
│   ├── restaurante/
│   │   ├── page.tsx                      # Panel control (V-06)
│   │   └── [id]/page.tsx                 # Detalle restaurante (V-03)
│   ├── restaurantes/page.tsx             # Listado público (V-02)
│   └── api/
│       ├── auth/                         # Login, registro, refresh
│       ├── cliente/
│       │   ├── visitas/                  # Entrada/salida
│       │   └── valoraciones/             # Crear y consultar
│       ├── codigos-qr/[uuid]/            # Payload, imagen, validar
│       ├── restaurante/                  # Ocupación, gestión QR
│       └── restaurantes/                 # Listado + valoraciones
├── components/
│   ├── layout/                           # PublicHeader, cards
│   ├── home/                             # FilterBar, HomeContent
│   ├── cliente/                          # StarRating, ValorarForm
│   └── restaurante/                      # Dashboard, KPIs, QR Manager
├── lib/                                  # Prisma, auth, QR signing
├── types/                                # TypeScript + Zod schemas
└── middleware.ts                         # JWT + RBAC protección de rutas
```

---

## Roles y permisos

| Rol | Rutas protegidas | Funcionalidades |
|-----|-----------------|-----------------|
| **Público** | — | Home, listado restaurantes, detalle, valoraciones |
| **CLIENTE** | `/cliente/*` | Escanear QR, registrar entrada/salida, ver visitas, valorar |
| **RESTAURANTE** | `/restaurante/*` | Dashboard aforo, KPIs, gestionar QR, ver ocupación |
| **ADMIN** | `/admin/*` | Panel de administración, reportes |

---

## APIs principales

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /api/restaurantes` | Público | Listado de restaurantes |
| `GET /api/restaurantes/[id]/valoraciones` | Público | Valoraciones con media |
| `GET /api/codigos-qr/[uuid]/payload` | Público | Payload + firma HMAC del QR |
| `POST /api/cliente/visitas` | CLIENTE | Registrar entrada por QR |
| `PATCH /api/cliente/visitas/[id]` | CLIENTE | Registrar salida |
| `POST /api/cliente/valoraciones` | CLIENTE | Crear valoración (1-5★) |
| `GET /api/restaurante/ocupacion` | RESTAURANTE | Ocupación en tiempo real |
| `POST /api/restaurante/codigos-qr` | RESTAURANTE | Generar nuevo QR |

---

## Testing

```bash
# Instalar dependencias de testing
pip install pytest requests

# Ejecutar tests automatizados (requiere la app corriendo en localhost:3000)
pytest overleaf/diagramas_convertidos/test_pruebas.py -v
```

Se realizaron pruebas de base de datos (SQLite), seguridad (OWASP Top 10), funcionalidad (requisitos RF-01 a RF-04), compatibilidad (multiplataforma) y rendimiento (First Load JS < 5 kB en todas las páginas). Ver `overleaf/sections/04_practica4.tex` para el informe completo.

---

## Autor

**Jorge Soriano Pijuán** — Grado en Ingeniería Informática, Universidad de Córdoba.

Proyecto para la asignatura de Ingeniería Web (3er curso).
