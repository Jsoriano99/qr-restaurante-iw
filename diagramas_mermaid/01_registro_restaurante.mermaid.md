# Registro de Restaurante

```mermaid
activityDiagram
    title: Registro de Restaurante

    start
    : Inicio --> Acceder al formulario de registro de restaurante
    : Acceder al formulario de registro de restaurante --> Introducir datos del restaurante - - Nombre - Dirección - Tipo de cocina - Capacidad máxima - Horario
    : Introducir datos del restaurante - - Nombre - Dirección - Tipo de cocina - Capacidad máxima - Horario --> Validar datos completados
    : ¿Datos válidos? --> if "Datos válidos" --> Guardar restaurante en la base de datos
    : Mostrar error --> if "Repetir desde entrada" --> Introducir datos del restaurante - - Nombre - Dirección - Tipo de cocina - Capacidad máxima - Horario
    : Guardar restaurante en la base de datos --> Generar código QR único
    : Generar código QR único --> Asignar identificador único al restaurante
    : Asignar identificador único al restaurante --> Confirmar registro exitoso al restaurante
    : Confirmar registro exitoso al restaurante --> Fin
    stop
```

## Diagrama en estilo Flujo

```mermaid
flowchart TD
    %% Nodos
    N1["Inicio"]
    N2["Acceder al formulario de registro de restaurante"]
    N3["Introducir datos del restaurante:<br/>- Nombre<br/>- Dirección<br/>- Tipo de cocina<br/>- Capacidad máxima<br/>- Horario"]
    N4["Validar datos completados"]
    N5["Guardar restaurante en la base de datos"]
    N6["Generar código QR único"]
    N7["Asignar identificador único al restaurante"]
    N8["Confirmar registro exitoso al restaurante"]
    N9["Fin"]
    E1["Mostrar error"]
    D1{{"¿Datos válidos?"}}

    %% Estilos
    classDef start fill:#90EE90,stroke:#228B22,color:black
    classDef endClass fill:#FFB6C1,stroke:#DC143C,color:black

    %% Conexiones
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> D1
    D1 -->|"Datos válidos"| N5
    D1 -->|"Datos inválidos"| E1
    E1 -->|"Repetir"| N3
    N5 --> N6
    N6 --> N7
    N7 --> N8
    N8 --> N9

    %% Asignación de estilos
    class N1 start
    class N9 endClass
```