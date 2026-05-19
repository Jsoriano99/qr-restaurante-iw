# Generación de Código QR

```mermaid
activityDiagram
    title: Generación de Código QR

    start
    : Inicio --> Solicitar generación de código QR
    : Solicitar generación de código QR --> Verificar que el restaurante está registrado y activo
    : Verificar que el restaurante está registrado y activo --> ¿Restaurante válido?
    : ¿Restaurante válido? --> if "Restaurante válido" --> Generar identificador único (UUID) para el código QR
    : ¿Restaurante válido? --> if "Restaurante no válido" --> Fin - Error
    : Generar identificador único (UUID) para el código QR --> Codificar información en formato QR - - ID restaurante - ID mesa/acceso - Timestamp - Hash de validación
    : Codificar información en formato QR - - ID restaurante - ID mesa/acceso - Timestamp - Hash de validación --> Generar imagen del código QR
    : Generar imagen del código QR --> Almacenar código QR generado en la base de datos
    : Almacenar código QR generado en la base de datos --> Entregar código QR al restaurante para impresión
    : Entregar código QR al restaurante para impresión --> Fin - Éxito
    stop
```

## Diagrama en estilo Flujo

```mermaid
flowchart TD
    title("Generación de Código QR")

    N1["Inicio"]:::start
    N2["Solicitar generación de código QR"]
    N3["Verificar que el restaurante está registrado y activo"]
    N4["Generar identificador único (UUID) para el código QR"]
    N5["Codificar información en formato QR:<br/>- ID restaurante<br/>- ID mesa/acceso<br/>- Timestamp<br/>- Hash de validación"]
    N6["Generar imagen del código QR"]
    N7["Almacenar código QR generado en la base de datos"]
    N8["Entregar código QR al restaurante para impresión"]
    N9["Fin - Éxito"]:::end
    E1["Fin - Error"]
    D1{{¿Restaurante válido?}}

    classDef start fill:#90EE90,stroke:#228B22
    classDef end fill:#FFB6C1,stroke:#DC143C

    N1 --> N2
    N2 --> N3
    N3 --> D1
    D1 -->|"Restaurante válido"| N4
    D1 -->|"Restaurante no válido"| E1
    N4 --> N5
    N5 --> N6
    N6 --> N7
    N7 --> N8
    N8 --> N9
```