# Escaneo y Registro de Entrada

**Actor**: Cliente
**Descripción**: Diagrama de actividad para el escaneo de código QR y registro de entrada al restaurante

```mermaid
flowchart TD
    title("Escaneo y Registro de Entrada")

    N1(("Inicio")):::start
    N2["Abrir aplicación de escaneo en el dispositivo móvil"]
    N3["Permitir cámara para escanear código QR"]
    N4["Escanear código QR del restaurante/mesa"]
    N5["Decodificar datos del QR"]
    N6["Validar código QR:<br/>- Verificar formato<br/>- Verificar hash<br/>- Verificar expiración"]
    N7["Obtener información del restaurante"]
    N8["Verificar capacidad actual vs. máxima"]
    N9["Registrar entrada con:<br/>- Timestamp actual<br/>- ID restaurante<br/>- ID código QR<br/>- ID cliente (opcional)"]
    N10["Incrementar contador de ocupación actual"]
    N11["Solicitar número de acompañantes"]
    N12["Validar número (1-10)"]
    N13["Registrar acompañantes en la entrada"]
    N14["Actualizar contador de ocupación (+ acompañantes)"]
    N15(("Fin - Entrada con acompañantes")):::end
    E1{{Fin - Error}}:::error
    E2{{Fin - Error}}:::error
    E3{{Fin - Error}}:::error
    E4(("Fin - Entrada registrada")):::end
    E5{{Mostrar error}}:::error
    D1{{¿Permiso concedido?}}
    D2{{¿Código QR válido?}}
    D3{{¿Hay capacidad?}}
    D4{{¿Registrar acompañantes?}}
    D5{{¿Número válido?}}

    classDef start fill:#90EE90,stroke:#228B22,stroke-width:2px
    classDef end fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
    classDef error fill:#FFD700,stroke:#FF8C00,stroke-width:2px

    N1 --> N2
    N2 --> N3
    N3 --> D1
    D1 -->|"Permiso concedido"| N4
    D1 -->|"Permiso denegado"| E1
    N4 --> N5
    N5 --> N6
    N6 --> D2
    D2 -->|"Código válido"| N7
    D2 -->|"Código inválido"| E2
    N7 --> N8
    N8 --> D3
    D3 -->|"Hay capacidad disponible"| N9
    D3 -->|"Restaurante completo"| E3
    N9 --> N10
    N10 --> D4
    D4 -->|"Sí"| N11
    D4 -->|"No"| E4
    N11 --> N12
    N12 --> D5
    D5 -->|"Número válido"| N13
    D5 -->|"Número inválido"| E5
    N13 --> N14
    N14 --> N15
```

---

## Leyenda

- `(--(` = Nodo inicial (círculo doble)
- `())` = Nodo final (círculo doble)
- `{{{{ }}}}` = Decisión (diamante)
- `[""]` = Actividad (rectángulo)

## Flujos definidos

- Inicio → Abrir aplicación de escaneo en el dispositivo móvil
- Abrir aplicación de escaneo en el dispositivo móvil → Permitir cámara para escanear código QR
- Permitir cámara para escanear código QR → ¿Permiso concedido?
- Si **Permiso concedido**: ¿Permiso concedido? → Escanear código QR del restaurante/mesa
- Si **Permiso denegado**: ¿Permiso concedido? → Fin - Error
- Escanear código QR del restaurante/mesa → Decodificar datos del QR
- Decodificar datos del QR → Validar código QR:<br/>- Verificar formato<br/>- Verificar hash<br/>- Verificar expiración
- Validar código QR:<br/>- Verificar formato<br/>- Verificar hash<br/>- Verificar expiración → ¿Código QR válido?
- Si **Código válido**: ¿Código QR válido? → Obtener información del restaurante
- Si **Código inválido**: ¿Código QR válido? → Fin - Error
- Obtener información del restaurante → Verificar capacidad actual vs. máxima
- Verificar capacidad actual vs. máxima → ¿Hay capacidad?
- Si **Hay capacidad disponible**: ¿Hay capacidad? → Registrar entrada con:<br/>- Timestamp actual<br/>- ID restaurante<br/>- ID código QR<br/>- ID cliente (opcional)
- Si **Restaurante completo**: ¿Hay capacidad? → Fin - Error
- Registrar entrada con:<br/>- Timestamp actual<br/>- ID restaurante<br/>- ID código QR<br/>- ID cliente (opcional) → Incrementar contador de ocupación actual
- Incrementar contador de ocupación actual → ¿Registrar acompañantes?
- Si **Sí**: ¿Registrar acompañantes? → Solicitar número de acompañantes
- Si **No**: ¿Registrar acompañantes? → Fin - Entrada registrada
- Solicitar número de acompañantes → Validar número (1-10)
- Validar número (1-10) → ¿Número válido?
- Si **Número válido**: ¿Número válido? → Registrar acompañantes en la entrada
- Si **Número inválido**: ¿Número válido? → Mostrar error
- Registrar acompañantes en la entrada → Actualizar contador de ocupación (+ acompañantes)
- Actualizar contador de ocupación (+ acompañantes) → Fin - Entrada con acompañantes