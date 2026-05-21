-- CreateTable
CREATE TABLE "codigos_qr" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "idMesa" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaExpiracion" DATETIME,
    "restauranteId" TEXT NOT NULL,
    CONSTRAINT "codigos_qr_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "restaurantes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "visitas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestampEntrada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timestampSalida" DATETIME,
    "duracionMinutos" INTEGER,
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "acompanantes" INTEGER NOT NULL DEFAULT 0,
    "restauranteId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "codigoQRId" TEXT NOT NULL,
    CONSTRAINT "visitas_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "restaurantes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "visitas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "visitas_codigoQRId_fkey" FOREIGN KEY ("codigoQRId") REFERENCES "codigos_qr" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "valoraciones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restauranteId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    CONSTRAINT "valoraciones_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "restaurantes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "valoraciones_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_restaurantes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "horarios" TEXT,
    "tipoCocina" TEXT NOT NULL DEFAULT '',
    "capacidadMaxima" INTEGER NOT NULL DEFAULT 0,
    "horarioApertura" TEXT,
    "horarioCierre" TEXT,
    "latitud" REAL,
    "longitud" REAL,
    "qrCode" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'RESTAURANTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_restaurantes" ("createdAt", "direccion", "email", "horarios", "id", "nombre", "password", "qrCode", "role", "telefono", "updatedAt") SELECT "createdAt", "direccion", "email", "horarios", "id", "nombre", "password", "qrCode", "role", "telefono", "updatedAt" FROM "restaurantes";
DROP TABLE "restaurantes";
ALTER TABLE "new_restaurantes" RENAME TO "restaurantes";
CREATE UNIQUE INDEX "restaurantes_email_key" ON "restaurantes"("email");
CREATE UNIQUE INDEX "restaurantes_qrCode_key" ON "restaurantes"("qrCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "valoraciones_clienteId_restauranteId_key" ON "valoraciones"("clienteId", "restauranteId");
