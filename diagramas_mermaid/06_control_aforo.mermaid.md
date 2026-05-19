# Control de Aforo en Tiempo Real

```mermaid
activityDiagram
    title: Control de Aforo en Tiempo Real

    start
    : Inicio --> Acceder al panel de control de ocupación
    : Acceder al panel de control de ocupación --> Obtener datos de ocupación - - Capacidad máxima - Ocupación actual - % ocupación - Historial última hora
    : Obtener datos de ocupación - - Capacidad máxima - Ocupación actual - % ocupación - Historial última hora --> ¿Ocupación > 80%?
    : ¿Ocupación > 80%? --> if "Sí" --> Generar notificación de alerta
    : ¿Ocupación > 80%? --> if "No" --> Continuar normalmente
    : Generar notificación de alerta --> Notificar al restaurante - 'Capacidad casi llena'
    : Notificar al restaurante - 'Capacidad casi llena' --> ¿Activar modo restrictivo?
    : ¿Activar modo restrictivo? --> if "Sí" --> Limitar nuevas entradas
    : ¿Activar modo restrictivo? --> if "No" --> Continuar normalmente
    : Limitar nuevas entradas --> Mostrar gráfico de ocupación en tiempo real
    : Continuar normalmente --> Mostrar gráfico de ocupación en tiempo real
    : Mostrar gráfico de ocupación en tiempo real --> ¿Ver histórico de afluencia?
    : ¿Ver histórico de afluencia? --> if "Sí" --> Mostrar gráfico histórico - - Por día - Por hora - Tendencia
    : ¿Ver histórico de afluencia? --> if "No" --> Fin
    : Mostrar gráfico histórico - - Por día - Por hora - Tendencia --> Fin
    stop
```

## Diagrama en estilo Flujo

```mermaid
flowchart TD
    title("Control de Aforo en Tiempo Real")

    N1["Inicio"]:::start
    N2["Acceder al panel de control de ocupación"]
    N3["Obtener datos de ocupación:<br/>- Capacidad máxima<br/>- Ocupación actual<br/>- % ocupación<br/>- Historial última hora"]
    N4["Generar notificación de alerta"]
    N5["Notificar al restaurante:<br/>'Capacidad casi llena'"]
    N6["Limitar nuevas entradas"]
    N7["Continuar normalmente"]
    N8["Mostrar gráfico de ocupación en tiempo real"]
    N9["Mostrar gráfico histórico:<br/>- Por día<br/>- Por hora<br/>- Tendencia"]
    N10["Fin"]:::end
    D1{{¿Ocupación > 80%?}}
    D2{{¿Activar modo restrictivo?}}
    D3{{¿Ver histórico de afluencia?}}

    classDef start fill:#90EE90,stroke:#228B22
    classDef end fill:#FFB6C1,stroke:#DC143C

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