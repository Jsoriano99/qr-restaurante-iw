# Registro de Restaurante

**Actor**: Administrador / Restaurante
**Descripción**: Diagrama de actividad para el registro de un nuevo restaurante en el sistema

```mermaid
flowchart TD
    title("Registro de Restaurante")

    N1(("Inicio")):::start
    N2["Acceder al formulario de registro de restaurante"]
    N3["Introducir datos del restaurante:<br/>- Nombre<br/>- Dirección<br/>- Tipo de cocina<br/>- Capacidad máxima<br/>- Horario"]
    N4["Validar datos completados"]
    N5["Guardar restaurante en la base de datos"]
    N6["Generar código QR único"]
    N7["Asignar identificador único al restaurante"]
    N8["Confirmar registro exitoso al restaurante"]
    N9(("Fin")):::end
    E1{{Mostrar error}}:::error
    D1{{¿Datos válidos?}}

    classDef start fill:#90EE90,stroke:#228B22,stroke-width:2px
    classDef end fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
    classDef error fill:#FFD700,stroke:#FF8C00,stroke-width:2px

    N1 --> N2
    N2 --> N3
    N3 --> N4
    D1 -->|"Datos válidos"| N5
    E1 -->|"Repetir desde entrada"| N3
    N5 --> N6
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

- Inicio → Acceder al formulario de registro de restaurante
- Acceder al formulario de registro de restaurante → Introducir datos del restaurante:<br/>- Nombre<br/>- Dirección<br/>- Tipo de cocina<br/>- Capacidad máxima<br/>- Horario
- Introducir datos del restaurante:<br/>- Nombre<br/>- Dirección<br/>- Tipo de cocina<br/>- Capacidad máxima<br/>- Horario → Validar datos completados
- Si **Datos válidos**: ¿Datos válidos? → Guardar restaurante en la base de datos
- Si **Repetir desde entrada**: Mostrar error → Introducir datos del restaurante:<br/>- Nombre<br/>- Dirección<br/>- Tipo de cocina<br/>- Capacidad máxima<br/>- Horario
- Guardar restaurante en la base de datos → Generar código QR único
- Generar código QR único → Asignar identificador único al restaurante
- Asignar identificador único al restaurante → Confirmar registro exitoso al restaurante
- Confirmar registro exitoso al restaurante → Fin