# Control de Aforo en Tiempo Real

**Actor**: Restaurante / Administrador
**Descripción**: Diagrama de actividad para el control de afición en tiempo real del restaurante

```mermaid
flowchart TD
    title("Control de Aforo en Tiempo Real")

    N1(("Inicio")):::start
    N2["Acceder al panel de control de ocupación"]
    N3["Obtener datos de ocupación:<br/>- Capacidad máxima<br/>- Ocupación actual<br/>- % ocupación<br/>- Historial última hora"]
    N4["Generar notificación de alerta"]
    N5["Notificar al restaurante:<br/>'Capacidad casi llena'"]
    N6["Limitar nuevas entradas"]
    N7["Continuar normalmente"]
    N8["Mostrar gráfico de ocupación en tiempo real"]
    N9["Mostrar gráfico histórico:<br/>- Por día<br/>- Por hora<br/>- Tendencia"]
    N10(("Fin")):::end
    D1{{¿Ocupación > 80%?}}
    D2{{¿Activar modo restrictivo?}}
    D3{{¿Ver histórico de afluencia?}}

    classDef start fill:#90EE90,stroke:#228B22,stroke-width:2px
    classDef end fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
    classDef error fill:#FFD700,stroke:#FF8C00,stroke-width:2px

    N1 --> N2
    N2 --> N3
    N3 --> D1
    D1 -->|"Sí"| N4
    D1 -->|"No"| N7
    N4 --> N5
    N5 --> D2
    D2 -->|"Sí"| N6
    D2 -->|"No"| N7
    N6 --> N8
    N7 --> N8
    N8 --> D3
    D3 -->|"Sí"| N9
    D3 -->|"No"| N10
    N9 --> N10
```

---

## Leyenda

- `(--(` = Nodo inicial (círculo doble)
- `())` = Nodo final (círculo doble)
- `{{{{ }}}}` = Decisión (diamante)
- `[""]` = Actividad (rectángulo)

## Flujos definidos

- Inicio → Acceder al panel de control de ocupación
- Acceder al panel de control de ocupación → Obtener datos de ocupación:<br/>- Capacidad máxima<br/>- Ocupación actual<br/>- % ocupación<br/>- Historial última hora
- Obtener datos de ocupación:<br/>- Capacidad máxima<br/>- Ocupación actual<br/>- % ocupación<br/>- Historial última hora → ¿Ocupación > 80%?
- Si **Sí**: ¿Ocupación > 80%? → Generar notificación de alerta
- Si **No**: ¿Ocupación > 80%? → Continuar normalmente
- Generar notificación de alerta → Notificar al restaurante:<br/>'Capacidad casi llena'
- Notificar al restaurante:<br/>'Capacidad casi llena' → ¿Activar modo restrictivo?
- Si **Sí**: ¿Activar modo restrictivo? → Limitar nuevas entradas
- Si **No**: ¿Activar modo restrictivo? → Continuar normalmente
- Limitar nuevas entradas → Mostrar gráfico de ocupación en tiempo real
- Continuar normalmente → Mostrar gráfico de ocupación en tiempo real
- Mostrar gráfico de ocupación en tiempo real → ¿Ver histórico de afluencia?
- Si **Sí**: ¿Ver histórico de afluencia? → Mostrar gráfico histórico:<br/>- Por día<br/>- Por hora<br/>- Tendencia
- Si **No**: ¿Ver histórico de afluencia? → Fin
- Mostrar gráfico histórico:<br/>- Por día<br/>- Por hora<br/>- Tendencia → Fin