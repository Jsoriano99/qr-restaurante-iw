# Diagramas de Actividad - Sistema QR Restaurante

## UWE - Instituto Universitario

**Proyecto:** Control de Accesos por QR a Restaurantes
**Grupo:** 12
**Herramienta:** MagicDraw con MagicUWE

---

## 1. Registro de Restaurante

### Actor: Administrador / Restaurante

```
[Inicio]
    │
    ▼
┌─────────────────────────────────┐
│ Acceder al formulario de       │
│ registro de restaurante        │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Introducir datos del           │
│ restaurante:                   │
│ - Nombre                       │
│ - Dirección                   │
│ - Tipo de cocina              │
│ - Capacidad máxima           │
│ - Horario                     │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Validar datos completados       │
└─────────────────────────────────┘
    │
    ├── Datos incompletos ──► [Mostrar error] ──► Repetir desde entrada
    │
    ├── Datos inválidos ──► [Mostrar error] ──► Repetir desde entrada
    │
    ▼ Datos válidos
┌─────────────────────────────────┐
│ Guardar restaurante en la         │
│ base de datos                  │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Generar código QR único         │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Asignar identificador único    │
│ al restaurante                │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Confirmar registro exitoso    │
│ al restaurante               │
└─────────────────────────────────┘
    │
    ▼
[Fin]
```

---

## 2. Generación de Código QR

### Actor: Sistema / Restaurante

```
[Inicio]
    │
    ▼
┌─────────────────────────────────┐
│ Solicitar generación de          │
│ código QR                     │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Verificar que el restaurante   │
│ está registrado y activo      │
└─────────────────────────────────┘
    │
    ├── Restaurante no válido ──► [Fin - Error]
    │
    ▼ Restaurante válido
┌───────────────��─────────────────┐
│ Generar identificador único    │
│ (UUID) para el código QR      │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Codificar información en      │
│ formato QR:                   │
│ - ID restaurante              │
│ - ID mesa/acceso             │
│ - Timestamp                  │
│ - Hash de validación         │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Generar imagen del código QR  │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Almacenar código QR generado   │
│ en la base de datos           │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Entregar código QR al          │
│ restaurante para impresión   │
└─────────────────────────────────┘
    │
    ▼
[Fin - Éxito]
```

---

## 3. Escaneo y Registro de Entrada

### Actor: Cliente

```
[Inicio]
    │
    ▼
┌─────────────────────────────────┐
│ Abrir aplicación de escaneo  │
│ en el dispositivo móvil       │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Permitir cámara para          │
│ escanear código QR            │
└─────────────────────────────────┘
    │
    ├── Permiso denegado ──► [Mostrar instrucciones] ──► [Fin - Error]
    │
    ▼ Permiso concedido
┌─────────────────────────────────┐
│ Escanear código QR             │
│ del restaurante/mesa         │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Decodificar datos del QR        │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Validar código QR:             │
│ - Verificar formato           │
│ - Verificar hash           │
│ - Verificar expiración     │
└─────────────────────────────────┘
    │
    ├── Código inválido ──► [Mostrar mensaje de error] ──► [Fin - Error]
    │
    ▼ Código válido
┌─────────────────────────────────┐
│ Obtener información del        │
│ restaurante                  │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Verificar capacidad actual   │
│ vs. máxima                │
└─────────────────────────────────┘
    │
    ├── Rest. completo ──► [Mostrar mensaje] ──► [Fin - Error]
    │
    ├── Rest. cerca límite ──► [Mostrar advertencia] ──► Preguntar si desea entrar
    │                                        │
    │                                        ├── No entrar ──► [Fin]
    │                                        │
    │                                        └── Sí entrar
    │                                                    │
    ▼ Hay capacidad disponible
┌─────────────────────────────────┐
│ Registrar entrada con:         │
│ - Timestamp actual            │
│ - ID restaurante              │
│ - ID código QR                │
│ - ID cliente (opcional)       │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Incrementar contador de      │
│ ocupación actual             │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ ¿El cliente desea registrar   │
│ acompañantes?                │
└─────────────────────────────────┘
    │
    ├── No ──► [Fin - Entrada registrada]
    │
    ├── Sí
    ▼
┌─────────────────────────────────┐
│ Solicitar número de            │
│ acompañantes                 │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Validar número (1-10)        │
└─────────────────────────────────┘
    │
    ├── Número inválido ──► [Mostrar error] ──► Repetir solicitud
    │
    ├── Excede capacidad ──► [Mostrar error] ──► Ajustar número
    │
    ▼ Número válido
┌─────────────────────────────────┐
│ Registrar acompañantes en    │
│ la entrada                   │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Actualizar contador de         │
│ ocupación (+ acompañantes)   │
└─────────────────────────────────┘
    │
    ▼
[Fin - Entrada con acompañantes]
```

---

## 4. Registro de Salida

### Actor: Cliente

```
[Inicio]
    │
    ▼
┌─────────────────────────────────┐
│ Acceder a Mis Visitas           │
│ en la aplicación            │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Seleccionar visita activa     │
│ (restaurante con entrada     │
│ sin salida)                  │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Confirmar selección de       │
│ restaurante                  │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ ¿El cliente tuvo              │
│ acompañantes?                │
└─────────────────────────────────┘
    │
    ├── No ──► [Ir a registrar salida]
    │
    ├── Sí
    ▼
┌─────────────────────────────────┐
│ Confirmar número de            │
│ acompañantes originales      │
└─────────────────────────────────┘
    │
    ▼
Ir a registrar salida:
    │
    ▼
┌─────────────────────────────────┐
│ Registrar timestamp de salida  │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Calcular duración de la      │
│ visita (salida - entrada)     │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Actualizar registro:         │
│ - Timestamp salida           │
│ - Duración calculada       │
│ - Estado: completado       │
└─────────────────────────────────┘
    │
    ▼
┌──────────────────────────���──────┐
│ Decrementar contador de      │
│ ocupación actual             │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ ¿Desea valorar el           │
│ restaurante?                │
└─────────────────────────────────┘
    │
    ├── No ──► [Fin - Salida registrada]
    │
    ├── Sí
    ▼
[Ir a Diagrama 7: Valoración]
```

---

## 5. Visualización de Restaurantes Disponibles

### Actor: Cliente

```
[Inicio]
    │
    ▼
┌─────────────────────────────────┐
│ Abrir lista de restaurantes   │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ ¿Aplicar filtros?            │
└─────────────────────────────────┘
    │
    ├── No ──► [Ir a cargar lista]
    │
    ├── Sí
    ▼
┌─────────────────────────────────┐
│ Seleccionar tipo de comida  │
│ (opcional)                 │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Seleccionar zona/barrio    │
│ (opcional)                 │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Establecer radio de         │
│ búsqueda (opcional)        │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Filtrar por disponibilidad: │
│ - Con puestos disponibles │
│ - Con espacio suficiente  │
└─────────────────────────────────┘
    │
    ▼
Cargar lista:
    │
    ▼
┌─────────────────────────────────┐
│ Consultar base de datos    │
│ de restaurantes            │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Calcular distancia desde   │
│ ubicación actual           │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Ordenar por:                  │
│ - Distancia                  │
│ - Valoración               │
│ - Disponibilidad           │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Mostrar lista de restaurantes│
│ con información:          │
│ - Nombre                   │
│ - Tipo de comida           │
│ - Distancia                │
│ - Capacidad/ocupación      │
│ - Valoración media         │
│ - Disponibilidad          │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Seleccionar restaurante     │
│ para ver detalles         │
└─────────────────────────────────┘
    │
    ├── Volver ──► [Mostrar lista]
    │
    ├── Ver más ──► [Ir a ver detalle]
    │
    ▼
[Fin]
```

---

## 6. Control de Aforo en Tiempo Real

### Actor: Restaurante / Administrador

```
[Inicio]
    │
    ▼
┌─────────────────────────────────┐
│ Acceder al panel de control   │
│ de ocupación                │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Obtener datos de ocupación: │
│ - Capacidad máxima          │
│ - Ocupación actual         │
│ - % ocupación             │
│ - Historial último hour   │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ ¿Ocupación > 80%?           │
└─────────────────────────────────┘
    │
    ├── Sí ──► [Generar notificación de alerta]
    │         │
    │         ▼
    │     ┌─────────────────────────────────┐
    │     │ Notificar al restaurante:      │
    │     │ " Capacidad casi llena"    │
    │     └─────────────────────────────────┘
    │         │
    │         ▼
    │     ┌─────────────────────────────────┐
    │     │ ¿Activar modo restrictivo?       │
    │     └─────────────────────────────────┘
    │         │
    │         ├── Sí ──► [Limitar nuevas entradas]
    │         │
    │         └── No ──► [Continuar normalmente]
    │                 │
    └── No ──► [Continuar normalmente]
                │
    ▼
┌─────────────────────────────────┐
│ Mostrar gráfico de          │
│ ocupación en tiempo real  │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ ¿Ver histórico de          │
│ affluencia?                │
└─────────────────────────────────┘
    │
    ├── Sí
    │    │
    │    ▼
    ├─────────────────────────────────────┐
    │ Mostrar gráfico histórico:         │
    │ - Por día                     │
    │ - Por hora                   │
    │ - Tendencia                  │
    └─────────────────────────────────┘
    │
    └── No
         │
    ▼
[Fin]
```

---

## 7. Valoración de Restaurante

### Actor: Cliente

```
[Inicio]
    │
    ▼
┌─────────────────────────────────┐
│ Acceder a registro de        │
│ valoración tras visita    │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Seleccionar puntuación      │
│ (1-5 estrellas)          │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ ¿Añadir comentario?       │
└─────────────────────────────────┘
    │
    ├── No ──► [Ir a enviar valoración]
    │
    ├── Sí
    ▼
┌─────────────────────────────────┐
│ Escribir comentario         │
│ (máx. 500 caracteres)    │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Validar contenido:          │
│ - Longitud correcta      │
│ - Sin contenido        │
│   ofensivo             │
└─────────────────────────────────┘
    │
    ├── Contenido inválido ──► [Mostrar error] ──► Repetir comentario
    │
    ▼ Contenido válido
    │
Ir a enviar valoración:
    │
    ▼
┌─────────────────────────────────┐
│ Guardar valoración en     │
│ base de datos:            │
│ - ID restaurante         │
│ - ID cliente            │
│ - Puntuación            │
│ - Comentario (opt)      │
│ - Timestamp            │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Recalcular valoración     │
│ media del restaurante    │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Confirmar valoración     │
│ enviada                 │
└─────────────────────────────────┘
    │
    ▼
[Fin - Valoración registrada]
```

---

## 8. Reporte de Afluencia (Administrador)

### Actor: Administrador

```
[Inicio]
    │
    ▼
┌─────────────────────────────────┐
│ Acceder a sección de        │
│ reportes                   │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Seleccionar tipo de reporte: │
│ - Por restaurante         │
│ - Por fecha/rango        │
│ - Por horario            │
│ - Comparativo            │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Seleccionar período:         │
│ - Hoy                    │
│ - Última semana         │
�� - Último mes             │
│ - Rango personalizado   │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Generar consulta de datos  │
│ en base de datos         │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Procesar y calcular         │
│ métricas:                 │
│ - Total entradas         │
│ - Total salidas         │
│ - Duración media        │
│ - Peak hours            │
│ - Acompañantes media   │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ ¿Exportar reporte?        │
└─────────────────────────────────┘
    │
    ├── No ──► [Ir a mostrar]
    │
    ├── Sí - PDF ──► [Generar PDF]
    │
    ├── Sí - Excel ──► [Generar Excel]
    │
    └── Sí - CSV ──► [Generar CSV]
             │
Ir a mostrar reporte:
             │
    ▼
┌─────────────────────────────────┐
│ Mostrar reporte con         │
│ gráficos y estadísticas │
└─────────────────────────────────┘
    │
    ▼
[Fin]
```

---

## Resumen de Diagramas

| # | Diagrama | Actor Principal |
|---|---------|-----------------|
| 1 | Registro de Restaurante | Administrador/Restaurante |
| 2 | Generación de Código QR | Sistema |
| 3 | Escaneo y Registro de Entrada | Cliente |
| 4 | Registro de Salida | Cliente |
| 5 | Visualización de Restaurantes | Cliente |
| 6 | Control de Aforo en Tiempo Real | Restaurante/Admin |
| 7 | Valoración de Restaurante | Cliente |
| 8 | Reporte de Afluencia | Administrador |

---

## Notas para MagicDraw

1. **Notación estándar**: UWE activity diagrams
2. **Símbolos a usar**:
   - Círculos negros = Inicio/Fin
   - Rectángulos redondeados = Actividades
   - Diamantes = Decisiones
   - Flechas = Flujo de control

3. **Elementos adicionales**:
   -泳道 (swimlanes) para separar actores
   - Notas explicativas donde sea necesario