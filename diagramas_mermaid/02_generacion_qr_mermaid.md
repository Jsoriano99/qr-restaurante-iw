# Generación de Código QR

**Actor**: Sistema / Restaurante
**Descripción**: Diagrama de actividad para generar códigos QR únicos por restaurante

```mermaid
flowchart TD
    title("Generación de Código QR")

    N1(("Inicio")):::start
    N2["Solicitar generación de código QR"]
    N3["Verificar que el restaurante está registrado y activo"]
    N4["Generar identificador único (UUID) para el código QR"]
    N5["Codificar información en formato QR:<br/>- ID restaurante<br/>- ID mesa/acceso<br/>- Timestamp<br/>- Hash de validación"]
    N6["Generar imagen del código QR"]
    N7["Almacenar código QR generado en la base de datos"]
    N8["Entregar código QR al restaurante para impresión"]
    N9(("Fin - Éxito")):::end
    E1{{Fin - Error}}:::error
    D1{{¿Restaurante válido?}}

    classDef start fill:#90EE90,stroke:#228B22,stroke-width:2px
    classDef end fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
    classDef error fill:#FFD700,stroke:#FF8C00,stroke-width:2px

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

---

## Leyenda

- `(--(` = Nodo inicial (círculo doble)
- `())` = Nodo final (círculo doble)
- `{{{{ }}}}` = Decisión (diamante)
- `[""]` = Actividad (rectángulo)

## Flujos definidos

- Inicio → Solicitar generación de código QR
- Solicitar generación de código QR → Verificar que el restaurante está registrado y activo
- Verificar que el restaurante está registrado y activo → ¿Restaurante válido?
- Si **Restaurante válido**: ¿Restaurante válido? → Generar identificador único (UUID) para el código QR
- Si **Restaurante no válido**: ¿Restaurante válido? → Fin - Error
- Generar identificador único (UUID) para el código QR → Codificar información en formato QR:<br/>- ID restaurante<br/>- ID mesa/acceso<br/>- Timestamp<br/>- Hash de validación
- Codificar información en formato QR:<br/>- ID restaurante<br/>- ID mesa/acceso<br/>- Timestamp<br/>- Hash de validación → Generar imagen del código QR
- Generar imagen del código QR → Almacenar código QR generado en la base de datos
- Almacenar código QR generado en la base de datos → Entregar código QR al restaurante para impresión
- Entregar código QR al restaurante para impresión → Fin - Éxito