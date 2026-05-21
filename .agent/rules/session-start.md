# Session Start Protocol — QR Restaurante

**LEER ESTE ARCHIVO AL INICIAR CADA SESIÓN**

## Pasos obligatorios antes de cualquier trabajo

1. **Leer** `.agent/rules/project-objectives.md` — objetivos fijos del proyecto
2. **Verificar** estado actual del código (git status, últimos cambios)
3. **Revisar** Engram session summary de la sesión anterior (`mem_context`)
4. **Confirmar** con el usuario qué change del SDD vamos a trabajar

## Reglas de oro

- Los requisitos RF-01 a RF-04, RI-01, RI-02, RNF-01 a RNF-03 son **SAGRADOS** — no desviarse
- Las 9 vistas (V-01 a V-09) son el contrato de interfaz — implementar en orden
- SDD obligatorio para cambios sustanciales
- Verificación formal (sdd-verify) antes de archive
- El usuario prueba en local, yo no ejecuto el proyecto

## Stack
Next.js 15, Prisma/SQLite, TailwindCSS 3, TypeScript 5, JWT (jose), Zod validations
