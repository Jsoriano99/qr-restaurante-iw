# Valoración de Restaurante

```mermaid
activityDiagram
    title: Valoración de Restaurante

    start
    : Inicio --> Acceder a registro de valoración tras visita
    : Acceder a registro de valoración tras visita --> Seleccionar puntuación (1-5 estrellas)
    : Seleccionar puntuación (1-5 estrellas) --> ¿Añadir comentario?
    : ¿Añadir comentario? --> if "No" --> Guardar valoración en base de datos - - ID restaurante - ID cliente - Puntuación - Comentario (opt) - Timestamp
    : ¿Añadir comentario? --> if "Sí" --> Escribir comentario (máx. 500 caracteres)
    : Escribir comentario (máx. 500 caracteres) --> Validar contenido - - Longitud correcta - Sin contenido ofensivo
    : Validar contenido - - Longitud correcta - Sin contenido ofensivo --> ¿Contenido válido?
    : ¿Contenido válido? --> if "Contenido válido" --> Guardar valoración en base de datos - - ID restaurante - ID cliente - Puntuación - Comentario (opt) - Timestamp
    : ¿Contenido válido? --> if "Contenido inválido" --> Mostrar error
    : Mostrar error --> if "Repetir comentario" --> Escribir comentario (máx. 500 caracteres)
    : Guardar valoración en base de datos - - ID restaurante - ID cliente - Puntuación - Comentario (opt) - Timestamp --> Recalcular valoración media del restaurante
    : Recalcular valoración media del restaurante --> Confirmar valoración enviada
    : Confirmar valoración enviada --> Fin - Valoración registrada
    stop
```

## Diagrama en estilo Flujo

```mermaid
flowchart TD
    title("Valoración de Restaurante")

    N1["Inicio"]:::start
    N2["Acceder a registro de valoración tras visita"]
    N3["Seleccionar puntuación (1-5 estrellas)"]
    N4["Escribir comentario (máx. 500 caracteres)"]
    N5["Validar contenido:<br/>- Longitud correcta<br/>- Sin contenido ofensivo"]
    N6["Guardar valoración en base de datos:<br/>- ID restaurante<br/>- ID cliente<br/>- Puntuación<br/>- Comentario (opt)<br/>- Timestamp"]
    N7["Recalcular valoración media del restaurante"]
    N8["Confirmar valoración enviada"]
    N9["Fin - Valoración registrada"]:::end
    E1["Mostrar error"]
    D1{{¿Añadir comentario?}}
    D2{{¿Contenido válido?}}

    classDef start fill:#90EE90,stroke:#228B22
    classDef end fill:#FFB6C1,stroke:#DC143C

    N1 --> N2
    N2 --> N3
    N3 --> D1
    D1 -->|"No"| N6
    D1 -->|"Sí"| N4
    N4 --> N5
    N5 --> D2
    D2 -->|"Contenido válido"| N6
    D2 -->|"Contenido inválido"| E1
    E1 -->|"Repetir comentario"| N4
    N6 --> N7
    N7 --> N8
    N8 --> N9
```