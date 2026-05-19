# Reporte de Afluencia

**Actor**: Administrador
**Descripción**: Diagrama de actividad para generar reportes de afluencia del restaurante

```mermaid
flowchart TD
    title("Reporte de Afluencia")

    N1(("Inicio")):::start
    N2["Acceder a sección de reportes"]
    N3["Seleccionar tipo de reporte:<br/>- Por restaurante<br/>- Por fecha/rango<br/>- Por horario<br/>- Comparativo"]
    N4["Seleccionar período:<br/>- Hoy<br/>- Última semana<br/>- Último mes<br/>- Rango personalizado"]
    N5["Generar consulta de datos en base de datos"]
    N6["Procesar y calcular métricas:<br/>- Total entradas<br/>- Total salidas<br/>- Duración media<br/>- Peak hours<br/>- Acompañantes media"]
    N7["Generar PDF"]
    N8["Generar Excel"]
    N9["Generar CSV"]
    N10["Mostrar reporte con gráficos y estadísticas"]
    N11(("Fin")):::end
    D1{{¿Exportar reporte?}}

    classDef start fill:#90EE90,stroke:#228B22,stroke-width:2px
    classDef end fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
    classDef error fill:#FFD700,stroke:#FF8C00,stroke-width:2px

    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N6 --> D1
    D1 -->|"No"| N10
    D1 -->|"Sí - PDF"| N7
    D1 -->|"Sí - Excel"| N8
    D1 -->|"Sí - CSV"| N9
    N7 --> N10
    N8 --> N10
    N9 --> N10
    N10 --> N11
```

---

## Leyenda

- `(--(` = Nodo inicial (círculo doble)
- `())` = Nodo final (círculo doble)
- `{{{{ }}}}` = Decisión (diamante)
- `[""]` = Actividad (rectángulo)

## Flujos definidos

- Inicio → Acceder a sección de reportes
- Acceder a sección de reportes → Seleccionar tipo de reporte:<br/>- Por restaurante<br/>- Por fecha/rango<br/>- Por horario<br/>- Comparativo
- Seleccionar tipo de reporte:<br/>- Por restaurante<br/>- Por fecha/rango<br/>- Por horario<br/>- Comparativo → Seleccionar período:<br/>- Hoy<br/>- Última semana<br/>- Último mes<br/>- Rango personalizado
- Seleccionar período:<br/>- Hoy<br/>- Última semana<br/>- Último mes<br/>- Rango personalizado → Generar consulta de datos en base de datos
- Generar consulta de datos en base de datos → Procesar y calcular métricas:<br/>- Total entradas<br/>- Total salidas<br/>- Duración media<br/>- Peak hours<br/>- Acompañantes media
- Procesar y calcular métricas:<br/>- Total entradas<br/>- Total salidas<br/>- Duración media<br/>- Peak hours<br/>- Acompañantes media → ¿Exportar reporte?
- Si **No**: ¿Exportar reporte? → Mostrar reporte con gráficos y estadísticas
- Si **Sí - PDF**: ¿Exportar reporte? → Generar PDF
- Si **Sí - Excel**: ¿Exportar reporte? → Generar Excel
- Si **Sí - CSV**: ¿Exportar reporte? → Generar CSV
- Generar PDF → Mostrar reporte con gráficos y estadísticas
- Generar Excel → Mostrar reporte con gráficos y estadísticas
- Generar CSV → Mostrar reporte con gráficos y estadísticas
- Mostrar reporte con gráficos y estadísticas → Fin