# Valoración de Restaurante

**Actor**: Cliente
**Descripción**: Diagrama de actividad para valorar un restaurante después de una visita

```mermaid
flowchart TD
    title("Valoración de Restaurante")

    N1(("Inicio")):::start
    N2["Acceder a registro de valoración tras visita"]
    N3["Seleccionar puntuación (1-5 estrellas)"]
    N4["Escribir comentario (máx. 500 caracteres)"]
    N5["Validar contenido:<br/>- Longitud correcta<br/>- Sin contenido ofensivo"]
    N6["Guardar valoración en base de datos:<br/>- ID restaurante<br/>- ID cliente<br/>- Puntuación<br/>- Comentario (opt)<br/>- Timestamp"]
    N7["Recalcular valoración media del restaurante"]
    N8["Confirmar valoración enviada"]
    N9(("Fin - Valoración registrada")):::end
    E1{{Mostrar error}}:::error
    D1{{¿Añadir comentario?}}
    D2{{¿Contenido válido?}}

    classDef start fill:#90EE90,stroke:#228B22,stroke-width:2px
    classDef end fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
    classDef error fill:#FFD700,stroke:#FF8C00,stroke-width:2px

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

---

## Leyenda

- `(--(` = Nodo inicial (círculo doble)
- `())` = Nodo final (círculo doble)
- `{{{{ }}}}` = Decisión (diamante)
- `[""]` = Actividad (rectángulo)

## Flujos definidos

- Inicio → Acceder a registro de valoración tras visita
- Acceder a registro de valoración tras visita → Seleccionar puntuación (1-5 estrellas)
- Seleccionar puntuación (1-5 estrellas) → ¿Añadir comentario?
- Si **No**: ¿Añadir comentario? → Guardar valoración en base de datos:<br/>- ID restaurante<br/>- ID cliente<br/>- Puntuación<br/>- Comentario (opt)<br/>- Timestamp
- Si **Sí**: ¿Añadir comentario? → Escribir comentario (máx. 500 caracteres)
- Escribir comentario (máx. 500 caracteres) → Validar contenido:<br/>- Longitud correcta<br/>- Sin contenido ofensivo
- Validar contenido:<br/>- Longitud correcta<br/>- Sin contenido ofensivo → ¿Contenido válido?
- Si **Contenido válido**: ¿Contenido válido? → Guardar valoración en base de datos:<br/>- ID restaurante<br/>- ID cliente<br/>- Puntuación<br/>- Comentario (opt)<br/>- Timestamp
- Si **Contenido inválido**: ¿Contenido válido? → Mostrar error
- Si **Repetir comentario**: Mostrar error → Escribir comentario (máx. 500 caracteres)
- Guardar valoración en base de datos:<br/>- ID restaurante<br/>- ID cliente<br/>- Puntuación<br/>- Comentario (opt)<br/>- Timestamp → Recalcular valoración media del restaurante
- Recalcular valoración media del restaurante → Confirmar valoración enviada
- Confirmar valoración enviada → Fin - Valoración registrada