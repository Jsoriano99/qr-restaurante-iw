# Visualización de Restaurantes Disponibles

```mermaid
activityDiagram
    title: Visualización de Restaurantes Disponibles

    start
    : Inicio --> Abrir lista de restaurantes
    : Abrir lista de restaurantes --> ¿Aplicar filtros?
    : ¿Aplicar filtros? --> if "Sí" --> Seleccionar tipo de comida (opcional)
    : ¿Aplicar filtros? --> if "No" --> Consultar base de datos de restaurantes
    : Seleccionar tipo de comida (opcional) --> Seleccionar zona/barrio (opcional)
    : Seleccionar zona/barrio (opcional) --> Establecer radio de búsqueda (opcional)
    : Establecer radio de búsqueda (opcional) --> Filtrar por disponibilidad - - Con puestos disponibles - Con espacio suficiente
    : Filtrar por disponibilidad - - Con puestos disponibles - Con espacio suficiente --> Consultar base de datos de restaurantes
    : Consultar base de datos de restaurantes --> Calcular distancia desde ubicación actual
    : Calcular distancia desde ubicación actual --> Ordenar por - - Distancia - Valoración - Disponibilidad
    : Ordenar por - - Distancia - Valoración - Disponibilidad --> Mostrar lista de restaurantes con información - - Nombre - Tipo de comida - Distancia - Capacidad/ocupación - Valoración media - Disponibilidad
    : Mostrar lista de restaurantes con información - - Nombre - Tipo de comida - Distancia - Capacidad/ocupación - Valoración media - Disponibilidad --> Seleccionar restaurante para ver detalles
    : Seleccionar restaurante para ver detalles --> ¿Ver más detalles o volver?
    : ¿Ver más detalles o volver? --> if "Volver" --> Mostrar lista de restaurantes con información - - Nombre - Tipo de comida - Distancia - Capacidad/ocupación - Valoración media - Disponibilidad
    : ¿Ver más detalles o volver? --> if "Fin" --> Fin
    stop
```

## Diagrama en estilo Flujo

```mermaid
flowchart TD
    title("Visualización de Restaurantes Disponibles")

    N1["Inicio"]:::start
    N2["Abrir lista de restaurantes"]
    N3["Seleccionar tipo de comida (opcional)"]
    N4["Seleccionar zona/barrio (opcional)"]
    N5["Establecer radio de búsqueda (opcional)"]
    N6["Filtrar por disponibilidad:<br/>- Con puestos disponibles<br/>- Con espacio suficiente"]
    N7["Consultar base de datos de restaurantes"]
    N8["Calcular distancia desde ubicación actual"]
    N9["Ordenar por:<br/>- Distancia<br/>- Valoración<br/>- Disponibilidad"]
    N10["Mostrar lista de restaurantes con información:<br/>- Nombre<br/>- Tipo de comida<br/>- Distancia<br/>- Capacidad/ocupación<br/>- Valoración media<br/>- Disponibilidad"]
    N11["Seleccionar restaurante para ver detalles"]
    N12["Fin"]:::end
    D1{{¿Aplicar filtros?}}
    D2{{¿Ver más detalles o volver?}}

    classDef start fill:#90EE90,stroke:#228B22
    classDef end fill:#FFB6C1,stroke:#DC143C

    N1 --> N2
    N2 --> D1
    D1 -->|"Sí"| N3
    D1 -->|"No"| N7
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N6 --> N7
    N7 --> N8
    N8 --> N9
    N9 --> N10
    N10 --> N11
    N11 --> D2
    D2 -->|"Volver"| N10
    D2 -->|"Fin"| N12
```