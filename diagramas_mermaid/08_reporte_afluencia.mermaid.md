# Reporte de Afluencia

```mermaid
activityDiagram
    title: Reporte de Afluencia

    start
    : Inicio --> Acceder a sección de reportes
    : Acceder a sección de reportes --> Seleccionar tipo de reporte - - Por restaurante - Por fecha/rango - Por horario - Comparativo
    : Seleccionar tipo de reporte - - Por restaurante - Por fecha/rango - Por horario - Comparativo --> Seleccionar período - - Hoy - Última semana - Último mes - Rango personalizado
    : Seleccionar período - - Hoy - Última semana - Último mes - Rango personalizado --> Generar consulta de datos en base de datos
    : Generar consulta de datos en base de datos --> Procesar y calcular métricas - - Total entradas - Total salidas - Duración media - Peak hours - Acompañantes media
    : Procesar y calcular métricas - - Total entradas - Total salidas - Duración media - Peak hours - Acompañantes media --> ¿Exportar reporte?
    : ¿Exportar reporte? --> if "No" --> Mostrar reporte con gráficos y estadísticas
    : ¿Exportar reporte? --> if "Sí - PDF" --> Generar PDF
    : ¿Exportar reporte? --> if "Sí - Excel" --> Generar Excel
    : ¿Exportar reporte? --> if "Sí - CSV" --> Generar CSV
    : Generar PDF --> Mostrar reporte con gráficos y estadísticas
    : Generar Excel --> Mostrar reporte con gráficos y estadísticas
    : Generar CSV --> Mostrar reporte con gráficos y estadísticas
    : Mostrar reporte con gráficos y estadísticas --> Fin
    stop
```

## Diagrama en estilo Flujo

```mermaid
flowchart TD
    title("Reporte de Afluencia")

    N1["Inicio"]:::start
    N2["Acceder a sección de reportes"]
    N3["Seleccionar tipo de reporte:<br/>- Por restaurante<br/>- Por fecha/rango<br/>- Por horario<br/>- Comparativo"]
    N4["Seleccionar período:<br/>- Hoy<br/>- Última semana<br/>- Último mes<br/>- Rango personalizado"]
    N5["Generar consulta de datos en base de datos"]
    N6["Procesar y calcular métricas:<br/>- Total entradas<br/>- Total salidas<br/>- Duración media<br/>- Peak hours<br/>- Acompañantes media"]
    N7["Generar PDF"]
    N8["Generar Excel"]
    N9["Generar CSV"]
    N10["Mostrar reporte con gráficos y estadísticas"]
    N11["Fin"]:::end
    D1{{¿Exportar reporte?}}

    classDef start fill:#90EE90,stroke:#228B22
    classDef end fill:#FFB6C1,stroke:#DC143C

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