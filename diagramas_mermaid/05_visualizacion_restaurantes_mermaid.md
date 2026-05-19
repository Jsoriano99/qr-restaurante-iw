# Visualización de Restaurantes Disponibles

**Actor**: Cliente
**Descripción**: Diagrama de actividad para visualizar y filtrar restaurantes disponibles

```mermaid
flowchart TD
    title("Visualización de Restaurantes Disponibles")

    N1(("Inicio")):::start
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
    N12(("Fin")):::end
    D1{{¿Aplicar filtros?}}
    D2{{¿Ver más detalles o volver?}}

    classDef start fill:#90EE90,stroke:#228B22,stroke-width:2px
    classDef end fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
    classDef error fill:#FFD700,stroke:#FF8C00,stroke-width:2px

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

---

## Leyenda

- `(--(` = Nodo inicial (círculo doble)
- `())` = Nodo final (círculo doble)
- `{{{{ }}}}` = Decisión (diamante)
- `[""]` = Actividad (rectángulo)

## Flujos definidos

- Inicio → Abrir lista de restaurantes
- Abrir lista de restaurantes → ¿Aplicar filtros?
- Si **Sí**: ¿Aplicar filtros? → Seleccionar tipo de comida (opcional)
- Si **No**: ¿Aplicar filtros? → Consultar base de datos de restaurantes
- Seleccionar tipo de comida (opcional) → Seleccionar zona/barrio (opcional)
- Seleccionar zona/barrio (opcional) → Establecer radio de búsqueda (opcional)
- Establecer radio de búsqueda (opcional) → Filtrar por disponibilidad:<br/>- Con puestos disponibles<br/>- Con espacio suficiente
- Filtrar por disponibilidad:<br/>- Con puestos disponibles<br/>- Con espacio suficiente → Consultar base de datos de restaurantes
- Consultar base de datos de restaurantes → Calcular distancia desde ubicación actual
- Calcular distancia desde ubicación actual → Ordenar por:<br/>- Distancia<br/>- Valoración<br/>- Disponibilidad
- Ordenar por:<br/>- Distancia<br/>- Valoración<br/>- Disponibilidad → Mostrar lista de restaurantes con información:<br/>- Nombre<br/>- Tipo de comida<br/>- Distancia<br/>- Capacidad/ocupación<br/>- Valoración media<br/>- Disponibilidad
- Mostrar lista de restaurantes con información:<br/>- Nombre<br/>- Tipo de comida<br/>- Distancia<br/>- Capacidad/ocupación<br/>- Valoración media<br/>- Disponibilidad → Seleccionar restaurante para ver detalles
- Seleccionar restaurante para ver detalles → ¿Ver más detalles o volver?
- Si **Volver**: ¿Ver más detalles o volver? → Mostrar lista de restaurantes con información:<br/>- Nombre<br/>- Tipo de comida<br/>- Distancia<br/>- Capacidad/ocupación<br/>- Valoración media<br/>- Disponibilidad
- Si **Fin**: ¿Ver más detalles o volver? → Fin