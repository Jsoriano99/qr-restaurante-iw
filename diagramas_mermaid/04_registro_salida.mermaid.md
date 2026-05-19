# Registro de Salida

```mermaid
activityDiagram
    title: Registro de Salida

    start
    : Inicio --> Acceder a Mis Visitas en la aplicación
    : Acceder a Mis Visitas en la aplicación --> Seleccionar visita activa (restaurante con entrada sin salida)
    : Seleccionar visita activa (restaurante con entrada sin salida) --> Confirmar selección de restaurante
    : Confirmar selección de restaurante --> ¿El cliente tuvo acompañantes?
    : ¿El cliente tuvo acompañantes? --> if "No" --> Registrar timestamp de salida
    : ¿El cliente tuvo acompañantes? --> if "Sí" --> Confirmar número de acompañantes originales
    : Confirmar número de acompañantes originales --> Registrar timestamp de salida
    : Registrar timestamp de salida --> Calcular duración de la visita (salida - entrada)
    : Calcular duración de la visita (salida - entrada) --> Actualizar registro - - Timestamp salida - Duración calculada - Estado - completado
    : Actualizar registro - - Timestamp salida - Duración calculada - Estado - completado --> Decrementar contador de ocupación actual
    : Decrementar contador de ocupación actual --> ¿Desea valorar el restaurante?
    : ¿Desea valorar el restaurante? --> if "No" --> Fin - Salida registrada
    : ¿Desea valorar el restaurante? --> if "Sí" --> Ir a valoración
    stop
```

## Diagrama en estilo Flujo

```mermaid
flowchart TD
    title("Registro de Salida")

    N1["Inicio"]:::start
    N2["Acceder a Mis Visitas en la aplicación"]
    N3["Seleccionar visita activa (restaurante con entrada sin salida)"]
    N4["Confirmar selección de restaurante"]
    N5["Confirmar número de acompañantes originales"]
    N6["Registrar timestamp de salida"]
    N7["Calcular duración de la visita (salida - entrada)"]
    N8["Actualizar registro:<br/>- Timestamp salida<br/>- Duración calculada<br/>- Estado: completado"]
    N9["Decrementar contador de ocupación actual"]
    N10["Ir a valoración"]
    N11["Fin - Salida registrada"]:::end
    E1["Fin - Valoración"]:::end
    D1{{¿El cliente tuvo acompañantes?}}
    D2{{¿Desea valorar el restaurante?}}

    classDef start fill:#90EE90,stroke:#228B22
    classDef end fill:#FFB6C1,stroke:#DC143C

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