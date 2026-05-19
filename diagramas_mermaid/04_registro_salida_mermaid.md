# Registro de Salida

**Actor**: Cliente
**Descripción**: Diagrama de actividad para el registro de salida del restaurante

```mermaid
flowchart TD
    title("Registro de Salida")

    N1(("Inicio")):::start
    N2["Acceder a Mis Visitas en la aplicación"]
    N3["Seleccionar visita activa (restaurante con entrada sin salida)"]
    N4["Confirmar selección de restaurante"]
    N5["Confirmar número de acompañantes originales"]
    N6["Registrar timestamp de salida"]
    N7["Calcular duración de la visita (salida - entrada)"]
    N8["Actualizar registro:<br/>- Timestamp salida<br/>- Duración calculada<br/>- Estado: completado"]
    N9["Decrementar contador de ocupación actual"]
    N10["Ir a valoración"]
    N11(("Fin - Salida registrada")):::end
    E1(("Fin - Valoración")):::end
    D1{{¿El cliente tuvo acompañantes?}}
    D2{{¿Desea valorar el restaurante?}}

    classDef start fill:#90EE90,stroke:#228B22,stroke-width:2px
    classDef end fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
    classDef error fill:#FFD700,stroke:#FF8C00,stroke-width:2px

    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> D1
    D1 -->|"No"| N6
    D1 -->|"Sí"| N5
    N5 --> N6
    N6 --> N7
    N7 --> N8
    N8 --> N9
    N9 --> D2
    D2 -->|"No"| N11
    D2 -->|"Sí"| N10
```

---

## Leyenda

- `(--(` = Nodo inicial (círculo doble)
- `())` = Nodo final (círculo doble)
- `{{{{ }}}}` = Decisión (diamante)
- `[""]` = Actividad (rectángulo)

## Flujos definidos

- Inicio → Acceder a Mis Visitas en la aplicación
- Acceder a Mis Visitas en la aplicación → Seleccionar visita activa (restaurante con entrada sin salida)
- Seleccionar visita activa (restaurante con entrada sin salida) → Confirmar selección de restaurante
- Confirmar selección de restaurante → ¿El cliente tuvo acompañantes?
- Si **No**: ¿El cliente tuvo acompañantes? → Registrar timestamp de salida
- Si **Sí**: ¿El cliente tuvo acompañantes? → Confirmar número de acompañantes originales
- Confirmar número de acompañantes originales → Registrar timestamp de salida
- Registrar timestamp de salida → Calcular duración de la visita (salida - entrada)
- Calcular duración de la visita (salida - entrada) → Actualizar registro:<br/>- Timestamp salida<br/>- Duración calculada<br/>- Estado: completado
- Actualizar registro:<br/>- Timestamp salida<br/>- Duración calculada<br/>- Estado: completado → Decrementar contador de ocupación actual
- Decrementar contador de ocupación actual → ¿Desea valorar el restaurante?
- Si **No**: ¿Desea valorar el restaurante? → Fin - Salida registrada
- Si **Sí**: ¿Desea valorar el restaurante? → Ir a valoración